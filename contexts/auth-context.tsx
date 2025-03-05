"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { TebexUser } from "@/types/user"

interface AuthContextType {
  user: TebexUser | null
  isLoading: boolean
  loginWithUsername: (username: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TebexUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("minecraft_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const loginWithUsername = async (username: string) => {
    // In a real implementation, you would verify the username with your server
    const user = {
      id: Date.now().toString(),
      username: username,
      minecraft_username: username,
      avatar_url: `https://mc-heads.net/avatar/${username}`,
    }
    setUser(user)
    localStorage.setItem("minecraft_user", JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("minecraft_user")
  }

  return <AuthContext.Provider value={{ user, isLoading, loginWithUsername, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

