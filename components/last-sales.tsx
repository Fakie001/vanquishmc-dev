"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Sale {
  username: string
  item: string
  price: number
  avatar: string
  timestamp: string
}

export function LastSales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSales() {
      try {
        const response = await fetch("/api/sales", {
          headers: {
            "Content-Type": "application/json",
          },
        })

        // Log the raw response for debugging
        const rawResponse = await response.text()
        console.log("Raw API Response:", rawResponse)

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${response.statusText} | Response: ${rawResponse}`)
        }

        // Parse the response as JSON
        const data = JSON.parse(rawResponse)
        console.log("Parsed Sales Data:", data)

        // Transform the Tebex API response into our sale format
        const formattedSales = data.map((sale: any) => ({
          username: sale.username,
          item: sale.item,
          price: Number.parseFloat(sale.price),
          avatar: `https://mc-heads.net/avatar/${sale.username}`,
          timestamp: new Date(sale.timestamp).toLocaleString(),
        }))

        setSales(formattedSales)
      } catch (err: unknown) {
        let errorMessage = "Failed to load sales"
        if (err instanceof Error) {
          errorMessage = err.message
        }
        console.error("Sales API Error:", errorMessage)
        setError(errorMessage)
        // Fallback data in case of error
        setSales([
          {
            username: "example1",
            item: "Epic Chest",
            price: 2.99,
            avatar: "https://mc-heads.net/avatar/YK17",
            timestamp: new Date().toISOString(),
          },
          {
            username: "example2",
            item: "Vanguard",
            price: 2.99,
            avatar: "https://mc-heads.net/avatar/YK17",
            timestamp: new Date().toISOString(),
          },
          {
            username: "example3",
            item: "Guardian",
            price: 1.99,
            avatar: "https://mc-heads.net/avatar/YK17",
            timestamp: new Date().toISOString(),
          },
          {
            username: "example4",
            item: "Common Key",
            price: 0.99,
            avatar: "https://mc-heads.net/avatar/YK17",
            timestamp: new Date().toISOString(),
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSales()
    // Refresh sales every minute
    const interval = setInterval(fetchSales, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KDaC9LAp3ock8goeFDXpMNAFQ0da17.png"
          alt="Sales icon"
          className="w-6 h-6"
        />
        <h2 className="text-2xl font-bold text-[#F0F0F0]">Last Sales</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? // Loading skeletons
            [...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-[#2A2438] border border-[#9D74FF]/10"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded bg-[#3A3448]" />
                  <div className="space-y-2">
                    <Skeleton className="w-24 h-4 bg-[#3A3448]" />
                    <Skeleton className="w-16 h-3 bg-[#3A3448]" />
                  </div>
                </div>
                <Skeleton className="w-12 h-4 bg-[#3A3448]" />
              </div>
            ))
          : sales.map((sale, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-[#2A2438] hover:bg-[#322B42] transition-colors border border-[#9D74FF]/10"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={sale.avatar || "/placeholder.svg"}
                    alt={sale.username}
                    className="w-8 h-8 rounded"
                    crossOrigin="anonymous"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{sale.username}</p>
                    <p className="text-xs text-gray-400">{sale.item}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#9D74FF]">${sale.price.toFixed(2)}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#9D74FF]" />
                </div>
              </div>
            ))}
      </div>
      {error && <p className="text-center text-sm text-red-400">{error} - Showing example data</p>}
    </div>
  )
}

