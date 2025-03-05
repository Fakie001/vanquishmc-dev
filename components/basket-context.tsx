"use client"

import type React from "react"

import { createContext, useContext, useReducer, useEffect, useState } from "react"
import { addToBasket, removeFromBasket, applyDiscount, checkout } from "@/app/actions"
import { toast } from "sonner"

interface BasketItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface BasketState {
  items: BasketItem[]
  total: number
  discount?: {
    code: string
    amount: number
  }
}

interface BasketContextType {
  basket: BasketState
  minecraftUsername: string | null
  setMinecraftUsername: (username: string) => void
  addItem: (item: Omit<BasketItem, "quantity">) => Promise<void>
  removeItem: (id: number) => Promise<void>
  applyDiscountCode: (code: string) => Promise<void>
  proceedToCheckout: () => Promise<string | undefined>
}

const BasketContext = createContext<BasketContextType | undefined>(undefined)

const initialState: BasketState = {
  items: [],
  total: 0,
}

type BasketAction =
  | { type: "ADD_ITEM"; payload: BasketItem }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "APPLY_DISCOUNT"; payload: { code: string; amount: number } }
  | { type: "CLEAR_BASKET" }

function basketReducer(state: BasketState, action: BasketAction): BasketState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
          total: state.total + action.payload.price,
        }
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price,
      }
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => {
          if (item.id === action.payload) {
            state.total -= item.price * item.quantity
            return false
          }
          return true
        }),
      }
    case "APPLY_DISCOUNT":
      return {
        ...state,
        discount: action.payload,
      }
    case "CLEAR_BASKET":
      return initialState
    default:
      return state
  }
}

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [basket, dispatch] = useReducer(basketReducer, initialState)
  const [minecraftUsername, setMinecraftUsername] = useState<string | null>(null)

  // Load minecraft username from localStorage on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem("minecraft_username")
    if (savedUsername) {
      setMinecraftUsername(savedUsername)
    }
  }, [])

  // Save minecraft username to localStorage when it changes
  useEffect(() => {
    if (minecraftUsername) {
      localStorage.setItem("minecraft_username", minecraftUsername)
    }
  }, [minecraftUsername])

  const addItem = async (item: Omit<BasketItem, "quantity">) => {
    if (!minecraftUsername) {
      toast.error("Please enter your Minecraft username first")
      return
    }

    try {
      const result = await addToBasket(item.id, minecraftUsername)
      if (!result.success) throw new Error(result.error)

      dispatch({ type: "ADD_ITEM", payload: { ...item, quantity: 1 } })
      toast.success("Item added to basket")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add item")
    }
  }

  const removeItem = async (id: number) => {
    try {
      const result = await removeFromBasket(id)
      if (!result.success) throw new Error(result.error)

      dispatch({ type: "REMOVE_ITEM", payload: id })
      toast.success("Item removed from basket")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove item")
    }
  }

  const applyDiscountCode = async (code: string) => {
    try {
      const result = await applyDiscount(code)
      if (!result.success) throw new Error(result.error)

      dispatch({
        type: "APPLY_DISCOUNT",
        payload: {
          code,
          amount: result.data.discount,
        },
      })
      toast.success("Discount applied successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to apply discount")
    }
  }

  const proceedToCheckout = async () => {
    try {
      const result = await checkout()
      if (!result.success) throw new Error(result.error)

      dispatch({ type: "CLEAR_BASKET" })
      return result.url
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to proceed to checkout")
    }
  }

  return (
    <BasketContext.Provider
      value={{
        basket,
        minecraftUsername,
        setMinecraftUsername,
        addItem,
        removeItem,
        applyDiscountCode,
        proceedToCheckout,
      }}
    >
      {children}
    </BasketContext.Provider>
  )
}

export function useBasket() {
  const context = useContext(BasketContext)
  if (context === undefined) {
    throw new Error("useBasket must be used within a BasketProvider")
  }
  return context
}

