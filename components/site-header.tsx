"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, LogOut, Scroll, Vote, ShoppingBag, LifeBuoy } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LoginDialog } from "./login-dialog"
import { BasketDrawer } from "./basket-drawer"
import { ScrollToTop } from "./scroll-to-top"
import { useAuth } from "@/contexts/auth-context"
import { useBasket } from "@/contexts/basket-context"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { MobileNav } from "./mobile-nav"
import { PackageVariablesDialog } from "./package-variables-dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"

const NAV_ITEMS = [
  { href: "/rules", icon: Scroll, label: "Rules" },
  { href: "/vote", icon: Vote, label: "Vote" },
  { href: "/store", icon: ShoppingBag, label: "Store" },
  { href: "/support", icon: LifeBuoy, label: "Support" },
]

export function SiteHeader() {
  const router = useRouter()
  const { user, isLoading, loginWithUsername, logout } = useAuth()
  const { basket, isOpen: isBasketOpen, openBasket, closeBasket, updateQuantity, removeItem, checkout } = useBasket()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoverStyle, setHoverStyle] = useState({})
  const [activeStyle, setActiveStyle] = useState({})
  const pathname = usePathname()
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [variablesDialogOpen, setVariablesDialogOpen] = useState(false)
  const [pendingVariables, setPendingVariables] = useState<Array<{ identifier: string; name: string }>>([])

  const handleLogin = async (username: string) => {
    await loginWithUsername(username)
    setIsLoginOpen(false)
  }

  const handleBasketClick = async () => {
    if (!user) {
      setIsLoginOpen(true)
      return
    }

    try {
      const response = await fetch(`/api/basket/auth?returnUrl=${encodeURIComponent(window.location.origin)}/store`)

      if (!response.ok) {
        throw new Error("Failed to check basket authentication")
      }

      const data = await response.json()

      if (data.error) {
        console.error("Basket auth error:", data.error)
        openBasket()
        return
      }

      if (data.variables?.length > 0) {
        setPendingVariables(data.variables)
        setVariablesDialogOpen(true)
        return
      }

      if (data.authRequired && data.authUrl) {
        window.location.href = data.authUrl
        return
      }

      openBasket()
    } catch (error) {
      console.error("Basket auth error:", error)
      openBasket()
    }
  }

  const handleCheckout = async () => {
    // Close the basket drawer first
    closeBasket()

    // Get checkout URL
    const url = await checkout()

    // If we have a URL, redirect to it
    if (url) {
      window.location.href = url
    } else {
      // If we don't have a URL (e.g. in development mode), go to checkout page
      router.push("/store/checkout")
    }
  }

  // Update active indicator position when pathname changes
  useEffect(() => {
    const activeIndex = NAV_ITEMS.findIndex((item) => item.href === pathname)
    if (activeIndex !== -1) {
      const activeElement = navRefs.current[activeIndex]
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
          transition: pathname === "/" ? "none" : "all 0.3s ease-out", // Disable transition on initial load
        })
        // Enable transition after initial position is set
        setTimeout(() => {
          setActiveStyle((prev) => ({
            ...prev,
            transition: "all 0.3s ease-out",
          }))
        }, 0)
      }
    }
  }, [pathname])

  // Update hover indicator position
  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = navRefs.current[hoveredIndex]
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        })
      }
    }
  }, [hoveredIndex])

  return (
    <>
      <header
        className={cn("fixed top-0 w-full z-50", "bg-[rgba(32,28,46,0.65)] backdrop-blur-md border-b border-white/5")}
      >
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center justify-center md:justify-start gap-2 md:gap-4 flex-1 md:flex-none">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/50 blur-xl animate-pulse rounded-full" />
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KDaC9LAp3ock8goeFDXpMNAFQ0da17.png"
                  alt="VanquishMC Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 relative"
                  priority
                />
              </div>
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-transparent bg-clip-text">
                VanquishMC
              </span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center">
            <nav className="flex items-center gap-6 relative">
              {/* Hover highlight */}
              <div
                className="absolute h-[30px] transition-all duration-300 ease-out bg-[#8B5CF6]/10 rounded-md"
                style={{
                  ...hoverStyle,
                  opacity: hoveredIndex !== null ? 1 : 0,
                }}
              />

              {/* Active indicator */}
              <div
                className="absolute bottom-0 h-0.5 bg-[#8B5CF6] transition-all duration-300 ease-out shadow-[0_0_10px_#8B5CF6] shadow-[#8B5CF6]"
                style={activeStyle}
              />

              {NAV_ITEMS.map((item, index) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    ref={(el) => (navRefs.current[index] = el)}
                    className={cn(
                      "text-sm transition-colors relative py-1 px-3",
                      "flex items-center gap-2 h-[30px]",
                      pathname === item.href ? "text-white" : "text-[#B8B5C0] hover:text-white",
                    )}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Icon className="h-4 w-4 text-purple-400" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="relative flex items-center gap-2 bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 backdrop-blur-xl text-white h-9 px-2 md:px-4"
              onClick={handleBasketClick}
              aria-label="Open shopping cart"
            >
              <ShoppingCart className="h-4 w-4 text-purple-400" />
              {basket.items.length > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-cyan-500 text-[10px] flex items-center justify-center text-white">
                    {basket.items.length}
                  </span>
                  <span className="hidden md:inline-block text-sm ml-2">${basket.total.toFixed(2)}</span>
                </>
              )}
            </Button>

            {isLoading ? (
              <Skeleton className="h-9 w-[100px] bg-[#1a1f2e]" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 bg-[#1a1f2e] hover:bg-[#252a3d] text-white h-9 px-2 md:px-4"
                  >
                    <Image
                      src={user.avatar_url || "/placeholder.svg"}
                      alt={user.minecraft_username}
                      width={20}
                      height={20}
                      className="rounded"
                    />
                    <span className="hidden md:inline-block">{user.minecraft_username}</span>
                    <VisuallyHidden>{user.minecraft_username}</VisuallyHidden>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#1a1f2e] border-gray-800 text-white">
                  <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                className={cn(
                  "bg-[#8B5CF6] hover:bg-[#A17CFF]",
                  "text-white",
                  "shadow-[0_0_15px_rgba(147,51,234,0.5)]",
                  "transition-all duration-300",
                  "border border-purple-500/50",
                  "h-9 px-4",
                )}
                onClick={() => setIsLoginOpen(true)}
              >
                Login
              </Button>
            )}
          </div>
        </div>

        <BasketDrawer
          open={isBasketOpen}
          onClose={closeBasket}
          items={basket.items}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onCheckout={handleCheckout}
        />

        <LoginDialog open={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
        <PackageVariablesDialog
          open={variablesDialogOpen}
          onClose={() => setVariablesDialogOpen(false)}
          variables={pendingVariables}
          onSubmit={(variables) => {
            setVariablesDialogOpen(false)
            // Handle the variables here
            openBasket()
          }}
        />
      </header>
      <ScrollToTop />
    </>
  )
}

