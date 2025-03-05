"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, Scroll, Vote, ShoppingBag, LifeBuoy } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

export function MobileNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden hover:bg-purple-500/10 hover:text-purple-400 -ml-2">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] bg-[#1F1A29] border-r border-white/10">
        <SheetHeader className="border-b border-white/10 pb-4">
          <SheetTitle className="text-white">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-4">
          <Link
            href="/rules"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center px-4 py-3 text-base rounded-lg transition-colors gap-3",
              pathname === "/rules"
                ? "bg-[#9D74FF]/20 text-white"
                : "text-[#B8B5C0] hover:bg-[#9D74FF]/10 hover:text-white",
            )}
          >
            <Scroll className="h-5 w-5 text-purple-400" />
            Rules
          </Link>
          <Link
            href="/vote"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center px-4 py-3 text-base rounded-lg transition-colors gap-3",
              pathname === "/vote"
                ? "bg-[#9D74FF]/20 text-white"
                : "text-[#B8B5C0] hover:bg-[#9D74FF]/10 hover:text-white",
            )}
          >
            <Vote className="h-5 w-5 text-purple-400" />
            Vote
          </Link>
          <Link
            href="/store"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center px-4 py-3 text-base rounded-lg transition-colors gap-3",
              pathname === "/store"
                ? "bg-[#9D74FF]/20 text-white"
                : "text-[#B8B5C0] hover:bg-[#9D74FF]/10 hover:text-white",
            )}
          >
            <ShoppingBag className="h-5 w-5 text-purple-400" />
            Store
          </Link>
          <div className="mt-4 pt-4 border-t border-white/10">
            <Link
              href="/support"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center px-4 py-3 text-base rounded-lg transition-colors gap-3",
                pathname === "/support"
                  ? "bg-[#9D74FF]/20 text-white"
                  : "text-[#B8B5C0] hover:bg-[#9D74FF]/10 hover:text-white",
              )}
            >
              <LifeBuoy className="h-5 w-5 text-purple-400" />
              Support
            </Link>
          </div>
        </nav>

        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={() => {
                logout()
                setOpen(false)
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

