export interface Product {
  id: string
  name: string
  slug: string
  description: string
  category: string
  price: number
  image_url: string
  created_at: string
}

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  total: number
  status: string
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
}
