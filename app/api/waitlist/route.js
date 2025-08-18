import { createClient } from '@/lib/supabase/server'
import { ratelimit, dailyRateLimit } from '@/lib/rate-limit'
import { NextResponse } from 'next/server'

// Get real IP address
function getIP(request) {
  const xff = request.headers.get('x-forwarded-for')
  const realip = request.headers.get('x-real-ip')
  const cfip = request.headers.get('cf-connecting-ip')
  
  if (cfip) return cfip
  if (realip) return realip.split(',')[0].trim()
  if (xff) return xff.split(',')[0].trim()
  return '127.0.0.1'
}

// Verify Turnstile token
async function verifyTurnstile(token) {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    return true // Skip verification in development
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  })

  const result = await response.json()
  return result.success
}

export async function POST(request) {
  try {
    const ip = getIP(request)
    
    // Rate limiting
    const [rateResult, dailyResult] = await Promise.all([
      ratelimit.limit(ip),
      dailyRateLimit.limit(ip)
    ])

    if (!rateResult.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta nuevamente en 15 minutos.' },
        { status: 429 }
      )
    }

    if (!dailyResult.success) {
      return NextResponse.json(
        { error: 'Límite diario alcanzado. Intenta mañana.' },
        { status: 429 }
      )
    }

    const supabase = await createClient()
    const body = await request.json()

    const {
      audience,
      email,
      city,
      source,
      consent,
      companyName,
      needs,
      role,
      experienceYears,
      preferredCity,
      turnstileToken
    } = body

    if (!email || !city || !consent || !audience) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verify Turnstile token
    if (process.env.TURNSTILE_SECRET_KEY && turnstileToken) {
      const isValidToken = await verifyTurnstile(turnstileToken)
      if (!isValidToken) {
        return NextResponse.json(
          { error: 'Verificación de seguridad fallida' },
          { status: 400 }
        )
      }
    }

    if (audience === 'employer' && !companyName) {
      return NextResponse.json(
        { error: 'El nombre de la empresa es requerido' },
        { status: 400 }
      )
    }

    if (audience === 'candidate' && (!role || !experienceYears)) {
      return NextResponse.json(
        { error: 'El rol y años de experiencia son requeridos' },
        { status: 400 }
      )
    }

    const insertData = {
      audience,
      email: email.toLowerCase().trim(),
      city,
      source: source || null,
      consent,
      company_name: audience === 'employer' ? companyName : null,
      needs: audience === 'employer' ? needs : null,
      role: audience === 'candidate' ? role : null,
      experience_years: audience === 'candidate' ? experienceYears : null,
      preferred_city: audience === 'candidate' ? preferredCity : null,
    }

    const { data, error } = await supabase
      .from('waitlist')
      .insert(insertData)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Este email ya está registrado para esta audiencia' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Registro exitoso en lista de espera',
        id: data[0]?.id 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}