import { NextResponse } from "next/server"
import { cookies } from "next/headers"

/**
 * This webhook is intended to receive callbacks from Tebex when a user completes a payment.
 * In a production environment, you would verify the request using a shared secret.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Log the webhook data
    console.log("Received Tebex webhook:", body)

    // Validate that this is a valid webhook
    if (!body.transaction_id) {
      return NextResponse.json({ error: "Invalid webhook data" }, { status: 400 })
    }

    // Process the webhook based on the type
    const { type, transaction_id, status } = body

    if (type === "payment.completed" && status === "complete") {
      // Payment was successful, clear the basket cookie
      cookies().delete("basketId")

      return NextResponse.json({
        success: true,
        message: "Payment completed successfully",
      })
    }

    // Default response for other webhook types
    return NextResponse.json({
      success: true,
      message: `Webhook received: ${type}`,
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

