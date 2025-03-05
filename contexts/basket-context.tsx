"use client"

import type React from "react"

import { createContext, useContext, useReducer, useCallback, useState, useEffect } from "react"
import { toast } from "sonner"

interface BasketItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string | null
}

interface BasketState {
  items: BasketItem[]
  total: number
  isLoading: boolean
  error?: string
}

type BasketAction =
  | { type: "SET_ITEMS"; payload: BasketItem[] }
  | { type: "SET_TOTAL"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_BASKET" }
  | { type: "ADD_ITEM"; payload: BasketItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }

const initialState: BasketState = {
  items: [],
  total: 0,
  isLoading: false,
}

function basketReducer(state: BasketState, action: BasketAction): BasketState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload }
    case "SET_TOTAL":
      return { ...state, total: action.payload }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "CLEAR_BASKET":
      return initialState
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id)

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += 1

        return {
          ...state,
          items: updatedItems,
          total: state.total + action.payload.price,
        }
      } else {
        // Add new item
        return {
          ...state,
          items: [...state.items, action.payload],
          total: state.total + action.payload.price,
        }
      }
    }
    case "REMOVE_ITEM": {
      const removedItem = state.items.find((item) => item.id === action.payload)
      if (!removedItem) return state

      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        total: state.total - removedItem.price * removedItem.quantity,
      }
    }
    case "UPDATE_QUANTITY": {
      const itemIndex = state.items.findIndex((item) => item.id === action.payload.id)
      if (itemIndex === -1) return state

      const item = state.items[itemIndex]
      const oldQuantity = item.quantity
      const newQuantity = Math.max(1, action.payload.quantity) // Ensure minimum quantity is 1

      const updatedItems = [...state.items]
      updatedItems[itemIndex] = {
        ...item,
        quantity: newQuantity,
      }

      const priceDifference = item.price * (newQuantity - oldQuantity)

      return {
        ...state,
        items: updatedItems,
        total: state.total + priceDifference,
      }
    }
    default:
      return state
  }
}

interface BasketContextType {
  basket: BasketState
  isOpen: boolean
  openBasket: () => void
  closeBasket: () => void
  addItem: (packageId: string, username: string) => Promise<void>
  removeItem: (packageId: string) => Promise<void>
  updateQuantity: (packageId: string, delta: number) => Promise<void>
  checkout: () => Promise<string | undefined>
  refreshBasket: () => Promise<void>
}

const BasketContext = createContext<BasketContextType | undefined>(undefined)

