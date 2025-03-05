import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { tebexClient } from "@/lib/tebex-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const basketId = searchParams.get("basketId") || cookies().get("basketId")?.value

    if (!basketId) {
      return NextResponse.json({ error: "No basket ID provided", success: false }, { status: 400 })
    }

    try {
      const basket = await tebexClient.getBasket(basketId)
      return NextResponse.json({ success: true, data: basket.data })
    } catch (error) {
      console.error("Error fetching basket:", error)
      return NextResponse.json(
        {
          error: "Failed to fetch basket",
          success: false,
          details: error instanceof Error ? error.message : "Unknown error occurred",
        },
        { status: 404 },
      )
    }
  } catch (error) {
    console.error("Basket API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch basket",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    // Get request body
    const body = await request.json()
    const { action, basketId, packageId, username, quantity = 1 } = body

    // If no action is specified, return error
    if (!action) {
      return NextResponse.json({ error: "No action specified", success: false }, { status: 400 })
    }

    // Handle different actions
    switch (action) {
      case "create": {
        try {
          // Create a new basket
          const basket = await tebexClient.createBasket({
            username: username,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin")}/store`,
            complete_url: `${process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin")}/store/complete`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin")}/store`,
          })

          // Set cookie
          cookies().set("basketId", basket.data.ident, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 1 week
          })

          // Return the basket data
          return NextResponse.json({
            success: true,
            basket: basket.data,
          })
        } catch (error) {
          console.error("Error creating basket:", error)
          return NextResponse.json(
            {
              success: false,
              error: "Failed to create basket",
              details: error instanceof Error ? error.message : "Unknown error occurred",
            },
            { status: 500 },
          )
        }
      }

      case "get": {
        try {
          // Get the basket
          const id = basketId || cookies().get("basketId")?.value

          if (!id) {
            return NextResponse.json({ error: "No basket ID provided", success: false }, { status: 400 })
          }

          const basket = await tebexClient.getBasket(id)
          return NextResponse.json({
            success: true,
            basket: basket.data,
          })
        } catch (error) {
          console.error("Error getting basket:", error)
          return NextResponse.json(
            {
              success: false,
              error: "Failed to get basket",
              details: error instanceof Error ? error.message : "Unknown error occurred",
            },
            { status: 404 },
          )
        }
      }

      case "add": {
        try {
          // Get the basket ID from cookie or body
          let id = basketId || cookies().get("basketId")?.value

          // If no basket ID is provided, create a new basket
          if (!id) {
            if (!username) {
              return NextResponse.json(
                { error: "Username is required to create a basket", success: false },
                { status: 400 },
              )
            }

            const basket = await tebexClient.createBasket({
              username: username,
              return_url: `${process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin")}/store`,
              complete_url: `${process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin")}/store/complete`,
              cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin")}/store`,
            })

            id = basket.data.ident

            // Set cookie
            cookies().set("basketId", id, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 7, // 1 week
            })
          }

          // Validate package ID
          if (!packageId) {
            return NextResponse.json({ error: "Package ID is required", success: false }, { status: 400 })
          }

          // Add the package to the basket
          await tebexClient.addToBasket(id, packageId.toString(), username)

          // Get the updated basket
          const updatedBasket = await tebexClient.getBasket(id)

          return NextResponse.json({
            success: true,
            basketId: id,
            basket: updatedBasket.data,
          })
        } catch (error) {
          console.error("Error adding to basket:", error)
          return NextResponse.json(
            {
              success: false,
              error: "Failed to add item to basket",
              details: error instanceof Error ? error.message : "Unknown error occurred",
            },
            { status: 500 },
          )
        }
      }

      case "remove": {
        try {
          // Get the basket ID from cookie or body
          const id = basketId || cookies().get("basketId")?.value

          if (!id) {
            return NextResponse.json({ error: "No basket ID provided", success: false }, { status: 400 })
          }

          // Validate package ID
          if (!packageId) {
            return NextResponse.json({ error: "Package ID is required", success: false }, { status: 400 })
          }

          // Remove the package from the basket
          await tebexClient.removeFromBasket(id, packageId.toString())

          // Get the updated basket
          const updatedBasket = await tebexClient.getBasket(id)

          return NextResponse.json({
            success: true,
            basket: updatedBasket.data,
          })
        } catch (error) {
          console.error("Error removing from basket:", error)
          return NextResponse.json(
            {
              success: false,
              error: "Failed to remove item from basket",
              details: error instanceof Error ? error.message : "Unknown error occurred",
            },
            { status: 500 },
          )
        }
      }

      case "update-quantity": {
        try {
          // Get the basket ID from cookie or body
          const id = basketId || cookies().get("basketId")?.value

          if (!id) {
            return NextResponse.json({ error: "No basket ID provided", success: false }, { status: 400 })
          }

          // Validate package ID
          if (!packageId) {
            return NextResponse.json({ error: "Package ID is required", success: false }, { status: 400 })
          }

          // Update the package quantity
          await tebexClient.updateQuantity(id, packageId.toString(), quantity)

          // Get the updated basket
          const updatedBasket = await tebexClient.getBasket(id)

          return NextResponse.json({
            success: true,
            basket: updatedBasket.data,
          })
        } catch (error) {
          console.error("Error updating quantity:", error)
          return NextResponse.json(
            {
              success: false,
              error: "Failed to update quantity",
              details: error instanceof Error ? error.message : "Unknown error occurred",
            },
            { status: 500 },
          )
        }
      }

      case "checkout": {
        try {
          // Get the basket ID from cookie or body
          const id = basketId || cookies().get("basketId")?.value

          if (!id) {
            return NextResponse.json({ error: "No basket ID provided", success: false }, { status: 400 })
          }

          // Get the checkout URL
          const result = await tebexClient.getCheckoutUrl(id)

          // Note: We don't clear the basket cookie here, as that should happen after successful payment

          return NextResponse.json({
            success: true,
            url: result.url,
          })
        } catch (error) {
          console.error("Error creating checkout:", error)
          return NextResponse.json(
            {
              success: false,
              error: "Failed to create checkout",
              details: error instanceof Error ? error.message : "Unknown error occurred",
            },
            { status: 500 },
          )
        }
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}`, success: false }, { status: 400 })
    }
  } catch (error) {
    console.error("Basket API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process basket action",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

