import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { tebexClient } from "@/lib/tebex-client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { packageId } = body
    const basketId = cookies().get("basketId")?.value

    if (!basketId) {
      return NextResponse.json({ error: "No basket found" }, { status: 400 })
    }

    if (!packageId) {
      return NextResponse.json({ error: "Package ID is required" }, { status: 400 })
    }

    await tebexClient.removeFromBasket(basketId, packageId.toString())
    const updatedBasket = await tebexClient.getBasket(basketId)

    return NextResponse.json({
      success: true,
      basket: updatedBasket,
    })
  } catch (error) {
    console.error("Remove from basket error:", error)
    return NextResponse.json(
      {
        error: "Failed to remove item from basket",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

