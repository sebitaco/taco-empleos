import { NextResponse } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { createAuthMiddleware, defaultAuthConfig } from '@/lib/auth/middleware'

// Create the authorization middleware with our configuration
const authMiddleware = createAuthMiddleware(defaultAuthConfig)

// Clerk route matcher for protected routes (none for now - we use client-side gating)
const isProtectedRoute = createRouteMatcher([
  // We're not protecting any routes by default
  // Users can browse freely until they hit the job view limit
])

// Wrap the existing middleware with Clerk
export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl
  const method = request.method
  
  // Apply Clerk protection if route is protected (none for now)
  if (isProtectedRoute(request)) auth().protect()
  
  // TODO: Re-enable auth middleware after testing
  // const authResponse = await authMiddleware(request)
  // if (authResponse.status !== 200 && authResponse.url !== request.url) {
  //   return authResponse
  // }
  
  // Create response and add security headers
  const response = NextResponse.next()
  
  // Security headers as per CLAUDE.md OWASP alignment requirements
  // Remove information disclosure headers
  response.headers.delete('X-Powered-By')
  
  // Force override any default Next.js headers
  response.headers.delete('X-Frame-Options')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  // Permissions Policy - restrict browser features
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()')
  
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
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' challenges.cloudflare.com plausible.io *.clerk.accounts.dev",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: img.clerk.com",
    "font-src 'self'",
    "connect-src 'self' challenges.cloudflare.com plausible.io *.supabase.co *.upstash.io api.clerk.dev clerk.*.lcl.dev *.clerk.accounts.dev",
    "frame-src challenges.cloudflare.com *.clerk.accounts.dev",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  return response
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}