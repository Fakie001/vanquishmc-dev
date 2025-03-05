import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SupportSection } from "@/components/support-section"

export default function SupportPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#1F1A29]">
      <SiteHeader />
      <main className="flex-1 pt-16">
        <SupportSection />
      </main>
      <SiteFooter />
    </div>
  )
}

