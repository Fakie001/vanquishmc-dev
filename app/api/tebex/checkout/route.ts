import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { tebexClient } from "@/lib/tebex-client"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { packageId, username } = body

    if (!packageId) {
      return NextResponse.json(
        {
          success: false,
          error: "Package ID is required",
        },
        { status: 400 },
      )
    }

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          error: "Username is required",
        },
        { status: 400 },
      )
    }

    // Try to use a basket-based checkout flow
    try {
      // First, create a basket or get existing one
      let basketId = cookies().get("basketId")?.value

      // If no basket exists, create one
      if (!basketId) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin

        const basketResult = await tebexClient.createBasket({
          username,
          return_url: `${baseUrl}/store`,
          complete_url: `${baseUrl}/store/complete`,
          cancel_url: `${baseUrl}/store`,
        })

        basketId = basketResult.data.ident

        // Set the basket ID in a cookie
        cookies().set("basketId", basketId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 2, // 2 days
        })
      }

      // Add the item to the basket
      await tebexClient.addToBasket(basketId, packageId.toString(), username)

      // Get the checkout URL
      const result = await tebexClient.getCheckoutUrl(basketId)

      return NextResponse.json({
        success: true,
        url: result.url,
      })
    } catch (basketError) {
      console.warn("Basket checkout failed, trying direct payment:", basketError)

      // Fallback to direct payment if basket approach fails
      try {
        // Get the package info to get the price
        const packageInfo = await tebexClient.getPackage(packageId.toString())
        const price = packageInfo.price || 0

        // Create direct payment
        const paymentResult = await tebexClient.createDirectPayment({
          username,
          packageId: Number(packageId),
          price,
        })

        return NextResponse.json({
          success: true,
          url: paymentResult.url,
          directPayment: true,
        })
      } catch (directPaymentError) {
        throw new Error(`Direct payment failed: ${directPaymentError.message}`)
      }
    }
  } catch (error) {
    console.error("Checkout API Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

