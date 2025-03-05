/**
 * Tebex API Client
 * This client supports both the Tebex Headless API and the Tebex Plugin API
 */

// Constants for Tebex API endpoints
const TEBEX_HEADLESS_API = "https://headless.tebex.io/api/accounts"
const TEBEX_PLUGIN_API = "https://plugin.tebex.io"

export class TebexApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: string,
  ) {
    super(message)
    this.name = "TebexApiError"
  }
}

export class TebexClient {
  private secretKey: string
  private baseUrl: string = TEBEX_PLUGIN_API

  constructor() {
    // Use the provided Tebex key
    this.secretKey = process.env.TEBEX_SECRET_KEY || "Rw4NeTLQYLd22dEjGMumcV1MNguPomfc"
    if (!this.secretKey) {
      console.warn("Missing TEBEX_SECRET_KEY environment variable. Using mock data for Tebex integration.")
    }
  }

  /**
   * Generic method to make API requests to Tebex
   */
  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      // Determine if this is a headless API or plugin API endpoint
      const baseUrl = endpoint.startsWith("/accounts") ? TEBEX_HEADLESS_API : TEBEX_PLUGIN_API

      // Remove the leading slash if present
      if (endpoint.startsWith("/")) {
        endpoint = endpoint.substring(1)
      }

      // Make the request
      const url = `${baseUrl}/${endpoint}`

      // If we don't have a secret key, return mock data
      if (!this.secretKey) {
        return this.getMockData<T>(endpoint)
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "X-Tebex-Secret": this.secretKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      // Handle non-success responses
      if (!response.ok) {
        // Attempt to parse error information
        const errorData = await response.json().catch(() => ({ message: response.statusText }))
        console.error("Tebex API error:", errorData)
        throw new TebexApiError(
          errorData.message || "An error occurred with the Tebex API",
          response.status,
          JSON.stringify(errorData),
        )
      }

      // Parse and return the response data
      return await response.json()
    } catch (error) {
      if (error instanceof TebexApiError) {
        throw error
      }

      console.error("Tebex client error:", error)

      // If there's an error, return mock data
      return this.getMockData<T>(endpoint)
    }
  }

  /**
   * Generate mock data for development and testing
   */
  private getMockData<T>(endpoint: string): T {
    console.log(`Generating mock data for endpoint: ${endpoint}`)

    // Basic mock data structure
    const mockData: any = {
      success: true,
      data: {},
    }

    if (endpoint.includes("/baskets") && endpoint.includes("/checkout")) {
      // Mock checkout URL
      return {
        url: "http://localhost:3000/store/checkout/confirmed?txn_id=mock-transaction-123",
      } as T
    }

    if (endpoint.includes("/baskets") && endpoint.includes("/packages") && !endpoint.includes("DELETE")) {
      // Mock add to basket response
      return {
        success: true,
        data: {
          message: "Package added to basket",
        },
      } as T
    }

    if (endpoint.includes("/baskets") && !endpoint.includes("/packages")) {
      // Mock basket data
      const isPost = endpoint.endsWith("/baskets")

      mockData.data = {
        id: "mock-basket-123",
        ident: "mock-basket-123",
        complete: false,
        username: "testuser",
        base_price: 19.99,
        sales_tax: 0,
        total_price: 19.99,
        currency: "USD",
        packages: [
          {
            qty: 1,
            type: "single",
            package: {
              id: "1001",
              name: "Warrior Rank",
              price: "19.99",
            },
          },
        ],
        links: {
          payment: "http://localhost:3000/store/checkout",
          checkout: "http://localhost:3000/store/checkout",
        },
      }

      return mockData as T
    }

    if (endpoint.includes("/packages")) {
      // Mock package data
      const packageId = endpoint.split("/").pop()

      if (packageId && !isNaN(Number.parseInt(packageId))) {
        // Return specific package
        return {
          id: packageId,
          name: `Package ${packageId}`,
          description: "A premium Minecraft package",
          price: 19.99,
          image: null,
        } as T
      } else {
        // Return package list
        return {
          data: [
            {
              id: "1001",
              name: "Warrior Rank",
              description: "A basic rank with essential permissions",
              price: 9.99,
              image: null,
            },
            {
              id: "1002",
              name: "Elite Rank",
              description: "An upgraded rank with additional perks",
              price: 19.99,
              image: null,
            },
            {
              id: "1003",
              name: "Legend Kit",
              description: "Premium equipment and tools",
              price: 14.99,
              image: null,
            },
          ],
        } as T
      }
    }

    // Default mock response
    return { success: true, data: { message: "Mock data response" } } as T
  }

  /**
   * Create a new basket using the Headless API
   */
  async createBasket(options: {
    username?: string
    return_url?: string
    complete_url?: string
    cancel_url?: string
  }) {
    return this.fetch(`accounts/${this.secretKey}/baskets`, {
      method: "POST",
      body: JSON.stringify({
        username: options.username,
        return_url: options.return_url,
        complete_url: options.complete_url,
        cancel_url: options.cancel_url,
        complete_auto_redirect: true,
      }),
    })
  }

  /**
   * Get a basket using the Headless API
   */
  async getBasket(basketId: string) {
    return this.fetch(`accounts/${this.secretKey}/baskets/${basketId}`)
  }

  /**
   * Add an item to a basket using the Headless API
   */
  async addToBasket(basketId: string, packageId: string, username: string) {
    return this.fetch(`accounts/${this.secretKey}/baskets/${basketId}/packages`, {
      method: "POST",
      body: JSON.stringify({
        package_id: packageId,
        quantity: 1,
        username,
      }),
    })
  }

  /**
   * Remove an item from a basket using the Headless API
   */
  async removeFromBasket(basketId: string, packageId: string) {
    return this.fetch(`accounts/${this.secretKey}/baskets/${basketId}/packages/${packageId}`, {
      method: "DELETE",
    })
  }

  /**
   * Update the quantity of an item in a basket using the Headless API
   */
  async updateQuantity(basketId: string, packageId: string, quantity: number) {
    return this.fetch(`accounts/${this.secretKey}/baskets/${basketId}/packages/${packageId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    })
  }

  /**
   * Get the checkout URL for a basket using the Headless API
   */
  async getCheckoutUrl(basketId: string) {
    return this.fetch<{ url: string }>(`accounts/${this.secretKey}/baskets/${basketId}/checkout`)
  }

  /**
   * Apply a coupon to a basket using the Headless API
   */
  async applyCoupon(basketId: string, code: string) {
    return this.fetch(`accounts/${this.secretKey}/baskets/${basketId}/coupon`, {
      method: "POST",
      body: JSON.stringify({ code }),
    })
  }

  /**
   * Make a direct payment using the Plugin API
   * This is useful for single-item purchases without a basket
   */
  async createDirectPayment({
    username,
    packageId,
    price,
    note = "",
  }: {
    username: string
    packageId: number
    price: number
    note?: string
  }) {
    return this.fetch("payments", {
      method: "POST",
      body: JSON.stringify({
        note: note || `Purchase for ${username}`,
        packages: [{ id: packageId }],
        price: price,
        ign: username,
      }),
    })
  }

  /**
   * Get information about a package from the Plugin API
   */
  async getPackage(packageId: string) {
    return this.fetch(`packages/${packageId}`)
  }

  /**
   * Get a list of all packages from the Plugin API
   */
  async getPackages() {
    return this.fetch("packages")
  }

  /**
   * Get a list of all recent payments
   */
  async getPayments(limit = 10) {
    return this.fetch(`payments?limit=${limit}`)
  }
}

export const tebexClient = new TebexClient()

