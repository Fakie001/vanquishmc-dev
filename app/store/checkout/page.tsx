import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import CheckoutPageClient from "./page.client"
import { tebexClient } from "@/lib/tebex-client"

// Force dynamic rendering for this page to ensure cookies are read in the request context
export const dynamic = "force-dynamic"

export default async function CheckoutPage() {
  // This runs on the server in a request context where cookies() is valid
  const cookieStore = cookies()
  const basketId = cookieStore.get("basketId")?.value

  // If no basket ID, redirect to store
  if (!basketId) {
    return redirect("/store")
  }

  try {
    // Get basket data
    const response = await tebexClient.getBasket(basketId)

    // If basket has no items, redirect to store
    if (!response?.data?.packages?.length) {
      return redirect("/store")
    }

    // Pass the data to the client component
    return <CheckoutPageClient basketData={response.data} />
  } catch (error) {
    console.error("Error fetching basket data:", error)
    // Handle error state by redirecting to store
    return redirect("/store?error=basket-error")
  }
}

