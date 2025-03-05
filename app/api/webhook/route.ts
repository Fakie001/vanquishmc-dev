import { NextResponse } from "next/server"
import { cookies } from "next/headers"

/**
 * Generic webhook endpoint for handling Tebex callbacks.
 * For example, receiving callbacks for completed transactions.
 */
export async function POST(request: Request) {
  try {
    // Parse the webhook data
    const body = await request.json()

    // Log the webhook data for debugging
    console.log("Received webhook:", body)

    // Check if this is a payment completion webhook
    if (body.type === "payment.completed" && body.status === "complete") {
      // Clear the basket cookie
      cookies().delete("basketId")

      // Return success response
      return NextResponse.json({
        success: true,
        message: "Payment completed and processed",
      })
    }

    // Handle other webhook types
    return NextResponse.json({
      success: true,
      message: "Webhook received",
    })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      {
        error: "Failed to process webhook",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

