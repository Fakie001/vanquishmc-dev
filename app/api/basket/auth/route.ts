import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const returnUrl = searchParams.get("returnUrl")
    const basketId = cookies().get("basketId")?.value

    if (!basketId) {
      return NextResponse.json({ authRequired: false })
    }

    const response = await fetch(
      `https://plugin.tebex.io/baskets/${basketId}/auth?returnUrl=${encodeURIComponent(returnUrl || "")}`,
      {
        headers: {
          "X-Tebex-Secret": process.env.TEBEX_SECRET_KEY!,
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Tebex API Error: ${response.status}`)
    }

    const authData = await response.json()

    // If no auth options returned, no auth is required
    if (!authData || !Array.isArray(authData) || authData.length === 0) {
      return NextResponse.json({ authRequired: false })
    }

    // Return first auth option
    return NextResponse.json({
      authRequired: true,
      authUrl: authData[0].url,
    })
  } catch (error) {
    console.error("Basket auth error:", error)
    return NextResponse.json(
      {
        error: "Failed to check basket authentication",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

