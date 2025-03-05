import { NextResponse } from "next/server"
import { cookies } from "next/headers"

/**
 * Webhook endpoint for Tebex callbacks
 * This receives notifications about events like completed payments
 */
export async function POST(request: Request) {
  try {
    // Validate the webhook signature (in production)
    // For this demo, we'll skip that step

    // Parse the request body
    const body = await request.json()
    console.log("Tebex webhook received:", body)

    // Handle different event types
    const { type } = body

    switch (type) {
      case "payment.completed":
        // Clear the basket cookie when a payment is completed
        cookies().delete("basketId")

        // Return success
        return NextResponse.json({
          success: true,
          message: "Payment completed and processed",
        })

      case "payment.refunded":
        // Handle refund
        return NextResponse.json({
          success: true,
          message: "Refund processed",
        })

      default:
        // Log but still return success for unhandled event types
        console.log(`Unhandled webhook event type: ${type}`)
        return NextResponse.json({
          success: true,
          message: `Webhook received: ${type}`,
        })
    }
  } catch (error) {
    console.error("Webhook processing error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

