"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTebexCheckout } from "@/hooks/use-tebex-checkout"
import { cn } from "@/lib/utils"

interface CheckoutButtonProps {
  packageId: number | string
  username: string
  className?: string
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children?: React.ReactNode
}

export function CheckoutButton({
  packageId,
  username,
  className,
  variant = "default",
  size = "default",
  children,
}: CheckoutButtonProps) {
  const { isLoading, checkout } = useTebexCheckout()

  const handleCheckout = async () => {
    if (!username) {
      toast.error("Please enter your Minecraft username")
      return
    }

    await checkout({ packageId, username })
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("relative", className)}
      onClick={handleCheckout}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
      {children || "Buy Now"}
    </Button>
  )
}

