"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface StoreType {
  name: string
  href: string
  isActive?: boolean
}

const STORE_TYPES: StoreType[] = [
  {
    name: "Factions",
    href: "/store?mode=factions",
    isActive: true,
  },
  {
    name: "Prison",
    href: "/store?mode=prison",
    isActive: true,
  },
]

export function StoreHeader() {
  const pathname = usePathname()

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {STORE_TYPES.map((type) => (
        <Link
          key={type.name}
          href={type.href}
          className={cn(
            "relative group overflow-hidden rounded-lg aspect-[4/3] block transition-all",
            "bg-gradient-to-br from-gray-900 to-gray-800",
            pathname.includes(type.name.toLowerCase()) && "ring-2 ring-purple-500",
          )}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">{type.name}</h3>
            <span className="text-sm text-purple-400 font-medium tracking-wide">CLICK TO SHOP</span>
          </div>
          {!type.isActive && (
            <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
              <span className="text-white font-bold">Coming Soon</span>
            </div>
          )}
        </Link>
      ))}
    </div>
  )
}

