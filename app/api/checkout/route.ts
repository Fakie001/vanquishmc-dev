import { NextResponse } from "next/server"

const TEBEX_BASE_URL = "https://headless.tebex.io/api/accounts"
const TEBEX_PUBLIC_TOKEN = "t11h-a35eacf1867ba8e19fc4b33f00fd8e52d805dee2"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { packageId } = body

    if (!packageId) {
      return NextResponse.json({ error: "Package ID is required" }, { status: 400 })
    }

    // For the headless API, we'll redirect directly to the package checkout
    const checkoutUrl = `https://checkout.tebex.io/checkout/packages/${packageId}`

    return NextResponse.json({
      checkoutUrl,
      packageId,
    })
  } catch (error) {
    console.error("Checkout API Error:", error)

    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
      },
    )
  }
}

