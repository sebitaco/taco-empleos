import { NextResponse } from 'next/server'

// Environment check for development/production error handling
const isDevelopment = process.env.NODE_ENV === 'development'

// Generic error messages for different types of errors
const ERROR_MESSAGES = {
  VALIDATION: 'Datos de entrada no válidos',
  AUTHENTICATION: 'Acceso no autorizado',
  RATE_LIMIT: 'Demasiadas solicitudes. Intenta nuevamente más tarde',
  NOT_FOUND: 'Recurso no encontrado',
  SERVER_ERROR: 'Error interno del servidor',
  DATABASE: 'Error en la base de datos',
  NETWORK: 'Error de conexión',
  FORBIDDEN: 'Acceso denegado'
}

// Security-focused error codes that should never expose internal details
const SENSITIVE_ERROR_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /key/i,
  /connection.*refused/i,
  /postgres/i,
  /supabase/i,
  /database.*error/i,
  /sql/i,
  // Temporarily comment out constraint and RLS patterns for debugging in development
  ...(process.env.NODE_ENV === 'production' ? [
    /constraint/i,
    /relation.*does.*not.*exist/i,
    /column.*does.*not.*exist/i,
    /permission.*denied/i,
    /authentication.*failed/i,
    /invalid.*credentials/i,
    /row.*level.*security/i,
    /rls/i,
    /policy/i
  ] : [])
]

// Log error details securely for monitoring
function logError(error, context = {}) {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    context: {
      ...context,
      // Remove sensitive data from context
      ip: context.ip ? context.ip.replace(/\d+$/, 'XXX') : undefined
    }
  }

  // In production, you would send this to your monitoring service (Sentry)
  console.error('Application Error:', errorInfo)
}

// Sanitize error message for client response
function sanitizeErrorForClient(error) {
  if (!error || typeof error.message !== 'string') {
    return ERROR_MESSAGES.SERVER_ERROR
  }

  const message = error.message

  // Check if error contains sensitive information
  const hasSensitiveInfo = SENSITIVE_ERROR_PATTERNS.some(pattern => 
    pattern.test(message)
  )

  if (hasSensitiveInfo) {
    return ERROR_MESSAGES.SERVER_ERROR
  }

  // In development, show more detailed errors (but still sanitized)
  if (isDevelopment) {
    // Remove HTML/script content and limit length
    let sanitized = message.replace(/<[^>]*>/g, '').substring(0, 200)
    
    // Still hide database-specific errors even in development
    if (SENSITIVE_ERROR_PATTERNS.some(pattern => pattern.test(sanitized))) {
      return ERROR_MESSAGES.SERVER_ERROR
    }
    
    return sanitized
  }

  // In production, return generic error messages
  return ERROR_MESSAGES.SERVER_ERROR
}

// Get appropriate HTTP status code based on error type
function getErrorStatusCode(error) {
  if (error.code === '23505') return 409 // Duplicate entry
  if (error.code === '23503') return 400 // Foreign key constraint
  if (error.code === 'PGRST116') return 404 // Not found
  if (error.name === 'ValidationError') return 400
  if (error.name === 'AuthenticationError') return 401
  if (error.name === 'AuthorizationError') return 403
  if (error.name === 'RateLimitError') return 429
  
  return 500 // Default to internal server error
}

// Create standardized error response
export function createErrorResponse(error, context = {}) {
  const statusCode = getErrorStatusCode(error)
  const clientMessage = sanitizeErrorForClient(error)
  
  // Log the full error details for debugging
  logError(error, context)
  
  // Return sanitized response to client
  return NextResponse.json(
    { 
      error: clientMessage,
      timestamp: new Date().toISOString(),
      // Only include request ID in development for debugging
      ...(isDevelopment && context.requestId && { requestId: context.requestId })
    },
    { status: statusCode }
  )
}

// Async error handler wrapper for API routes
export function withErrorHandler(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context)
    } catch (error) {
      return createErrorResponse(error, {
        ip: getIP(request),
        method: request.method,
        url: request.url,
        userAgent: request.headers.get('user-agent'),
        requestId: crypto.randomUUID()
      })
    }
  }
}

// Validation error helper
export function createValidationError(message) {
  const error = new Error(message)
  error.name = 'ValidationError'
  return error
}

// Rate limit error helper
export function createRateLimitError() {
  const error = new Error('Rate limit exceeded')
  error.name = 'RateLimitError'
  return error
}

// Authentication error helper
export function createAuthError() {
  const error = new Error('Authentication failed')
  error.name = 'AuthenticationError'
  return error
}

// Get real IP address utility
function getIP(request) {
  const xff = request.headers.get('x-forwarded-for')
  const realip = request.headers.get('x-real-ip')
  const cfip = request.headers.get('cf-connecting-ip')
  
  if (cfip) return cfip
  if (realip) return realip.split(',')[0].trim()
  if (xff) return xff.split(',')[0].trim()
  return '127.0.0.1'
}