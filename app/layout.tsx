import { AuthProvider } from "@/contexts/auth-context"
import { BasketProvider } from "@/contexts/basket-context"
import { Toaster } from "sonner"
import { siteConfig } from "@/lib/metadata"
import "@/app/globals.css"
import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: "VanquishMC Team",
    },
  ],
  creator: "VanquishMC",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "VanquishMC - Premium Minecraft Server",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@vanquishmc",
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-16x16.png",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data for Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteConfig.name,
              description: siteConfig.description,
              url: siteConfig.url,
              potentialAction: {
                "@type": "PlayAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "minecraft://connect/vanquishmc.com",
                },
              },
            }),
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <BasketProvider>
            {children}
            <Toaster />
          </BasketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

import "./globals.css"



import './globals.css'