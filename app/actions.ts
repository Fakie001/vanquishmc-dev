"use server"

import { cookies } from "next/headers"
import { tebexClient } from "@/lib/tebex-client"

export async function getOrCreateBasket(minecraftUsername?: string) {
  const cookieStore = cookies()
  let basketId = cookieStore.get("basketId")?.value

  if (!basketId || !minecraftUsername) {
    const basket = await tebexClient.createBasket({
      username: minecraftUsername,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/store`,
      complete_url: `${process.env.NEXT_PUBLIC_APP_URL}/store/complete`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/store`,
    })
    basketId = basket.id
    cookieStore.set("basketId", basketId)
  }

  return basketId
}

export async function addToBasket(packageId: number, minecraftUsername?: string) {
  try {
    if (!minecraftUsername) {
      throw new Error("Minecraft username is required")
    }

    const basketId = await getOrCreateBasket(minecraftUsername)

    const result = await tebexClient.addToBasket(basketId, packageId.toString(), minecraftUsername)
    return { success: true, data: result }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add item to basket",
    }
  }
}

export async function removeFromBasket(packageId: number) {
  try {
    const basketId = cookies().get("basketId")?.value
    if (!basketId) throw new Error("No basket found")

    await tebexClient.removeFromBasket(basketId, packageId.toString())
    const updatedBasket = await tebexClient.getBasket(basketId)

    return { success: true, data: updatedBasket }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove item from basket",
    }
  }
}

export async function checkout() {
  try {
    const basketId = cookies().get("basketId")?.value
    if (!basketId) throw new Error("No basket found")

    const { url } = await tebexClient.getCheckoutUrl(basketId)
    cookies().delete("basketId")

    return { success: true, url }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout",
    }
  }
}

