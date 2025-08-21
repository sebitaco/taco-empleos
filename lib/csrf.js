import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { getSecureCookieName, getSecureCookieConfig, COOKIE_SECURITY_LEVELS } from '@/lib/security/cookie-security'

// Generate a deterministic secret from env variable or use a default
const JWT_SECRET = new TextEncoder().encode(
  process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production'
)

// CSRF configuration with enhanced security
const CSRF_COOKIE_BASE_NAME = 'csrf-token'
const CSRF_COOKIE_NAME = getSecureCookieName(CSRF_COOKIE_BASE_NAME, COOKIE_SECURITY_LEVELS.HIGHEST)
const CSRF_HEADER_NAME = 'x-csrf-token'
const TOKEN_EXPIRY_SECONDS = 3600 // 1 hour

export async function generateCSRFToken() {
  // Use Web Crypto API for edge runtime compatibility
  const randomBytes = new Uint8Array(32)
  crypto.getRandomValues(randomBytes)
  const tokenValue = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  
  const jwt = await new SignJWT({ csrf: tokenValue })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_EXPIRY_SECONDS}s`)
    .sign(JWT_SECRET)
  
  return jwt
}

export async function setCSRFToken() {
  const token = await generateCSRFToken()
  const cookieStore = await cookies()
  
  // Get secure cookie configuration for CSRF tokens
  const cookieOptions = getSecureCookieConfig(
    CSRF_COOKIE_NAME,
    COOKIE_SECURITY_LEVELS.HIGHEST,
    { 
      maxAge: TOKEN_EXPIRY_SECONDS,
      domain: process.env.COOKIE_DOMAIN
    }
  )
  
  cookieStore.set(CSRF_COOKIE_NAME, token, cookieOptions)
  
  return token
}

export async function getCSRFToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get(CSRF_COOKIE_NAME)
  
  if (!token?.value) {
    return await setCSRFToken()
  }
  
  try {
    const { payload } = await jwtVerify(token.value, JWT_SECRET)
    return token.value
  } catch (error) {
    return await setCSRFToken()
  }
}

export async function validateCSRFToken(request) {
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)
  const headerToken = request.headers.get(CSRF_HEADER_NAME)
  
  if (!cookieToken?.value || !headerToken) {
    return { valid: false, error: 'Missing CSRF token' }
  }
  
  if (cookieToken.value !== headerToken) {
    return { valid: false, error: 'CSRF token mismatch' }
  }
  
  try {
    const { payload } = await jwtVerify(cookieToken.value, JWT_SECRET)
    return { valid: true }
  } catch (error) {
    return { valid: false, error: 'Invalid or expired CSRF token' }
  }
}

export function shouldValidateCSRF(pathname, method) {
  const exemptPaths = [
    '/api/health',
    '/api/sitemap'
  ]
  
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return false
  }
  
  if (exemptPaths.includes(pathname)) {
    return false
  }
  
  return true
}