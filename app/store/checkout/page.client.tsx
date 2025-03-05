"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ShoppingCart, LockIcon, CreditCard } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Package {
  package: {
    id: string
    name: string
    price: string
  }
  qty: number
}

interface BasketData {
  id: string
  base_price: number
  sales_tax: number
  total_price: number
  username?: string
  packages: Package[]
}

export default function CheckoutPageClient({
  basketData,
  checkoutUrl,
}: {
  basketData: BasketData
  checkoutUrl?: string
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If there's a checkout URL ready, redirect automatically
  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }, [checkoutUrl])

  // Function to handle checkout button click
  const handleCheckout = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/checkout/process", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Checkout failed")
      }

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      setIsSubmitting(false)
    }
  }

  if (!basketData || !basketData.packages || basketData.packages.length === 0) {
    return (
      <div className="relative flex min-h-screen flex-col bg-[#1F1A29]">
        <SiteHeader />
        <main className="flex-1 container py-10">
          <Card className="bg-[#2A2438] border-[#9D74FF]/10 p-6 max-w-lg mx-auto">
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-[#9D74FF]" />
              <h1 className="text-xl font-bold text-white">Your basket is empty</h1>
              <p className="text-gray-400">Add some items to your basket before checking out.</p>
              <Button asChild className="bg-[#9D74FF] hover:bg-[#B594FF] text-white mt-4">
                <Link href="/store">Return to Store</Link>
              </Button>
            </div>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#1F1A29]">
      <SiteHeader />
      <main className="flex-1 container py-10">
        <h1 className="text-3xl font-bold mb-6 text-white">Checkout</h1>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Order Summary */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-[#2A2438] border-[#9D74FF]/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="h-5 w-5 text-[#9D74FF]" />
                <h2 className="text-xl font-semibold text-white">Order Summary</h2>
              </div>

              <div className="space-y-4">
                {/* Items list */}
                <div className="space-y-4">
                  {basketData.packages.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-[#9D74FF]/10 last:border-0"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{item.package.name}</h3>
                        <p className="text-sm text-gray-400">Quantity: {item.qty}</p>
                      </div>
                      <p className="text-[#9D74FF] font-medium">${Number(item.package.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator className="bg-[#9D74FF]/10" />

                {/* Order total */}
                <div className="flex justify-between items-center text-lg pt-2">
                  <span className="font-medium text-white">Total:</span>
                  <span className="font-bold text-[#9D74FF]">${Number(basketData.total_price).toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Checkout Information */}
            <Card className="bg-[#2A2438] border-[#9D74FF]/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <LockIcon className="h-5 w-5 text-[#9D74FF]" />
                <h2 className="text-xl font-semibold text-white">Checkout Information</h2>
              </div>

              <div className="space-y-4">
                <Alert className="bg-[#1F1A29] border-[#9D74FF]/20">
                  <AlertCircle className="h-4 w-4 text-[#9D74FF]" />
                  <AlertDescription className="text-gray-300">
                    You'll be redirected to our secure checkout to complete your purchase.
                  </AlertDescription>
                </Alert>

                {basketData.username && (
                  <div className="flex justify-between py-2 border-b border-[#9D74FF]/10">
                    <span className="text-gray-400">Username:</span>
                    <span className="text-white font-medium">{basketData.username}</span>
                  </div>
                )}

                <div className="flex justify-between py-2 border-b border-[#9D74FF]/10">
                  <span className="text-gray-400">Payment Method:</span>
                  <span className="text-white">Credit Card / PayPal</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Checkout Action */}
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-[#2A2438] border-[#9D74FF]/10 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-[#9D74FF]" />
                <h2 className="text-xl font-semibold text-white">Payment</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-[#1F1A29] p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white">${Number(basketData.base_price).toFixed(2)}</span>
                  </div>

                  {Number(basketData.sales_tax) > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Tax:</span>
                      <span className="text-white">${Number(basketData.sales_tax).toFixed(2)}</span>
                    </div>
                  )}

                  <Separator className="bg-[#9D74FF]/10 my-2" />

                  <div className="flex justify-between font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-[#9D74FF]">${Number(basketData.total_price).toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg"
                >
                  {isSubmitting ? "Processing..." : "Complete Purchase"}
                </Button>

                <p className="text-xs text-center text-gray-400">
                  By completing your purchase, you agree to our{" "}
                  <Link href="/terms" className="text-[#9D74FF] hover:underline">
                    Terms of Service
                  </Link>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

