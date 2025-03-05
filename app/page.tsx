import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
      </main>
    </div>
  )
}

