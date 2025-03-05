import type { TebexResponse, ServerType } from "@/types/tebex"
import { SERVERS } from "@/lib/store-utils"

let storeCache: Record<ServerType, TebexResponse> | null = null
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Helper function to get the base URL
function getBaseUrl() {
  // Check if we're running on the client
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  // For server-side, use the environment variable or a fallback
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

// Create mock data for fallback situations
const MOCK_STORE_DATA: Record<ServerType, TebexResponse> = {
  Factions: {
    store: {
      name: "Factions Store",
      currency: { symbol: "$", iso_4217: "USD" },
    },
    packages: [
      {
        id: 6487989,
        name: "Warrior Rank",
        description: "Basic rank with essential permissions",
        price: 9.99,
        image: null,
        category: { id: 123, name: "Ranks" },
        type: "subscription",
        currency: "USD",
        discount: 0,
        disable_quantity: true,
        disable_gifting: false,
        expiration_date: null,
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
      },
    ],
    categories: [
      { id: 123, name: "Ranks", slug: "ranks", description: "Server ranks", order: 0, display_type: "grid" },
    ],
  },
  Prison: {
    store: {
      name: "Prison Store",
      currency: { symbol: "$", iso_4217: "USD" },
    },
    packages: [],
    categories: [],
  },
}

// Helper to validate and safely parse JSON responses
async function safeParseResponse(response: Response) {
  if (!response.ok) {
    // Log detailed error information
    const errorText = await response.text()
    const preview = errorText.substring(0, 150) + (errorText.length > 150 ? "..." : "")
    console.error(`API Error (${response.status}): ${preview}`)
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  // Check content type
  const contentType = response.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text()
    const preview = text.substring(0, 150) + (text.length > 150 ? "..." : "")
    console.error(`Expected JSON but received: ${contentType}, Preview: ${preview}`)
    throw new Error(`Expected JSON but received: ${contentType || "unknown"}`)
  }

  try {
    return await response.json()
  } catch (error) {
    console.error("JSON parse error:", error)
    // Try to get the response text for better debugging
    const text = await response.clone().text()
    const preview = text.substring(0, 150) + (text.length > 150 ? "..." : "")
    console.error(`Failed to parse JSON: ${preview}`)
    throw new Error(`Invalid JSON: ${error.message}`)
  }
}

export async function getStoreData(): Promise<Record<ServerType, TebexResponse>> {
  const now = Date.now()

  // Return cached data if it's fresh
  if (storeCache && now - lastFetchTime < CACHE_DURATION) {
    return storeCache
  }

  try {
    // Ensure we have a full URL with protocol and host
    const baseUrl = getBaseUrl()
    const apiUrl = `${baseUrl}/api/store`
    console.log("Fetching store data from:", apiUrl)

    const response = await fetch(apiUrl, {
      next: { revalidate: CACHE_DURATION / 1000 },
      headers: {
        Accept: "application/json",
      },
    })

    const data = await safeParseResponse(response)

    // Validate the response structure
    Object.keys(SERVERS).forEach((server) => {
      if (!data[server]) {
        console.warn(`Missing data for server: ${server}, using mock data`)
        data[server] = MOCK_STORE_DATA[server as ServerType]
      }
    })

    storeCache = data
    lastFetchTime = now

    return data
  } catch (error) {
    console.error("Store cache error:", error)

    // If fetch fails and we have cached data, return it even if expired
    if (storeCache) {
      console.log("Using expired cache data as fallback")
      return storeCache
    }

    // If no cache exists, use mock data
    console.log("Using mock data as fallback")
    return MOCK_STORE_DATA
  }
}