// Helper function to get the base URL
function getBaseUrl() {
  // Check if we're running on the client
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  // For server-side, use the environment variable or a fallback
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(basketReducer, initialState)
  const [isOpen, setIsOpen] = useState(false)

  // Effect for initial fetch of basket data
  useEffect(() => {
    refreshBasket()
  }, [])

  // Function to refresh basket data from API or localStorage
  const refreshBasket = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      // Try to get basket from API
      const response = await fetch("/api/basket", {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()

        if (data.data?.packages) {
          // Transform API data to our basket format
          const items: BasketItem[] = data.data.packages.map((pkg: any) => ({
            id: pkg.package.id,
            name: pkg.package.name,
            price: Number.parseFloat(pkg.package.price),
            quantity: pkg.qty,
            image: null, // API doesn't provide images in basket
          }))

          dispatch({ type: "SET_ITEMS", payload: items })
          dispatch({ type: "SET_TOTAL", payload: data.data.total_price })
        }
      } else {
        // If API fails, fall back to localStorage
        const savedBasket = localStorage.getItem("basket")
        if (savedBasket) {
          const parsedBasket = JSON.parse(savedBasket)
          dispatch({ type: "SET_ITEMS", payload: parsedBasket.items })
          dispatch({ type: "SET_TOTAL", payload: parsedBasket.total })
        }
      }
    } catch (error) {
      console.error("Refresh basket error:", error)

      // Fall back to localStorage if API fails
      const savedBasket = localStorage.getItem("basket")
      if (savedBasket) {
        const parsedBasket = JSON.parse(savedBasket)
        dispatch({ type: "SET_ITEMS", payload: parsedBasket.items })
        dispatch({ type: "SET_TOTAL", payload: parsedBasket.total })
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  // Effect to save basket to localStorage when it changes
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem(
        "basket",
        JSON.stringify({
          items: state.items,
          total: state.total,
        }),
      )
    }
  }, [state.items, state.total])

  const addItem = useCallback(
    async (packageId: string, username: string) => {
      if (!username) {
        toast.error("Please enter your Minecraft username first")
        return
      }

      dispatch({ type: "SET_LOADING", payload: true })
      try {
        // Try API first
        const response = await fetch("/api/basket", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "add",
            packageId,
            username,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to add item to basket")
        }

        // Get package details for client-side (for name, price, etc.)
        const packageResponse = await fetch(`/api/tebex/packages?id=${packageId}`)
        let packageData = null

        if (packageResponse.ok) {
          packageData = await packageResponse.json()
        }

        // Add item to local state
        dispatch({
          type: "ADD_ITEM",
          payload: {
            id: packageId,
            name: packageData?.name || `Package ${packageId}`,
            price: packageData?.price || 10,
            quantity: 1,
            image: packageData?.image || null,
          },
        })

        // Open the basket drawer
        setIsOpen(true)

        await refreshBasket() // Refresh basket after adding item
      } catch (error) {
        console.error("Add item error:", error)
        toast.error(error instanceof Error ? error.message : "Failed to add item")

        // Fall back to client-side only
        dispatch({
          type: "ADD_ITEM",
          payload: {
            id: packageId,
            name: `Package ${packageId}`,
            price: 10, // Default price
            quantity: 1,
            image: null,
          },
        })

        setIsOpen(true)
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [refreshBasket],
  )

  const removeItem = useCallback(
    async (packageId: string) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        // Try API first
        await fetch("/api/basket", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "remove",
            packageId,
          }),
        })

        // Update local state
        dispatch({ type: "REMOVE_ITEM", payload: packageId })

        toast.success("Item removed from basket")
        await refreshBasket() // Refresh basket after removing item
      } catch (error) {
        console.error("Remove item error:", error)
        toast.error(error instanceof Error ? error.message : "Failed to remove item")

        // Still update local state even if API fails
        dispatch({ type: "REMOVE_ITEM", payload: packageId })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [refreshBasket],
  )

  const updateQuantity = useCallback(
    async (packageId: string, delta: number) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        const item = state.items.find((item) => item.id === packageId)
        if (!item) throw new Error("Item not found")

        const newQuantity = item.quantity + delta
        if (newQuantity < 1) {
          // If quantity would be less than 1, remove the item
          return removeItem(packageId)
        }

        // Try API first
        await fetch("/api/basket", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "update-quantity",
            packageId,
            quantity: newQuantity,
          }),
        })

        // Update local state
        dispatch({
          type: "UPDATE_QUANTITY",
          payload: { id: packageId, quantity: newQuantity },
        })

        await refreshBasket() // Refresh basket after updating quantity
      } catch (error) {
        console.error("Update quantity error:", error)

        // Still update local state even if API fails
        const item = state.items.find((item) => item.id === packageId)
        if (item) {
          const newQuantity = Math.max(1, item.quantity + delta)
          dispatch({
            type: "UPDATE_QUANTITY",
            payload: { id: packageId, quantity: newQuantity },
          })
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.items, removeItem, refreshBasket],
  )

  const checkout = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      // Try to get checkout URL from API
      const response = await fetch("/api/checkout/process", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const data = await response.json()

      if (data.success && data.url) {
        // Return the URL without redirecting, so component can handle navigation
        return data.url
      } else {
        // Fall back to checkout page
        return `${getBaseUrl()}/store/checkout`
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to proceed to checkout")
      return `${getBaseUrl()}/store/checkout?error=true`
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const openBasket = useCallback(() => setIsOpen(true), [])
  const closeBasket = useCallback(() => setIsOpen(false), [])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = {
    basket: state,
    isOpen,
    openBasket,
    closeBasket,
    addItem,
    removeItem,
    updateQuantity,
    checkout,
    refreshBasket,
  }

  return <BasketContext.Provider value={contextValue}>{children}</BasketContext.Provider>
}

export function useBasket() {
  const context = useContext(BasketContext)
  if (!context) {
    throw new Error("useBasket must be used within BasketProvider")
  }
  return context
}

