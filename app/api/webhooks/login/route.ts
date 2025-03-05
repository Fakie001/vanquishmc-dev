import { NextResponse } from "next/server"
import { isRateLimited } from "@/lib/rate-limit"
import type { TebexLoginResponse } from "@/types/webhooks"

// Rate limit configuration: 5 attempts per minute
const RATE_LIMIT_CONFIG = {
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
}

// Declare BANNED_USERS array.  Populate with actual banned users as needed.
const BANNED_USERS = ["user1", "user2"] //Example - replace with your actual banned users

// Declare BANNED_COUNTRIES array. Populate with actual banned countries as needed.
const BANNED_COUNTRIES = ["CountryA", "CountryB"] //Example - replace with your actual banned countries

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ign = searchParams.get("ign")
    const ip = searchParams.get("ip")
    const country = searchParams.get("country")

    if (!ign || !ip || !country) {
      return NextResponse.json<TebexLoginResponse>(
        {
          verified: false,
          error: "Missing required parameters",
        },
        { status: 400 },
      )
    }

    // Check rate limit
    const rateLimited = await isRateLimited(ip, RATE_LIMIT_CONFIG)
    if (rateLimited) {
      return NextResponse.json<TebexLoginResponse>({
        verified: false,
        error: "Too many login attempts. Please try again later.",
      })
    }

    // Log the verification attempt
    console.log(`Login verification attempt: ${ign} from ${country} (${ip})`)

    // Check if user is banned
    if (BANNED_USERS.includes(ign.toLowerCase())) {
      return NextResponse.json<TebexLoginResponse>({
        verified: false,
        error: "You are banned from accessing our store.",
      })
    }

    // Check if country is banned
    if (BANNED_COUNTRIES.includes(country)) {
      return NextResponse.json<TebexLoginResponse>({
        verified: false,
        error: "Access to the store is not available in your country.",
      })
    }

    // If all checks pass, allow login
    return NextResponse.json<TebexLoginResponse>({
      verified: true,
      message: `Welcome back, ${ign}!`,
    })
  } catch (error) {
    console.error("Login webhook error:", error)
    return NextResponse.json<TebexLoginResponse>(
      {
        verified: false,
        error: "An error occurred while processing your login.",
      },
      { status: 500 },
    )
  }
}

