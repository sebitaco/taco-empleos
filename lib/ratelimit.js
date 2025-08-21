import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let ratelimit = null
let fallbackRateLimiter = null

// Initialize Redis and Ratelimit only if credentials are available
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })

    // Create the main rate limiter with multiple windows
    ratelimit = {
      // 15-minute window: max 3 requests
      shortWindow: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '15m'),
        prefix: 'ratelimit:waitlist:15m',
        analytics: true,
      }),
      // Daily window: max 10 requests
      dailyWindow: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1d'),
        prefix: 'ratelimit:waitlist:daily',
        analytics: true,
      }),
    }
  } catch (error) {
    console.error('Failed to initialize Upstash Redis:', error)
  }
}

// Fallback in-memory rate limiter for development/when Redis is not available
class InMemoryRateLimiter {
  constructor() {
    this.requests = new Map()
  }

  async limit(identifier) {
    const now = Date.now()
    const shortWindowMs = 15 * 60 * 1000 // 15 minutes
    const dailyWindowMs = 24 * 60 * 60 * 1000 // 24 hours
    const maxShortWindow = 3
    const maxDaily = 10

    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, [])
    }

    const userRequests = this.requests.get(identifier)
    
    // Clean up old requests
    const recentRequests = userRequests.filter(timestamp => now - timestamp < dailyWindowMs)
    
    // Check daily limit
    if (recentRequests.length >= maxDaily) {
      const oldestRequest = Math.min(...recentRequests)
      const resetTime = new Date(oldestRequest + dailyWindowMs)
      return {
        success: false,
        limit: maxDaily,
        remaining: 0,
        reset: resetTime,
        reason: 'daily_limit'
      }
    }

    // Check 15-minute window
    const shortWindowRequests = recentRequests.filter(timestamp => now - timestamp < shortWindowMs)
    if (shortWindowRequests.length >= maxShortWindow) {
      const oldestShortRequest = Math.min(...shortWindowRequests)
      const resetTime = new Date(oldestShortRequest + shortWindowMs)
      return {
        success: false,
        limit: maxShortWindow,
        remaining: 0,
        reset: resetTime,
        reason: '15min_limit'
      }
    }

    // Add new request
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    return {
      success: true,
      limit: maxShortWindow,
      remaining: maxShortWindow - shortWindowRequests.length - 1,
      reset: new Date(now + shortWindowMs)
    }
  }

  // Clean up old entries periodically
  cleanup() {
    const now = Date.now()
    const dailyWindowMs = 24 * 60 * 60 * 1000

    for (const [identifier, requests] of this.requests.entries()) {
      const recentRequests = requests.filter(timestamp => now - timestamp < dailyWindowMs)
      if (recentRequests.length === 0) {
        this.requests.delete(identifier)
      } else {
        this.requests.set(identifier, recentRequests)
      }
    }
  }
}

// Create fallback rate limiter instance
if (!ratelimit) {
  fallbackRateLimiter = new InMemoryRateLimiter()
  // Clean up old entries every hour
  setInterval(() => fallbackRateLimiter.cleanup(), 60 * 60 * 1000)
}

/**
 * Check rate limit for a given identifier
 * @param {string} identifier - Usually IP address or user ID
 * @returns {Promise<{success: boolean, limit: number, remaining: number, reset: Date, reason?: string}>}
 */
export async function checkRateLimit(identifier) {
  // Use Upstash if available
  if (ratelimit) {
    try {
      // Check both windows
      const [shortResult, dailyResult] = await Promise.all([
        ratelimit.shortWindow.limit(identifier),
        ratelimit.dailyWindow.limit(identifier)
      ])

      // If either limit is exceeded, return failure
      if (!shortResult.success) {
        return {
          success: false,
          limit: shortResult.limit,
          remaining: shortResult.remaining,
          reset: new Date(shortResult.reset),
          reason: '15min_limit'
        }
      }

      if (!dailyResult.success) {
        return {
          success: false,
          limit: dailyResult.limit,
          remaining: dailyResult.remaining,
          reset: new Date(dailyResult.reset),
          reason: 'daily_limit'
        }
      }

      // Both limits passed
      return {
        success: true,
        limit: shortResult.limit,
        remaining: Math.min(shortResult.remaining, dailyResult.remaining),
        reset: new Date(shortResult.reset)
      }
    } catch (error) {
      console.error('Upstash rate limit check failed:', error)
      // Fall back to in-memory rate limiter on error
      if (fallbackRateLimiter) {
        return await fallbackRateLimiter.limit(identifier)
      }
      // If all else fails, allow the request
      return { success: true, limit: 3, remaining: 3, reset: new Date() }
    }
  }

  // Use in-memory fallback
  if (fallbackRateLimiter) {
    return await fallbackRateLimiter.limit(identifier)
  }

  // If no rate limiter is available, allow the request
  return { success: true, limit: 3, remaining: 3, reset: new Date() }
}

/**
 * Get IP address from request headers
 * @param {Request} request - Next.js request object
 * @returns {string} IP address
 */
export function getIPAddress(request) {
  // Check various headers for the real IP
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  const xRealIP = request.headers.get('x-real-ip')
  const xForwardedFor = request.headers.get('x-forwarded-for')
  
  if (cfConnectingIP) return cfConnectingIP
  if (xRealIP) return xRealIP.split(',')[0].trim()
  if (xForwardedFor) return xForwardedFor.split(',')[0].trim()
  
  // Fallback to localhost
  return '127.0.0.1'
}

/**
 * Format rate limit headers for response
 * @param {Object} rateLimitResult - Result from checkRateLimit
 * @returns {Object} Headers object
 */
export function getRateLimitHeaders(rateLimitResult) {
  return {
    'X-RateLimit-Limit': rateLimitResult.limit?.toString() || '3',
    'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
    'X-RateLimit-Reset': rateLimitResult.reset?.toISOString() || new Date().toISOString(),
    'Retry-After': !rateLimitResult.success 
      ? Math.ceil((rateLimitResult.reset - new Date()) / 1000).toString()
      : undefined
  }
}

/**
 * Get a human-readable error message for rate limit errors
 * @param {Object} rateLimitResult - Result from checkRateLimit
 * @returns {string} Error message in Spanish
 */
export function getRateLimitErrorMessage(rateLimitResult) {
  const resetTime = rateLimitResult.reset
  const now = new Date()
  const diffMs = resetTime - now
  const diffMins = Math.ceil(diffMs / (1000 * 60))
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))

  if (rateLimitResult.reason === 'daily_limit') {
    if (diffHours > 1) {
      return `Has alcanzado el límite diario de solicitudes (10 por día). Por favor, intenta nuevamente en ${diffHours} horas.`
    } else {
      return `Has alcanzado el límite diario de solicitudes (10 por día). Por favor, intenta nuevamente en ${diffMins} minutos.`
    }
  } else {
    return `Demasiadas solicitudes. Por favor, espera ${diffMins} minutos antes de intentar nuevamente.`
  }
}