import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { tebexClient } from "@/lib/tebex-client"

/**
 * Get the current basket
 */
export async function GET() {
  try {
    // Get the basket ID from cookies
    const basketId = cookies().get("basketId")?.value

    if (!basketId) {
      return NextResponse.json(
        {
          success: false,
          error: "No basket found",
        },
        { status: 404 },
      )
    }

    // Get the basket
    const basket = await tebexClient.getBasket(basketId)

    return NextResponse.json({
      success: true,
      basket: basket.data,
    })
  } catch (error) {
    console.error("Get basket error:", error)

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
 * Create a new basket or modify an existing one
 */
export async function POST(request: Request) {
  try {
    // Parse the request
    const body = await request.json()
    const { action, username, packageId, quantity = 1 } = body

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin

    // Get the current basket ID
    let basketId = cookies().get("basketId")?.value

    switch (action) {
      case "create": {
        // Create a new basket
        if (!username) {
          return NextResponse.json(
            {
              success: false,
              error: "Username is required to create a basket",
            },
            { status: 400 },
          )
        }

        const basketResult = await tebexClient.createBasket({
          username,
          return_url: `${baseUrl}/store`,
          complete_url: `${baseUrl}/store/complete`,
          cancel_url: `${baseUrl}/store`,
        })

        // Set the basket ID in a cookie
        basketId = basketResult.data.ident
        cookies().set("basketId", basketId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 2, // 2 days
        })

        return NextResponse.json({
          success: true,
          basketId,
          basket: basketResult.data,
        })
      }

      case "add": {
        // Add item to basket
        if (!basketId) {
          // Create a new basket first if there isn't one
          if (!username) {
            return NextResponse.json(
              {
                success: false,
                error: "Username is required to create a basket",
              },
              { status: 400 },
            )
          }

          const basketResult = await tebexClient.createBasket({
            username,
            return_url: `${baseUrl}/store`,
            complete_url: `${baseUrl}/store/complete`,
            cancel_url: `${baseUrl}/store`,
          })

          // Set the basket ID in a cookie
          basketId = basketResult.data.ident
          cookies().set("basketId", basketId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 2, // 2 days
          })
        }

        // Validate package ID
        if (!packageId) {
          return NextResponse.json(
            {
              success: false,
              error: "Package ID is required",
            },
            { status: 400 },
          )
        }

        // Add to basket
        await tebexClient.addToBasket(basketId, packageId.toString(), username)

        // Get updated basket
        const basketResult = await tebexClient.getBasket(basketId)

        return NextResponse.json({
          success: true,
          basketId,
          basket: basketResult.data,
        })
      }

      case "remove": {
        // Remove item from basket
        if (!basketId) {
          return NextResponse.json(
            {
              success: false,
              error: "No basket found",
            },
            { status: 404 },
          )
        }

        // Validate package ID
        if (!packageId) {
          return NextResponse.json(
            {
              success: false,
              error: "Package ID is required",
            },
            { status: 400 },
          )
        }

        // Remove from basket
        await tebexClient.removeFromBasket(basketId, packageId.toString())

        // Get updated basket
        const basketResult = await tebexClient.getBasket(basketId)

        return NextResponse.json({
          success: true,
          basket: basketResult.data,
        })
      }

      case "update-quantity": {
        // Update quantity of item in basket
        if (!basketId) {
          return NextResponse.json(
            {
              success: false,
              error: "No basket found",
            },
            { status: 404 },
          )
        }

        // Validate package ID and quantity
        if (!packageId) {
          return NextResponse.json(
            {
              success: false,
              error: "Package ID is required",
            },
            { status: 400 },
          )
        }

        if (typeof quantity !== "number" || quantity < 1) {
          return NextResponse.json(
            {
              success: false,
              error: "Quantity must be a positive number",
            },
            { status: 400 },
          )
        }

        // Update quantity
        await tebexClient.updateQuantity(basketId, packageId.toString(), quantity)

        // Get updated basket
        const basketResult = await tebexClient.getBasket(basketId)

        return NextResponse.json({
          success: true,
          basket: basketResult.data,
        })
      }

      case "checkout": {
        // Get checkout URL
        if (!basketId) {
          return NextResponse.json(
            {
              success: false,
              error: "No basket found",
            },
            { status: 404 },
          )
        }

        const result = await tebexClient.getCheckoutUrl(basketId)

        return NextResponse.json({
          success: true,
          url: result.url,
        })
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown action: ${action}`,
          },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("Basket API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

