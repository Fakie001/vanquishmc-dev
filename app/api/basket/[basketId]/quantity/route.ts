import { NextResponse } from "next/server"
import { tebexClient } from "@/lib/tebex-client"

export async function PUT(request: Request, { params }: { params: { basketId: string } }) {
  try {
    const { packageId, quantity } = await request.json()
    const { basketId } = params

    if (!packageId || typeof quantity !== "number") {
      return NextResponse.json({ error: "Package ID and quantity are required" }, { status: 400 })
    }

    await tebexClient.updateQuantity(basketId, packageId.toString(), quantity)
    const updatedBasket = await tebexClient.getBasket(basketId)

    return NextResponse.json({
      success: true,
      basket: updatedBasket.data,
    })
  } catch (error) {
    console.error("Update quantity error:", error)
    return NextResponse.json(
      {
        error: "Failed to update quantity",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

