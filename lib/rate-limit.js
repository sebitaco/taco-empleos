import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create a simple in-memory store for development
class MemoryStore {
  constructor() {
    this.store = new Map()
  }

  async get(key) {
    return this.store.get(key) || null
  }

  async set(key, value) {
    this.store.set(key, value)
  }

  async incr(key) {
    const current = this.store.get(key) || 0
    const newValue = current + 1
    this.store.set(key, newValue)
    return newValue
  }

  async expire(key, seconds) {
    setTimeout(() => {
      this.store.delete(key)
    }, seconds * 1000)
  }
}

// Use Redis if available, otherwise use in-memory store
let redis
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
} else {
  redis = new MemoryStore()
}

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