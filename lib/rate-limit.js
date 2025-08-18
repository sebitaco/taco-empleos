import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'memory://localhost',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '15 m'),
  analytics: true,
})

export const dailyRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 d'),
  analytics: true,
})