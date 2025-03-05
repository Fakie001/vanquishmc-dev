"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BasketItem } from "@/types/basket"
import Link from "next/link"

interface BasketDrawerProps {
  open: boolean
  onClose: () => void
  items: BasketItem[]
  onUpdateQuantity: (itemId: number, delta: number) => void
  onRemoveItem: (itemId: number) => void
  onCheckout: () => void
}

export function BasketDrawer({ open, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }: BasketDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[300px] bg-[#1a1f2e] border-l border-gray-800 p-0 flex flex-col"
        aria-describedby="basket-content-description"
      >
        <div id="basket-content-description" className="sr-only">
          Your shopping cart items and total
        </div>
        <SheetHeader className="p-4 border-b border-gray-800 shrink-0">
          <SheetTitle className="text-xl font-bold text-white text-center">Basket</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto min-h-0">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
              <p className="text-gray-400">Your cart is empty</p>
              <Button
                className="bg-[#9D74FF] hover:bg-[#B594FF] text-white transition-colors duration-300"
                onClick={onClose}
                asChild
              >
                <Link href="/store">Go to Store</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-purple-500/10">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        className={cn(
                          "h-6 w-6 rounded flex items-center justify-center",
                          "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20",
                        )}
                        onClick={() => onUpdateQuantity(Number.parseInt(item.id), -1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-white">{item.quantity}</span>
                      <button
                        className={cn(
                          "h-6 w-6 rounded flex items-center justify-center",
                          "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20",
                        )}
                        onClick={() => onUpdateQuantity(Number.parseInt(item.id), 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 font-medium">USD {item.price.toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                      onClick={() => onRemoveItem(Number.parseInt(item.id))}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-800 p-6 space-y-4 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Total</span>
              <span className="text-cyan-400 font-bold">USD {total.toFixed(2)}</span>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onCheckout}>
              Proceed to checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

