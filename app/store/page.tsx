import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { StoreSection } from "@/components/store-section"
import { getStoreData } from "@/lib/store-cache"
import { organizePackagesByCategory } from "@/lib/store-utils"
import type { OrganizedStore } from "@/types/tebex"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default async function StorePage() {
  try {
    const storeData = await getStoreData()

    const organizedStores: OrganizedStore = {}

    // Organize packages for each server
    Object.entries(storeData).forEach(([serverName, serverData]) => {
      organizedStores[serverName] = organizePackagesByCategory(serverData.packages, serverName as any)
    })

    return (
      <div className="relative flex min-h-screen flex-col bg-[#1F1A29]">
        <SiteHeader />
        <main className="flex-1">
          <StoreSection initialStores={organizedStores} storeInfo={storeData} />
        </main>
        <SiteFooter />
      </div>
    )
  } catch (error) {
    return (
      <div className="relative flex min-h-screen flex-col bg-[#1F1A29]">
        <SiteHeader />
        <main className="flex-1 container py-24">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load store data"}
              <p className="mt-2 text-sm">Please try refreshing the page. If the problem persists, contact support.</p>
            </AlertDescription>
          </Alert>
        </main>
        <SiteFooter />
      </div>
    )
  }
}

