"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface CheckoutOptions {
  packageId: number | string
  username: string
}

interface UseCheckoutResult {
  isLoading: boolean
  checkout: (options: CheckoutOptions) => Promise<void>
}

/**
 * Hook for handling Tebex checkouts
 */
export function useTebexCheckout(): UseCheckoutResult {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const checkout = async ({ packageId, username }: CheckoutOptions) => {
    setIsLoading(true)

    try {
      // Call the checkout API
      const response = await fetch("/api/tebex/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId,
          username,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process checkout")
      }

      const data = await response.json()

      if (!data.success || !data.url) {
        throw new Error("Failed to generate checkout URL")
      }

      // Redirect to the checkout URL
      window.location.href = data.url
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to process checkout")
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    checkout,
  }
}

