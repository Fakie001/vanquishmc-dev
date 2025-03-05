import { NextResponse } from "next/server"
import { tebexClient } from "@/lib/tebex-client"

export async function POST(request: Request, { params }: { params: { basketId: string } }) {
  try {
    const { packageId } = await request.json()
    const { basketId } = params

    if (!packageId) {
      return NextResponse.json({ error: "Package ID is required" }, { status: 400 })
    }

    await tebexClient.removeFromBasket(basketId, packageId.toString())
    const updatedBasket = await tebexClient.getBasket(basketId)

    return NextResponse.json({
      success: true,
      basket: updatedBasket.data,
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

