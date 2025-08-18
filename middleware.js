import { NextResponse } from 'next/server'
import { createAuthMiddleware, defaultAuthConfig } from '@/lib/auth/middleware'

// Create the authorization middleware with our configuration
const authMiddleware = createAuthMiddleware(defaultAuthConfig)

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const method = request.method
  
  // Apply authorization checks first
  const authResponse = await authMiddleware(request)
  if (authResponse.status !== 200 && authResponse.url !== request.url) {
    return authResponse
  }
  
  // Add security headers to all responses
  const response = authResponse.status === 200 ? authResponse : NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://plausible.io",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://challenges.cloudflare.com https://plausible.io https://*.supabase.co",
    "frame-src https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}