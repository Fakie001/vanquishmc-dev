import { NextResponse } from "next/server"

export async function GET() {
  try {
    const secretKey = process.env.TEBEX_SECRET_KEY

    if (!secretKey) {
      return NextResponse.json({ error: "No Tebex secret key found" }, { status: 400 })
    }

    // Test the connection to Tebex
    const response = await fetch("https://plugin.tebex.io/information", {
      headers: {
        "X-Tebex-Secret": secretKey,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        {
          error: "Failed to connect to Tebex",
          status: response.status,
          details: errorText,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      serverInformation: data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to test Tebex connection",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

