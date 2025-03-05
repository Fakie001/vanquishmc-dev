import { NextResponse } from "next/server"
import { tebexClient } from "@/lib/tebex-client"

/**
 * Get recent payments
 */
export async function GET() {
  try {
    const response = await tebexClient.getPayments()

    // Format the payments to a simpler structure
    const formattedPayments = response.data.map((payment: any) => ({
      id: payment.id,
      username: payment.player?.name || "Unknown",
      amount: payment.amount,
      status: payment.status,
      date: payment.date,
      packages: payment.packages.map((pkg: any) => ({
        id: pkg.package.id,
        name: pkg.package.name,
      })),
    }))

    return NextResponse.json(formattedPayments)
  } catch (error) {
    console.error("Get payments error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

/**
 * Create a direct payment
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { packageId, username, price, note } = body

    if (!packageId || !username) {
      return NextResponse.json(
        {
          success: false,
          error: "Package ID and username are required",
        },
        { status: 400 },
      )
    }

    // Create direct payment
    const result = await tebexClient.createDirectPayment({
      username,
      packageId: Number(packageId),
      price: price || 0, // If price isn't provided, we'll use 0 and let Tebex use the package price
      note,
    })

    return NextResponse.json({
      success: true,
      payment: result,
    })
  } catch (error) {
    console.error("Create payment error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

