import { NextResponse } from 'next/server'
import { createAuthMiddleware, defaultAuthConfig } from '@/lib/auth/middleware'

// Create the authorization middleware with our configuration
const authMiddleware = createAuthMiddleware(defaultAuthConfig)

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const method = request.method
  
  // TODO: Re-enable auth middleware after testing
  // const authResponse = await authMiddleware(request)
  // if (authResponse.status !== 200 && authResponse.url !== request.url) {
  //   return authResponse
  // }
  
  // Create response and add security headers
  const response = NextResponse.next()
  
  // Security headers as per CLAUDE.md OWASP alignment requirements
  // Force override any default Next.js headers
  response.headers.delete('X-Frame-Options')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  // Additional cookie security headers
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'same-site')
  
  // Prevent cookie information leakage
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Set cookie security policy hints for browsers
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Expect-CT', 'max-age=86400, enforce')
  }
  
  // Content Security Policy - comprehensive policy for production security
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' challenges.cloudflare.com plausible.io",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self' challenges.cloudflare.com plausible.io *.supabase.co *.upstash.io",
    "frame-src challenges.cloudflare.com",
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