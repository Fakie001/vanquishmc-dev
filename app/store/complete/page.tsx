import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, ShoppingBag, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function CompletePage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#1F1A29]">
      <SiteHeader />
      <main className="flex-1 container py-20">
        <Card className="max-w-2xl mx-auto bg-[#2A2438] border-[#9D74FF]/10 p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">Thank You For Your Purchase!</h1>
              <p className="text-gray-400">Your order has been successfully processed.</p>
            </div>

            <div className="w-full max-w-md p-6 bg-[#1F1A29] rounded-lg">
              <div className="space-y-4">
                <div className="flex justify-between pb-2 border-b border-[#9D74FF]/10">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-emerald-500 font-medium">Complete</span>
                </div>

                <div className="flex justify-between pb-2 border-b border-[#9D74FF]/10">
                  <span className="text-gray-400">Items:</span>
                  <span className="text-white">Delivered to your account</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Support:</span>
                  <Link href="/support" className="text-[#9D74FF] hover:underline flex items-center gap-1">
                    Get help <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4 w-full pt-4">
              <p className="text-gray-300">
                Your items have been delivered to your Minecraft account. Log in to the server to see your new
                purchases!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-[#9D74FF] hover:bg-[#B594FF] text-white">
                  <Link href="/store">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>

                <Button asChild variant="outline" className="border-[#9D74FF]/20 hover:bg-[#9D74FF]/10">
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>
      <SiteFooter />
    </div>
  )
}

