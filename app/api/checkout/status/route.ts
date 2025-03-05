import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const txnId = searchParams.get("txn_id")

    if (!txnId) {
      return NextResponse.json({ success: false, error: "Transaction ID is required" }, { status: 400 })
    }

    // In a real implementation, you would verify the transaction with Tebex API
    // For demo purposes, we'll always return success

    // Clear basket cookie after successful checkout
    cookies().delete("basketId")

    return NextResponse.json({
      success: true,
      transaction: {
        id: txnId,
        status: "complete",
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Checkout status error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error checking transaction status",
      },
      { status: 500 },
    )
  }
}

