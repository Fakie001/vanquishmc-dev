import { NextResponse } from "next/server"
import { tebexClient } from "@/lib/tebex-client"

/**
 * Get a list of all packages
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    // If an ID is provided, get a specific package
    if (id) {
      const packageData = await tebexClient.getPackage(id)
      return NextResponse.json(packageData)
    }

    // Otherwise, get all packages
    const packages = await tebexClient.getPackages()
    return NextResponse.json(packages)
  } catch (error) {
    console.error("Get packages error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

