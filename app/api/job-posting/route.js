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

    // Create a simple anonymous client for API route
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    const body = await request.json()

    // Sanitize all input data
    const sanitizedData = sanitizeFormData(body)
    const turnstileToken = body.turnstileToken

    // Log the incoming data for debugging
    console.log('Received job posting data:', { body, sanitizedData })

    const {
      email,
      city,
      consent,
      restaurantName,
      contactName,
      contactPhone,
      position,
      salary,
      description
    } = sanitizedData

    // Basic required field validation with detailed logging
    const missingFields = []
    if (!email?.trim()) missingFields.push('email')
    if (!city?.trim()) missingFields.push('city')
    if (!consent) missingFields.push('consent')
    if (!restaurantName?.trim()) missingFields.push('restaurantName')
    if (!contactName?.trim()) missingFields.push('contactName')
    if (!contactPhone?.trim()) missingFields.push('contactPhone')
    if (!position?.trim()) missingFields.push('position')
    if (!description?.trim()) missingFields.push('description')

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields)
      console.log('Field values:', { email, city, consent, restaurantName, contactName, contactPhone, position, description })
      throw createValidationError(`Faltan campos requeridos: ${missingFields.join(', ')}`)
    }

    // Additional XSS validation (defense in depth)
    const inputsToCheck = [email, city, restaurantName, contactName, contactPhone, position, salary, description].filter(Boolean)
    for (const input of inputsToCheck) {
      if (hasXSSPattern(input)) {
        throw createValidationError('Los datos contienen caracteres no válidos')
      }
    }

    // Verify Turnstile token
    if (process.env.TURNSTILE_SECRET_KEY && turnstileToken) {
      const isValidToken = await verifyTurnstile(turnstileToken)
      if (!isValidToken) {
        throw createValidationError('Verificación de seguridad fallida')
      }
    }

    // Create job posting record
    const insertData = {
      email,
      city,
      restaurant_name: restaurantName,
      contact_name: contactName,
      contact_phone: contactPhone,
      position,
      salary: salary || null,
      description,
      consent,
      status: 'pending', // For review
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('job_postings')
      .insert(insertData, { returning: 'minimal' })

    if (error) {
      // Handle specific database constraint errors
      if (error.code === '23505') {
        const duplicateError = new Error('Ya existe una solicitud similar. Revisa tu correo.')
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
        message: 'Vacante enviada exitosamente. La revisaremos en las próximas horas.'
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