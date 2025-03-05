import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { VoteSection } from "@/components/vote-section"

export default function VotePage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#1F1A29]">
      <SiteHeader />
      <main className="flex-1 pt-16">
        <VoteSection />
      </main>
      <SiteFooter />
    </div>
  )
}

