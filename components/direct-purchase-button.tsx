"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface DirectPurchaseButtonProps {
  packageId: number | string
  username: string
  price?: number
  className?: string
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children?: React.ReactNode
}

export function DirectPurchaseButton({
  packageId,
  username,
  price,
  className,
  variant = "default",
  size = "default",
  children,
}: DirectPurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async () => {
    if (!username) {
      toast.error("Please enter your Minecraft username")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/tebex/direct-purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId,
          username,
          price,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process purchase")
      }

      const data = await response.json()

      if (!data.success || !data.url) {
        throw new Error("Failed to generate purchase URL")
      }

      // Redirect to the checkout URL
      window.location.href = data.url
    } catch (error) {
      console.error("Purchase error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to process purchase")
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("relative", className)}
      onClick={handlePurchase}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShoppingBag className="h-4 w-4 mr-2" />}
      {children || "Purchase Now"}
    </Button>
  )
}

