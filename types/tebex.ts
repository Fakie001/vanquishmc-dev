export type CategoryType =
  | "Ranks"
  | "Upgrades"
  | "Keys"
  | "Kits"
  | "Summoners"
  | "Disguises"
  | "Boosters"
  | "Tags"
  | "Pickaxes" // Added for Prison

export type ServerType = "Factions" | "Prison"

export interface TebexPackage {
  id: number
  name: string
  description: string
  price: number
  image: string | null
  category?: {
    id: number
    name: string
    isBundle?: boolean
  }
  type?: string
  currency?: string
  discount?: number
  disable_quantity?: boolean
  disable_gifting?: boolean
  expiration_date?: string | null
  created_at?: string
  updated_at?: string
}

export interface TebexResponse {
  store: {
    name: string
    currency: {
      symbol: string
      iso_4217: string
    }
  }
  packages: TebexPackage[]
  categories: Array<{
    id: number
    name: string
    slug: string
    description: string
    order: number
    display_type: string
  }>
}

export interface TebexBasket {
  id: string
  ident: string
  complete: boolean
  email?: string
  username?: string
  base_price: number
  sales_tax: number
  total_price: number
  currency: string
  packages: Array<{
    qty: number
    type: string
    package: {
      id: string
      name: string
      price: string
    }
  }>
  links: {
    payment: string
    checkout: string
  }
}

export interface OrganizedStore {
  [serverName: string]: Map<CategoryType, TebexPackage[]>
}

