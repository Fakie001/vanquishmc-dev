"use client"

import type React from "react"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface LoginDialogProps {
  open: boolean
  onClose: () => void
  onLogin: (username: string) => void
}

export function LoginDialog({ open, onClose, onLogin }: LoginDialogProps) {
  const [username, setUsername] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onLogin(username.trim())
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="bg-[#1a1f2e] border-gray-800 sm:max-w-[400px] text-center"
        aria-describedby="login-dialog-description"
      >
        <div className="flex flex-col items-center gap-4">
          <div id="login-dialog-description" className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Please enter your username</h2>
            <p className="text-sm text-gray-400">Enter your in-game name so we can identify you on our server.</p>
          </div>
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#1a1f2e] border-purple-500/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 bg-[#1a1f2e] hover:bg-[#252a3d] text-gray-400 hover:text-gray-300"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                type="submit"
                className={cn(
                  "flex-1 bg-purple-600/90 hover:bg-purple-700/90 text-white",
                  "shadow-[0_0_15px_rgba(147,51,234,0.5)]",
                  "transition-all duration-300",
                  "border border-purple-500/50",
                )}
                disabled={!username.trim()}
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

