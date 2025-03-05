import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { tebexClient } from "@/lib/tebex-client"

export async function POST() {
  try {
    const basketId = cookies().get("basketId")?.value

    if (!basketId) {
      return NextResponse.json({ success: false, error: "No basket ID found" }, { status: 400 })
    }

    // Get checkout URL from Tebex
    const result = await tebexClient.getCheckoutUrl(basketId)

    if (!result || !result.url) {
      return NextResponse.json({ success: false, error: "Failed to generate checkout URL" }, { status: 500 })
    }

    // Don't clear basket cookie here - it should be cleared after successful payment

    return NextResponse.json({
      success: true,
      url: result.url,
    })
  } catch (error) {
    console.error("Checkout process error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error processing checkout",
      },
      { status: 500 },
    )
  }
}

