export interface TebexBasket {
  id: string
  ident: string
  complete: boolean
  email?: string
  username?: string
  coupons: Array<{
    coupon_code: string
  }>
  giftcards: Array<{
    card_number: string
  }>
  creator_code?: string
  cancel_url: string
  complete_url?: string
  complete_auto_redirect: boolean
  country: string
  ip: string
  username_id?: number
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
    revenue_share?: Array<{
      wallet_ref: string
      amount: number
      gateway_fee_percent: number
    }>
  }>
  custom?: {
    [key: string]: any
  }
  links: {
    payment: string
    checkout: string
  }
}

export interface TebexPackage {
  id: number
  name: string
  description: string
  image: string | null
  type: string
  category: {
    id: number
    name: string
  } | null
  base_price: number
  sales_tax: number
  total_price: number
  currency: string
  discount: number
  disable_quantity: boolean
  disable_gifting: boolean
  expiration_date: string | null
  created_at: string
  updated_at: string
}

export interface TebexCategory {
  id: number
  name: string
  slug: string
  parent: Record<string, any>
  description: string
  packages: TebexPackage[]
  order: number
  display_type: string
}

export interface TebexAuthResponse {
  name: string
  url: string
}

export interface TebexError {
  error: string
  details?: string
  type?: string
}

