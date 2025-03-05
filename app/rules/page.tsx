import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { RulesSection } from "@/components/rules-section"

export default function RulesPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#1F1A29]">
      <SiteHeader />
      <main className="flex-1 pt-16">
        <RulesSection />
      </main>
      <SiteFooter />
    </div>
  )
}

