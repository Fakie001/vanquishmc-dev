import type { TebexPackage, CategoryType } from "@/types/tebex"

type ServerType = "Factions" | "Prison"

export const SERVERS: Record<ServerType, { token: string; description: string }> = {
  Factions: {
    token: process.env.TEBEX_PUBLIC_KEY || "t11h-a35eacf1867ba8e19fc4b33f00fd8e52d805dee2",
    description: "Build your faction, raid enemies, and dominate the server!",
  },
  Prison: {
    token: process.env.TEBEX_PUBLIC_KEY || "t11h-a35eacf1867ba8e19fc4b33f00fd8e52d805dee2",
    description: "Mine your way to freedom, upgrade your pickaxe, and become the richest player!",
  },
}

// Specific package IDs for different categories
const FACTION_RANK_PACKAGES = [6487989, 6487992, 6487995, 6487996, 6487999, 6488003]
const FACTION_UPGRADE_PACKAGES = [6488060, 6488079, 6488086, 6488089, 6488091]
const FACTION_KEYS_PACKAGES = [6468051, 6468101, 6468112]
const FACTION_BUNDLE_PACKAGES = [6468093, 6468096, 6468105, 6468110, 6468114, 6468116]
const FACTION_SUMMONER_PACKAGES = [6478636, 6478643, 6470895]
const FACTION_DISGUISE_PACKAGES = [6478418, 6478491, 6478492, 6478496, 6478502, 6478503, 6478505, 6478507]
const FACTION_TAG_PACKAGES = [
  6469393, 6468206, 6469374, 6469376, 6469378, 6469380, 6469381, 6469383, 6469385, 6469390, 6469392, 6469389,
]
const FACTION_KITS_PACKAGES = [6468192, 6468194]
const TAGS_CATEGORY_ID = 2782178

// Prison-specific package IDs
const PRISON_RANK_PACKAGES = [7001, 7002, 7003, 7004, 7005] // Example IDs
const PRISON_PICKAXE_PACKAGES = [7101, 7102, 7103] // Example IDs
const PRISON_KEY_PACKAGES = [7201, 7202, 7203] // Example IDs

export function organizePackagesByCategory(packages: TebexPackage[], serverType: ServerType) {
  const organized = new Map<CategoryType, TebexPackage[]>()

  // Get unique categories from packages
  const categories = Array.from(new Set(packages.map((pkg) => pkg.category?.name))).filter(Boolean) as CategoryType[]

  // Initialize categories with empty arrays
  categories.forEach((category) => {
    organized.set(category, [])
  })

  // Ensure required categories exist for each server type
  if (serverType === "Factions") {
    if (!organized.has("Ranks")) organized.set("Ranks", [])
    if (!organized.has("Keys")) organized.set("Keys", [])
    if (!organized.has("Tags")) organized.set("Tags", [])
    if (!organized.has("Kits")) organized.set("Kits", [])
  } else if (serverType === "Prison") {
    if (!organized.has("Ranks")) organized.set("Ranks", [])
    if (!organized.has("Pickaxes")) organized.set("Pickaxes", [])
    if (!organized.has("Keys")) organized.set("Keys", [])
  }

  // Sort packages into their categories
  packages.forEach((pkg) => {
    if (pkg.category?.name) {
      if (serverType === "Factions") {
        // Factions categorization logic
        if (FACTION_RANK_PACKAGES.includes(pkg.id)) {
          const rankPackages = organized.get("Ranks") || []
          rankPackages.push({
            ...pkg,
            category: { id: pkg.category.id, name: "Ranks" },
          })
          organized.set("Ranks", rankPackages)
        } else if (FACTION_UPGRADE_PACKAGES.includes(pkg.id)) {
          const upgradePackages = organized.get("Upgrade") || []
          upgradePackages.push({
            ...pkg,
            category: { id: pkg.category.id, name: "Upgrade" },
          })
          organized.set("Upgrade", upgradePackages)
        } else if (FACTION_KEYS_PACKAGES.includes(pkg.id)) {
          const keyPackages = organized.get("Keys") || []
          keyPackages.push({
            ...pkg,
            category: { id: pkg.category.id, name: "Keys" },
          })
          organized.set("Keys", keyPackages)
        } else if (FACTION_BUNDLE_PACKAGES.includes(pkg.id)) {
          const keyPackages = organized.get("Keys") || []
          keyPackages.push({
            ...pkg,
            category: {
              id: pkg.category.id,
              name: "Keys",
              isBundle: true,
            },
          })
          organized.set("Keys", keyPackages)
        } else if (FACTION_TAG_PACKAGES.includes(pkg.id) || pkg.category?.id === TAGS_CATEGORY_ID) {
          const tagPackages = organized.get("Tags") || []
          tagPackages.push({
            ...pkg,
            category: { id: TAGS_CATEGORY_ID, name: "Tags" },
          })
          organized.set("Tags", tagPackages)
        } else if (FACTION_KITS_PACKAGES.includes(pkg.id)) {
          const kitsPackages = organized.get("Kits") || []
          kitsPackages.push({
            ...pkg,
            category: { id: pkg.category.id, name: "Kits" },
          })
          organized.set("Kits", kitsPackages)
        }
      } else if (serverType === "Prison") {
        // Prison categorization logic
        if (PRISON_RANK_PACKAGES.includes(pkg.id)) {
          const rankPackages = organized.get("Ranks") || []
          rankPackages.push({
            ...pkg,
            category: { id: pkg.category.id, name: "Ranks" },
          })
          organized.set("Ranks", rankPackages)
        } else if (PRISON_PICKAXE_PACKAGES.includes(pkg.id)) {
          const pickaxePackages = organized.get("Pickaxes") || []
          pickaxePackages.push({
            ...pkg,
            category: { id: pkg.category.id, name: "Pickaxes" },
          })
          organized.set("Pickaxes", pickaxePackages)
        } else if (PRISON_KEY_PACKAGES.includes(pkg.id)) {
          const keyPackages = organized.get("Keys") || []
          keyPackages.push({
            ...pkg,
            category: { id: pkg.category.id, name: "Keys" },
          })
          organized.set("Keys", keyPackages)
        }
      }
    }
  })

  // Sort packages within each category by price
  organized.forEach((packages, category) => {
    organized.set(
      category,
      packages.sort((a, b) => a.price - b.price),
    )
  })

  return organized
}

