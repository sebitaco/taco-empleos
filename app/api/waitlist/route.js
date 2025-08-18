import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sanitizeFormData, hasXSSPattern, sanitizeErrorMessage } from '@/lib/security'
import { validateCSRFToken } from '@/lib/csrf'

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

// Simple in-memory rate limiting for development
const requestCounts = new Map()

function checkRateLimit(ip) {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 3

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, [])
  }

  const requests = requestCounts.get(ip)
  // Remove old requests outside the window
  const recentRequests = requests.filter(timestamp => now - timestamp < windowMs)
  
  if (recentRequests.length >= maxRequests) {
    return { success: false }
  }

  recentRequests.push(now)
  requestCounts.set(ip, recentRequests)
  return { success: true }
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
    // Validate CSRF token first
    const csrfResult = await validateCSRFToken(request)
    if (!csrfResult.valid) {
      return NextResponse.json(
        { error: csrfResult.error },
        { status: 403 }
      )
    }
    
    const ip = getIP(request)
    
    // Simple rate limiting for development
    const rateResult = checkRateLimit(ip)

    if (!rateResult.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta nuevamente en 15 minutos.' },
        { status: 429 }
      )
    }

    const supabase = await createClient()
    const body = await request.json()

    // Sanitize all input data
    const sanitizedData = sanitizeFormData(body)
    const turnstileToken = body.turnstileToken

    const {
      audience,
      email,
      city,
      consent,
      companyName,
      needs,
      role
    } = sanitizedData

    // Basic required field validation
    if (!email || !city || !consent || !audience) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Additional XSS validation (defense in depth)
    const inputsToCheck = [email, city, companyName, needs, role].filter(Boolean)
    for (const input of inputsToCheck) {
      if (hasXSSPattern(input)) {
        return NextResponse.json(
          { error: 'Los datos contienen caracteres no válidos' },
          { status: 400 }
        )
      }
    }

    // Validate audience enum
    if (!['employer', 'candidate'].includes(audience)) {
      return NextResponse.json(
        { error: 'Tipo de usuario no válido' },
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

    // Role is now optional for candidates

    const insertData = {
      audience,
      email, // Already sanitized and validated
      city, // Already sanitized
      source: null,
      consent,
      company_name: audience === 'employer' ? companyName : null,
      needs: audience === 'employer' ? needs : null,
      role: audience === 'candidate' ? (role || null) : null,
      experience_years: null,
      preferred_city: null,
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