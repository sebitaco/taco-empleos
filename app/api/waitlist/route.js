import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sanitizeFormData, hasXSSPattern } from '@/lib/security'
import { validateCSRFToken } from '@/lib/csrf'
import { withErrorHandler, createValidationError, createRateLimitError } from '@/lib/errorHandler'
import { checkRateLimit, getIPAddress, getRateLimitHeaders, getRateLimitErrorMessage } from '@/lib/ratelimit'

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

async function handlePOST(request) {
  try {
    // Validate CSRF token first
    const csrfResult = await validateCSRFToken(request)
    if (!csrfResult.valid) {
      return NextResponse.json(
        { error: csrfResult.error },
        { status: 403 }
      )
    }
    
    // Get IP address for rate limiting
    const ip = getIPAddress(request)
    
    // Check rate limit with dual windows (15 min and daily)
    const rateResult = await checkRateLimit(ip)

    if (!rateResult.success) {
      // Return rate limit error with proper headers
      const errorMessage = getRateLimitErrorMessage(rateResult)
      const headers = getRateLimitHeaders(rateResult)
      
      return NextResponse.json(
        { 
          error: errorMessage,
          retryAfter: headers['Retry-After'] ? parseInt(headers['Retry-After']) : null
        },
        { 
          status: 429,
          headers: Object.fromEntries(
            Object.entries(headers).filter(([_, v]) => v !== undefined)
          )
        }
      )
    }

    // Create a simple anonymous client for API route - SAME AS job_postings
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
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
      throw createValidationError('Faltan campos requeridos')
    }

    // Additional XSS validation (defense in depth)
    const inputsToCheck = [email, city, companyName, needs, role].filter(Boolean)
    for (const input of inputsToCheck) {
      if (hasXSSPattern(input)) {
        throw createValidationError('Los datos contienen caracteres no válidos')
      }
    }

    // Validate audience enum
    if (!['employer', 'candidate'].includes(audience)) {
      throw createValidationError('Tipo de usuario no válido')
    }

    // Verify Turnstile token
    if (process.env.TURNSTILE_SECRET_KEY && turnstileToken) {
      const isValidToken = await verifyTurnstile(turnstileToken)
      if (!isValidToken) {
        throw createValidationError('Verificación de seguridad fallida')
      }
    }

    if (audience === 'employer' && !companyName) {
      throw createValidationError('El nombre de la empresa es requerido')
    }

    if (audience === 'candidate' && !role) {
      throw createValidationError('La posición es requerida')
    }

    const insertData = {
      audience,
      email, // Already sanitized and validated
      city, // Already sanitized
      source: null,
      consent,
      company_name: audience === 'employer' ? companyName : null,
      needs: audience === 'employer' ? needs : null,
      role: audience === 'candidate' ? role : null,
      experience_years: null,
      preferred_city: null,
    }

    const { data, error } = await supabase
      .from('waitlist')
      .insert(insertData, { returning: 'minimal' })

    if (error) {
      // Handle specific database constraint errors
      if (error.code === '23505') {
        const duplicateError = new Error('Este email ya está registrado para esta audiencia')
        duplicateError.code = '23505'
        throw duplicateError
      }
      
      // For any other database error, throw with original error for proper logging
      throw error
    }

    // Add rate limit headers to successful response too
    const successHeaders = getRateLimitHeaders(rateResult)
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Registro exitoso en lista de espera'
      },
      { 
        status: 201,
        headers: Object.fromEntries(
          Object.entries(successHeaders).filter(([_, v]) => v !== undefined)
        )
      }
    )

  } catch (error) {
    // Error handling is now managed by withErrorHandler wrapper
    throw error
  }
}

// Export wrapped handler
export const POST = withErrorHandler(handlePOST)