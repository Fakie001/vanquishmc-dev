import { NextResponse } from "next/server"

const TEBEX_BASE_URL = "https://plugin.tebex.io"

export async function GET() {
  try {
    const response = await fetch(`${TEBEX_BASE_URL}/payments`, {
      headers: {
        "X-Tebex-Secret": process.env.TEBEX_SECRET_KEY!,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    })

    // Log raw response for debugging
    const rawResponse = await response.text()
    console.log("Tebex API Raw Response:", rawResponse)

    if (!response.ok) {
      const errorMessage = `Tebex API Error: ${response.status} - ${response.statusText} | Response: ${rawResponse}`
      console.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Parse the response
    const data = JSON.parse(rawResponse)
    console.log("Tebex API Parsed Data:", data)

    // Get last 4 completed payments
    const recentSales = data.data
      .filter((payment: any) => payment.status === "Complete")
      .slice(0, 4)
      .map((payment: any) => ({
        username: payment.player.name,
        item: payment.packages[0]?.name || "Package",
        price: Number.parseFloat(payment.amount),
        avatar: `https://mc-heads.net/avatar/${payment.player.name}`,
        timestamp: payment.date,
      }))

    return NextResponse.json(recentSales)
  } catch (error) {
    console.error("Sales API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch sales data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

