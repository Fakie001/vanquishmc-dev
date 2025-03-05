import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get("session_token")

    if (!sessionToken) {
      return NextResponse.json({ user: null })
    }

    // Verify session with Tebex
    const response = await fetch("https://plugin.tebex.io/user", {
      headers: {
        "X-Tebex-Secret": process.env.TEBEX_SECRET_KEY!,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ user: null })
    }

    const userData = await response.json()

    return NextResponse.json({
      user: {
        id: userData.id,
        username: userData.username,
        minecraft_username: userData.minecraft_username,
        avatar_url: `https://mc-heads.net/avatar/${userData.minecraft_username}`,
      },
    })
  } catch (error) {
    console.error("Session verification error:", error)
    return NextResponse.json({ user: null })
  }
}

