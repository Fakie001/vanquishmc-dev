import { NextResponse } from "next/server"
import { SERVERS } from "@/lib/store-utils"
import type { ServerType } from "@/types/tebex"

const TEBEX_BASE_URL = "https://headless.tebex.io/api/accounts"

export const revalidate = 300

async function fetchServerData(serverToken: string, serverType: ServerType) {
  try {
    // Fetch all packages directly
    const packagesResponse = await fetch(`${TEBEX_BASE_URL}/${serverToken}/packages`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    })

    if (!packagesResponse.ok) {
      const errorText = await packagesResponse.text()
      throw new Error(`Packages fetch failed: ${errorText}`)
    }

    const packagesData = await packagesResponse.json()

    // Format the packages data
    const formattedPackages = packagesData.data.map((pkg: any) => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description.replace(/<[^>]*>/g, ""),
      price: Number.parseFloat(pkg.total_price),
      image: pkg.image,
      category: pkg.category
        ? {
            id: pkg.category.id,
            name: pkg.category.name,
          }
        : null,
      type: pkg.type,
      currency: pkg.currency,
      discount: pkg.discount,
      disable_quantity: pkg.disable_quantity,
      disable_gifting: pkg.disable_gifting,
      expiration_date: pkg.expiration_date,
      created_at: pkg.created_at,
      updated_at: pkg.updated_at,
    }))

    // Get categories from packages
    const categories = Array.from(
      new Set([
        ...formattedPackages.map((pkg) => pkg.category?.name),
        ...(serverType === "Factions" ? ["Ranks", "Tags"] : []),
      ]),
    )
      .filter(Boolean)
      .map((name) => ({
        id: formattedPackages.find((pkg) => pkg.category?.name === name)?.category?.id || 0,
        name,
        slug: name.toLowerCase(),
        description: `${name} category`,
        order: name === "Ranks" ? 0 : 1, // Ensure Ranks appears first
        display_type: "grid",
      }))

    return {
      packages: formattedPackages,
      categories,
    }
  } catch (error) {
    throw new Error(`Failed to fetch data for server: ${error.message}`)
  }
}

export async function GET() {
  try {
    const serverData: Record<ServerType, any> = {}
    const errors: Error[] = []

    // Fetch data for all servers
    await Promise.all(
      Object.entries(SERVERS).map(async ([serverName, config]) => {
        try {
          const data = await fetchServerData(config.token, serverName as ServerType)

          serverData[serverName as ServerType] = {
            store: {
              name: `${serverName} Store`,
              currency: {
                symbol: "$",
                iso_4217: "USD",
              },
            },
            packages: data.packages,
            categories: data.categories,
          }

          console.log(`Fetched ${data.packages.length} packages for ${serverName}`)
        } catch (error) {
          errors.push(error)
          console.error(`Error fetching ${serverName} data:`, error)

          serverData[serverName as ServerType] = {
            store: {
              name: `${serverName} Store`,
              currency: {
                symbol: "$",
                iso_4217: "USD",
              },
            },
            packages: [],
            categories: [],
          }
        }
      }),
    )

    if (errors.length === Object.keys(SERVERS).length) {
      throw new Error("Failed to fetch data for all servers")
    }

    const response = NextResponse.json(serverData)
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600")
    return response
  } catch (error) {
    console.error("Store API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch store data",
        details: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

