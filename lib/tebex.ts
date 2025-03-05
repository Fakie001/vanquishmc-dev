import { handleApiResponse } from "./api-error"

const TEBEX_BASE_URL = "https://headless.tebex.io/api/accounts"
const TEBEX_ACCOUNT_TOKEN = process.env.TEBEX_SECRET_KEY || "Rw4NeTLQYLd22dEjGMumcV1MNguPomfc"

interface BasketResponse {
  data: {
    id: string
    ident: string
    complete: boolean
    email?: string
    username?: string
    base_price: number
    sales_tax: number
    total_price: number
    currency: string
    packages: Array<{
      qty: number
      type: string
      package: {
        id: string
        name: string
        price: string
      }
    }>
    links: {
      payment: string
      checkout: string
    }
  }
}

export async function getBasket(basketId: string): Promise<BasketResponse> {
  const response = await fetch(`${TEBEX_BASE_URL}/${TEBEX_ACCOUNT_TOKEN}/baskets/${basketId}`, {
    headers: {
      "X-Tebex-Secret": TEBEX_ACCOUNT_TOKEN,
      Accept: "application/json",
    },
  })

  return handleApiResponse<BasketResponse>(response)
}

export async function getBasketAuth(basketId: string, returnUrl: string) {
  const response = await fetch(
    `${TEBEX_BASE_URL}/${TEBEX_ACCOUNT_TOKEN}/baskets/${basketId}/auth?returnUrl=${encodeURIComponent(returnUrl)}`,
    {
      headers: {
        "X-Tebex-Secret": TEBEX_ACCOUNT_TOKEN,
        Accept: "application/json",
      },
    },
  )

  return handleApiResponse<Array<{ url: string }>>(response)
}

class TebexError extends Error {
  type: string
  title: string
  status: number
  detail: string

  constructor(options: { type: string; title: string; status: number; detail: string }) {
    super(options.detail)
    this.type = options.type
    this.title = options.title
    this.status = options.status
    this.detail = options.detail
  }
}

export async function createBasket(options: {
  username?: string
  return_url?: string
  complete_url?: string
  cancel_url?: string
}) {
  try {
    const response = await fetch(`${TEBEX_BASE_URL}/${TEBEX_ACCOUNT_TOKEN}/baskets`, {
      method: "POST",
      headers: {
        "X-Tebex-Secret": TEBEX_ACCOUNT_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: options.username,
        return_url: options.return_url,
        complete_url: options.complete_url,
        cancel_url: options.cancel_url,
        complete_auto_redirect: true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      throw new TebexError({
        type: "BasketCreationError",
        title: "Failed to create basket",
        status: response.status,
        detail: errorData.message || "Unknown error occurred while creating basket",
      })
    }

    const data = await response.json()
    if (!data?.data?.id) {
      throw new TebexError({
        type: "InvalidResponseError",
        title: "Invalid basket response",
        status: 500,
        detail: "Received invalid response from Tebex API",
      })
    }

    return data
  } catch (error) {
    console.error("Create basket error:", error)
    if (error instanceof TebexError) {
      throw error
    }
    throw new TebexError({
      type: "UnexpectedError",
      title: "Unexpected error",
      status: 500,
      detail: error instanceof Error ? error.message : "An unexpected error occurred",
    })
  }
}

export async function addToBasket(basketId: string, packageData: any) {
  const response = await fetch(`${TEBEX_BASE_URL}/${TEBEX_ACCOUNT_TOKEN}/baskets/${basketId}/packages`, {
    method: "POST",
    headers: {
      "X-Tebex-Secret": TEBEX_ACCOUNT_TOKEN,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(packageData),
  })

  return handleApiResponse(response)
}

export async function removeFromBasket(basketId: string, packageId: string) {
  const response = await fetch(`${TEBEX_BASE_URL}/${TEBEX_ACCOUNT_TOKEN}/baskets/${basketId}/packages/${packageId}`, {
    method: "DELETE",
    headers: {
      "X-Tebex-Secret": TEBEX_ACCOUNT_TOKEN,
      Accept: "application/json",
    },
  })

  return handleApiResponse(response)
}

export async function getCheckoutUrl(basketId: string) {
  const response = await fetch(`${TEBEX_BASE_URL}/${TEBEX_ACCOUNT_TOKEN}/baskets/${basketId}/checkout`, {
    headers: {
      "X-Tebex-Secret": TEBEX_ACCOUNT_TOKEN,
      Accept: "application/json",
    },
  })

  return handleApiResponse<{ url: string }>(response)
}

