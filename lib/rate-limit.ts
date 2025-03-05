import { Redis } from "@upstash/redis"

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

interface RateLimitConfig {
  maxRequests: number // Maximum number of requests
  windowMs: number // Time window in milliseconds
}

export async function isRateLimited(ip: string, config: RateLimitConfig): Promise<boolean> {
  // If Redis URL is not configured, skip rate limiting
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    console.warn("Redis URL not configured, rate limiting disabled")
    return false
  }

  const key = `rate_limit:${ip}`

  try {
    // Get the current count for this IP
    const currentRequests = await redis.incr(key)

    // If this is the first request, set the expiry
    if (currentRequests === 1) {
      await redis.pexpire(key, config.windowMs)
    }

    return currentRequests > config.maxRequests
  } catch (error) {
    console.error("Rate limit error:", error)
    // If Redis fails, allow the request to proceed
    return false
  }
}

