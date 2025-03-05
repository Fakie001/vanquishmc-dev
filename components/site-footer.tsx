import Link from "next/link"
import { Facebook, Twitter, DiscIcon as Discord, Youtube } from "lucide-react"

const SOCIAL_LINKS = [
  {
    name: "Discord",
    href: "https://discord.gg/yourserver",
    icon: Discord,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/yourserver",
    icon: Twitter,
  },
  {
    name: "Facebook",
    href: "https://facebook.com/yourserver",
    icon: Facebook,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/yourserver",
    icon: Youtube,
  },
]

const FOOTER_LINKS = [
  {
    title: "Navigation",
    links: [
      { name: "Home", href: "/" },
      { name: "Store", href: "/store" },
      { name: "Rules", href: "/rules" },
      { name: "Vote", href: "/vote" },
    ],
  },
  {
    title: "Game Modes",
    links: [
      { name: "Factions", href: "/factions" },
      { name: "Prison", href: "/prison" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Discord", href: "https://discord.gg/yourserver" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Contact", href: "/contact" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-[#1B1726] border-t border-white/10">
      <div className="container px-4 md:px-6 py-8 md:py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Logo and Description */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/50 blur-xl animate-pulse rounded-full" />
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8dd38dmcRZDmmPQMQicjjHouUuopnx.png"
                  alt="VanquishMC Logo"
                  className="w-12 h-12 relative"
                />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-transparent bg-clip-text">
                VanquishMC
              </h2>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              Join our Minecraft community and experience unique game modes, custom plugins, and an amazing player base.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-purple-500 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-white/10">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} VanquishMC. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

