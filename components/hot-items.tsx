"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Flame, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { useBasket } from "@/contexts/basket-context"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { ServerType } from "@/types/tebex"

interface HotItem {
  id: number
  name: string
  image: string
  originalPrice: number
  discountedPrice: number
  discount: number
}

const FACTIONS_HOT_ITEMS: HotItem[] = [
  {
    id: 6487989,
    name: "Warrior Rank",
    image: "/placeholder.svg",
    originalPrice: 14.99,
    discountedPrice: 11.99,
    discount: 20,
  },
  {
    id: 6487990, // Changed from 6487989 to make ID unique
    name: "Legend Rank",
    image: "/placeholder.svg",
    originalPrice: 14.99,
    discountedPrice: 11.99,
    discount: 20,
  },
  {
    id: 6468114,
    name: "Legendary Key",
    image: "/placeholder.svg",
    originalPrice: 24.99,
    discountedPrice: 19.99,
    discount: 20,
  },
]

const PRISON_HOT_ITEMS: HotItem[] = [
  {
    id: 101,
    name: "Prison Key",
    image: "/placeholder.svg",
    originalPrice: 19.99,
    discountedPrice: 15.99,
    discount: 20,
  },
  {
    id: 102,
    name: "Miner's Bundle",
    image: "/placeholder.svg",
    originalPrice: 29.99,
    discountedPrice: 23.99,
    discount: 20,
  },
  {
    id: 103,
    name: "Fortune Pickaxe",
    image: "/placeholder.svg",
    originalPrice: 14.99,
    discountedPrice: 11.99,
    discount: 20,
  },
]

interface HotItemsProps {
  serverType: ServerType
}

export function HotItems({ serverType }: HotItemsProps) {
  const { addItem } = useBasket()
  const hotItems = serverType === "Factions" ? FACTIONS_HOT_ITEMS : PRISON_HOT_ITEMS
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length)
  }

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
  }

  const filteredItems = hotItems.filter((item) => [6468114, 6487989, 6487990, 6468096].includes(item.id))

  return (
    <div className="mt-24 mb-16 px-4 md:px-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-[#9D74FF]/30 blur-xl animate-pulse rounded-full" />
          <div className="p-2 rounded-lg bg-[#9D74FF]/10 relative animate-float backdrop-blur-sm border border-[#9D74FF]/20">
            <Flame className="w-6 h-6 text-[#9D74FF] animate-flicker" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#F0F0F0]">Best selling items </h2>
      </div>
      <div className="relative flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Mobile Navigation Buttons */}
        <button
          onClick={prevCard}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#2A2438]/80 rounded-full text-white md:hidden"
          aria-label="Previous item"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextCard}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#2A2438]/80 rounded-full text-white md:hidden"
          aria-label="Next item"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Cards */}
        {filteredItems.map((item, index) => (
          <Card
            key={item.id}
            className={cn(
              "bg-[#2A2438] border-[#9D74FF]/10",
              "hover:border-[#9D74FF]/30 hover:shadow-lg hover:shadow-[#9D74FF]/10 transition-all overflow-hidden",
              "transform hover:-translate-y-1",
              "w-full",
              // Mobile: Show only current card
              "hidden md:block",
              index === currentIndex && "!block",
            )}
          >
            <div
              className={cn(
                "relative p-6",
                "transition-all duration-300 ease-in-out",
                "animate-in fade-in-0 slide-in-from-right-5",
                "z-10 transform scale-105", // Added z-index and scale
              )}
            >
              {/* Discount Badge */}
              <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">
                {item.discount}% OFF
              </div>

              {/* Item Image */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 bg-[#9D74FF]/10 rounded-lg" />
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-contain" />
              </div>

              {/* Item Details */}
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-[#F0F0F0]">{item.name}</h3>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-[#BBB8C3] line-through text-sm">${item.originalPrice.toFixed(2)}</span>
                  <span className="text-[#9D74FF] font-bold text-xl">${item.discountedPrice.toFixed(2)}</span>
                </div>
                <Button
                  onClick={() => addItem(item.id.toString(), "username")}
                  className="w-full bg-[#9D74FF] hover:bg-[#B594FF] text-white transition-colors duration-300"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

