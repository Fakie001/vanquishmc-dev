"use server"

import { cookies } from "next/headers"
import { tebexClient } from "@/lib/tebex-client"
import { redirect } from "next/navigation"

/**
 * Processes a checkout and redirects to the Tebex checkout page.
 * This is meant to be used as a server action in a form.
 */
export async function processCheckout() {
  const basketId = cookies().get("basketId")?.value

  if (!basketId) {
    return redirect("/store?error=no-basket")
  }

  try {
    // Get checkout URL from Tebex
    const result = await tebexClient.getCheckoutUrl(basketId)

    if (!result || !result.url) {
      throw new Error("Failed to get checkout URL")
    }

    // Redirect to Tebex checkout page
    return redirect(result.url)
  } catch (error) {
    console.error("Checkout error:", error)
    return redirect("/store/checkout?error=checkout-failed")
  }
}

/**
 * Cancels the checkout process and redirects back to the store.
 */
export async function cancelCheckout() {
  return redirect("/store")
}

