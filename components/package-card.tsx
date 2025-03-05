"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Info, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import type React from "react"
import { useBasket } from "@/contexts/basket-context"
import { PackageDialog } from "./package-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { LoginDialog } from "./login-dialog"
import { toast } from "sonner"

interface PackageCardProps {
  pkg: {
    id: number
    name: string
    description: string
    price: number
    image: string | null
    perks?: string[]
    commands?: string[]
    kits?: {
      name: string
      items: string[]
    }[]
  }
}

export function PackageCard({ pkg }: PackageCardProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const { addItem } = useBasket()
  const { user } = useAuth()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!user) {
      setShowLoginDialog(true)
      return
    }

    try {
      await addItem(pkg.id.toString(), user.minecraft_username)
      toast.success(`${pkg.name} added to your cart`)
    } catch (error) {
      toast.error("Failed to add item to cart")
      console.error(error)
    }
  }

  const handleLogin = (username: string) => {
    if (username) {
      addItem(pkg.id.toString(), username)
      setShowLoginDialog(false)
    }
  }

  return (
    <>
      <Card
        className={cn(
          "group relative bg-[#2A2438] border-[#9D74FF]/10 overflow-hidden",
          "hover:border-[#9D74FF]/30 hover:shadow-lg hover:shadow-[#9D74FF]/10 transition-all duration-300",
          "transform hover:-translate-y-1",
        )}
        onClick={() => setShowDialog(true)}
      >
        <div className="relative p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative"
            >
              {/* Item Image */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 bg-[#9D74FF]/10 rounded-lg" />
                <img src={pkg.image || "/placeholder.svg"} alt={pkg.name} className="w-full h-full object-contain" />
              </div>
              {/* Package Info */}
              <div className="text-center space-y-4">
                <h3 className="text-lg font-bold text-[#F0F0F0] group-hover:text-[#9D74FF] transition-colors">
                  {pkg.name}
                </h3>
                <p className="text-2xl font-bold text-[#9D74FF]">${pkg.price.toFixed(2)}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-md bg-[#221D2E] border-gray-700 hover:bg-[#2A2438] hover:border-[#9D74FF]/50 relative z-10"
              onClick={(e) => {
                e.stopPropagation()
                setShowDialog(true)
              }}
              aria-label={`View details for ${pkg.name}`}
            >
              <Info className="h-4 w-4 text-[#BBB8C3]" />
            </Button>
            <Button
              className="w-full bg-[#9D74FF] hover:bg-[#B594FF] text-white transition-colors duration-300"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to cart
            </Button>
          </div>
          {/* Hover Overlay */}
          <div
            className={cn(
              "absolute inset-0 bottom-[72px]",
              "bg-[#1F1A29]/80 backdrop-blur-sm",
              "flex flex-col items-center justify-center gap-2",
              "opacity-0 group-hover:opacity-100",
              "transition-all duration-300 ease-in-out",
              "border border-[#9D74FF]/20",
            )}
          >
            <div className="w-10 h-10 rounded-full bg-[#9D74FF]/20 flex items-center justify-center mb-2">
              <Info className="h-5 w-5 text-[#9D74FF]" />
            </div>
            <p className="text-white font-medium">Click for more info</p>
            <p className="text-sm text-[#9D74FF]">View details & perks</p>
          </div>
        </div>
      </Card>

      <PackageDialog open={showDialog} onOpenChange={setShowDialog} pkg={pkg} />
      <LoginDialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)} onLogin={handleLogin} />
    </>
  )
}

