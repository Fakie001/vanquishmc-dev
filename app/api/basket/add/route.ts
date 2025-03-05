import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { tebexClient } from "@/lib/tebex-client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { packageId, username } = body

    if (!packageId || !username) {
      return NextResponse.json(
        {
          error: "Package ID and username are required",
        },
        { status: 400 },
      )
    }

    let basketId = cookies().get("basketId")?.value

    // Create new basket if none exists
    if (!basketId) {
      const basket = await tebexClient.createBasket({
        username,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/store`,
        complete_url: `${process.env.NEXT_PUBLIC_APP_URL}/store/complete`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/store`,
      })

      basketId = basket.id
      cookies().set("basketId", basketId)
    }

    // Add item to basket
    await tebexClient.addToBasket(basketId, packageId.toString(), username)

    // Get updated basket
    const updatedBasket = await tebexClient.getBasket(basketId)

    return NextResponse.json({
      success: true,
      basketId,
      basket: updatedBasket,
    })
  } catch (error) {
    console.error("Add to basket error:", error)
    return NextResponse.json(
      {
        error: "Failed to add item to basket",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

