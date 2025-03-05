import { NextResponse } from "next/server"

export async function GET() {
  const tebexLoginUrl = `https://checkout.tebex.io/login`

  // Add any necessary parameters or tokens
  const params = new URLSearchParams({
    redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
  })

  return NextResponse.redirect(`${tebexLoginUrl}?${params.toString()}`)
}

