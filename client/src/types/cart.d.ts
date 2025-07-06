import type { Book } from "./book";

export interface CartItem {
  addedAt: string,
  product: Book,
  quantity: number
}
export interface GetCarts {
  items: CartItem[]
  message?: string
}
export interface AddToCart {
    productId : string,
    quantity: number
}