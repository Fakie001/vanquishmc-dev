import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { tebexClient } from "@/lib/tebex-client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { itemId, delta } = body
    const basketId = cookies().get("basketId")?.value

    if (!basketId) {
      return NextResponse.json({ error: "No basket found" }, { status: 400 })
    }

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    if (delta > 0) {
      // Add item to basket
      await tebexClient.addToBasket(basketId, itemId.toString(), "username")
    } else if (delta < 0) {
      // Remove item from basket
      await tebexClient.removeFromBasket(basketId, itemId.toString())
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update basket error:", error)
    return NextResponse.json({ error: "Failed to update basket" }, { status: 500 })
  }
}

