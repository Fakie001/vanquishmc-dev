"use server"

import { cookies } from "next/headers"
import { headers } from "next/headers"

const TEBEX_BASE_URL = "https://headless.tebex.io/api/accounts"
const TEBEX_SECRET_KEY = process.env.TEBEX_SECRET_KEY || "t11h-a35eacf1867ba8e19fc4b33f00fd8e52d805dee2"

interface CreateBasketResponse {
  success: boolean
  basketId?: string
  error?: string
}

export async function createBasket(username: string): Promise<CreateBasketResponse> {
  try {
    console.log("Creating basket for user:", username)

    // Get client IP from headers
    const forwardedFor = headers().get("x-forwarded-for")
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1"

    const response = await fetch(`${TEBEX_BASE_URL}/${TEBEX_SECRET_KEY}/baskets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username, // Required for Minecraft stores
        ip_address: ip, // Required for backend basket creation
        complete_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/store/complete`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/store`,
        complete_auto_redirect: true,
        custom: {
          created_at: new Date().toISOString(),
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Create basket error details:", error)
      throw new Error(error.message || "Failed to create basket")
    }

    const data = await response.json()
    const basketId = data.data.ident // Use ident instead of id for basket reference

    // Store the basket ID in a cookie
    cookies().set("basketId", basketId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return {
      success: true,
      basketId,
    }
  } catch (error) {
    console.error("Create basket error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create basket",
    }
  }
}

interface AddToBasketResponse {
  success: boolean
  error?: string
  basketId?: string
  authRequired?: boolean
  authUrl?: string
}

export async function addToBasket(packageId: string, username: string): Promise<AddToBasketResponse> {
  try {
    let basketId = cookies().get("basketId")?.value

    // Create a new basket if one doesn't exist
    if (!basketId) {
      const result = await createBasket(username)
      if (!result.success) {
        throw new Error(result.error)
      }
      basketId = result.basketId
    }

    // Check if auth is required
    const authResponse = await fetch(
      `${TEBEX_BASE_URL}/${TEBEX_SECRET_KEY}/baskets/${basketId}/auth?returnUrl=${encodeURIComponent(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/store`,
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    if (!authResponse.ok) {
      const error = await authResponse.json()
      console.error("Auth check error:", error)
      throw new Error(error.message || "Failed to check authentication")
    }

    const authData = await authResponse.json()

    // If auth options are returned, user needs to authenticate
    if (Array.isArray(authData) && authData.length > 0) {
      return {
        success: false,
        authRequired: true,
        authUrl: authData[0].url,
      }
    }

    // Add the package to the basket
    const response = await fetch(`${TEBEX_BASE_URL}/${TEBEX_SECRET_KEY}/baskets/${basketId}/packages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        package_id: packageId,
        quantity: 1,
        username, // Include username for Minecraft stores
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Add to basket error details:", error)
      throw new Error(error.message || "Failed to add item to basket")
    }

    return {
      success: true,
      basketId,
    }
  } catch (error) {
    console.error("Add to basket error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add item to basket",
    }
  }
}

interface GetBasketResponse {
  success: boolean
  basket?: any
  error?: string
}

export async function getBasket(): Promise<GetBasketResponse> {
  try {
    // Only run this function on the server side
    if (typeof window !== "undefined") {
      return {
        success: false,
        error: "This function can only be called on the server",
      }
    }

    const basketId = cookies().get("basketId")?.value
    if (!basketId) {
      return {
        success: false,
        error: "No basket found",
      }
    }

    const response = await fetch(`${TEBEX_BASE_URL}/${TEBEX_SECRET_KEY}/baskets/${basketId}`, {
      headers: {
        "X-Tebex-Secret": TEBEX_SECRET_KEY,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch basket")
    }

    const basket = await response.json()
    return {
      success: true,
      basket: basket.data,
    }
  } catch (error) {
    console.error("Get basket error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch basket",
    }
  }
}

interface CheckoutResponse {
  success: boolean
  url?: string
  error?: string
}

export async function checkout(): Promise<CheckoutResponse> {
  try {
    const basketId = cookies().get("basketId")?.value
    if (!basketId) {
      return {
        success: false,
        error: "No basket found",
      }
    }

    // Get the basket to access the checkout URL
    const response = await fetch(`${TEBEX_BASE_URL}/${TEBEX_SECRET_KEY}/baskets/${basketId}`, {
      headers: {
        "X-Tebex-Secret": TEBEX_SECRET_KEY,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch basket")
    }

    const basket = await response.json()
    const checkoutUrl = basket.data.links.checkout

    // Clear the basket cookie after successful checkout
    cookies().delete("basketId")

    return {
      success: true,
      url: checkoutUrl,
    }
  } catch (error) {
    console.error("Checkout error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to proceed to checkout",
    }
  }
}

