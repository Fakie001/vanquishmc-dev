import { NextResponse } from "next/server"
import { tebexClient } from "@/lib/tebex-client"

/**
 * Endpoint for direct purchases without using the basket system
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { packageId, username, price } = body

    // Validate required fields
    if (!packageId || !username) {
      return NextResponse.json(
        {
          success: false,
          error: "Package ID and username are required",
        },
        { status: 400 },
      )
    }

    // Get the package details if price is not provided
    let finalPrice = price
    if (!finalPrice) {
      try {
        const packageInfo = await tebexClient.getPackage(packageId.toString())
        finalPrice = packageInfo.price || 0
      } catch (error) {
        console.warn("Failed to get package details:", error)
        // Proceed with price 0, Tebex will use the package's price
        finalPrice = 0
      }
    }

    // Create a direct payment
    const result = await tebexClient.createDirectPayment({
      username,
      packageId: Number(packageId),
      price: finalPrice,
      note: `Direct purchase for ${username}`,
    })

    return NextResponse.json({
      success: true,
      url: result.url,
    })
  } catch (error) {
    console.error("Direct purchase error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

