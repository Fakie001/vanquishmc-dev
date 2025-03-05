"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useBasket } from "@/contexts/basket-context"

export function MinecraftUsernameDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { setMinecraftUsername } = useBasket()
  const [username, setUsername] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      setMinecraftUsername(username.trim())
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Your Minecraft Username</DialogTitle>
          <DialogDescription>
            Please enter your Minecraft username to continue with the purchase. This will be used to deliver your items
            in-game.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Your Minecraft username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

