import { redirect } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CheckoutConfirmedPage({ searchParams }: { searchParams: { txn_id?: string } }) {
  const txnId = searchParams.txn_id

  // If no transaction ID is provided, redirect to the store
  if (!txnId) {
    return redirect("/store")
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#1F1A29]">
      <SiteHeader />
      <main className="flex-1 container py-16">
        <Card className="max-w-lg mx-auto bg-[#2A2438] border-[#9D74FF]/10 p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">Payment Confirmed!</h1>
              <p className="text-gray-400">Your transaction has been successfully processed.</p>
            </div>

            <Alert className="bg-[#1F1A29] border-[#9D74FF]/20">
              <AlertCircle className="h-4 w-4 text-emerald-500" />
              <AlertDescription className="text-gray-300">
                Your items will be delivered to your account when you next join the server.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 w-full pt-4">
              <div className="text-sm text-left space-y-2">
                <div className="flex justify-between pb-2 border-b border-[#9D74FF]/10">
                  <span className="text-gray-400">Transaction ID:</span>
                  <span className="text-white font-mono">{txnId}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#9D74FF]/10">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-6">
                <Button asChild className="w-full bg-[#9D74FF] hover:bg-[#B594FF] text-white">
                  <Link href="/store">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Store
                  </Link>
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

