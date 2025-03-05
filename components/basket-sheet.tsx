"use client"

import { ShoppingCart, Minus, Plus, X, Tag } from "lucide-react"
import { useBasket } from "@/contexts/basket-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function BasketSheet() {
  const { basket, isOpen, closeBasket, removeItem, addItem, checkout } = useBasket()
  const [couponCode, setCouponCode] = useState("")

  const handleCheckout = async () => {
    const url = await checkout()
    if (url) {
      window.location.href = url
    }
  }

  const updateQuantity = (item: any, delta: number) => {
    if (delta > 0) {
      addItem(item)
    } else if (item.quantity > 1) {
      // Implement decrease quantity
      // This would need to be added to the basket context
    } else {
      removeItem(item.id)
    }
  }

  const applyCoupon = () => {
    // Implement coupon logic here
    console.log("Applying coupon:", couponCode)
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeBasket}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {basket.items.length > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
              {basket.items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] bg-[#0a0b0f] border-l border-gray-800 p-0">
        <SheetHeader className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-white">Cart</SheetTitle>
            <Button variant="ghost" size="icon" onClick={closeBasket} className="h-8 w-8 rounded-lg hover:bg-gray-800">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-10rem)]">
          <div className="flex-1 overflow-auto">
            {basket.items.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">Your cart is empty</div>
            ) : (
              <div className="p-4 space-y-3">
                {basket.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-800"
                  >
                    <div className="h-12 w-12 relative rounded-md overflow-hidden bg-gray-800">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{item.name}</h3>
                      <p className="text-blue-400 font-bold">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-gray-800 border-gray-700 hover:bg-gray-700"
                        onClick={() => updateQuantity(item, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-white">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-gray-800 border-gray-700 hover:bg-gray-700"
                        onClick={() => updateQuantity(item, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-red-500/10 hover:text-red-400 ml-1"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {basket.items.length > 0 && (
            <div className="border-t border-gray-800 p-4 space-y-4">
              {/* Coupon Section */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-gray-900 border-gray-800 text-white"
                />
                <Button variant="outline" className="shrink-0 border-gray-800 hover:bg-gray-800" onClick={applyCoupon}>
                  <Tag className="h-4 w-4 mr-2" />
                  Apply
                </Button>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between text-lg">
                <span className="text-white font-medium">Total:</span>
                <span className="text-blue-400 font-bold">${basket.total.toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-6"
                onClick={handleCheckout}
              >
                Proceed to checkout
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

