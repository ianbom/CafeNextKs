export interface MenuItem {
  id: number
  categoryId: number
  name: string
  price: number
  isAvailable: boolean
  estimatedTime: number
  thumbnailUrl: string
  createdAt: string
  updatedAt: string
  category: {
    id: number
    name: string
    description: string
    createdAt: string
    updatedAt: string
  }
  images: any[]
}

export interface CartItem extends MenuItem {
  quantity: number
  notes: string
}

export interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  date: string
}

export interface CafeInfo {
  name: string
  description: string
  address: string
  openingHours: string
  phone: string
}

export interface CustomerInfo {
  name: string
  phone: string
}
