"use client"

import { cn } from "@/lib/utils"
import type { CategoryType } from "@/types/tebex"

interface StoreNavigationProps {
  categories: CategoryType[]
  selectedCategory: CategoryType
  onSelectCategory: (category: CategoryType) => void
}

export function StoreNavigation({ categories, selectedCategory, onSelectCategory }: StoreNavigationProps) {
  return (
    <nav className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-medium transition-colors",
            "hover:bg-purple-600 hover:text-white",
            selectedCategory === category ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300",
          )}
        >
          {category}
        </button>
      ))}
    </nav>
  )
}

