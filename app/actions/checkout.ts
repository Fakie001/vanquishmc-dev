"use server"

import { cookies } from "next/headers"
import { tebexClient } from "@/lib/tebex-client"

export interface CheckoutResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Initiates the checkout process with Tebex.
 * Returns a URL to redirect the user to complete payment.
 */
export async function initiateCheckout(): Promise<CheckoutResult> {
  try {
    const basketId = cookies().get("basketId")?.value

    if (!basketId) {
      return {
        success: false,
        error: "No basket found",
      }
    }

    // Get checkout URL from Tebex
    const result = await tebexClient.getCheckoutUrl(basketId)

    if (!result || !result.url) {
      throw new Error("Failed to get checkout URL")
    }

    // Don't clear basket cookie here - it will be cleared after successful payment

    return {
      success: true,
      url: result.url,
    }
  } catch (error) {
    console.error("Checkout error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process checkout",
    }
  }
}

