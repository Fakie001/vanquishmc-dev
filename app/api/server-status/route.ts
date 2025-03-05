import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real application, you would connect to your Minecraft server
    // and fetch the actual player status.
    //
    // For demonstration purposes, we're returning mock data:

    const serverStatus = {
      online: true,
      players: {
        online: Math.floor(Math.random() * 500) + 50, // Random number between 50-550
        max: 1000,
      },
      version: "1.20.4",
      motd: "Welcome to VanquishMC! Factions & Prison Server",
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(serverStatus)
  } catch (error) {
    console.error("Failed to fetch server status:", error)

    // Return a fallback status on error
    return NextResponse.json(
      {
        online: true,
        players: {
          online: 123,
          max: 500,
        },
        version: "1.20.4",
        error: "Could not connect to Minecraft server",
      },
      { status: 200 }, // Return 200 with fallback data instead of error
    )
  }
}

