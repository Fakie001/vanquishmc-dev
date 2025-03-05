export interface BasketItem {
  id: number
  name: string
  image: string
  price: number
  quantity: number
}

export interface Basket {
  items: BasketItem[]
  total: number
}

