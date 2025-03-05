import { siteConfig } from "@/lib/metadata"
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/store", "/rules", "/vote", "/support"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  return routes
}

