// lib/api/menu.ts

export type MenuItem = {
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

export type ApiResponse = {
  data: MenuItem[]
  pagination: {
    totalItems: number
    currentPage: number
    itemsPerPage: number
    totalPages: number
    nextPage: number | null
    prevPage: number | null
  }
}

class MenuApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  }

  // Mengambil semua menu items
  async getAllMenuItems(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/menus`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Untuk data yang sering berubah
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching menu items:', error)
      throw new Error('Failed to fetch menu items')
    }
  }

  // Mengambil featured menu items (6 items pertama)
  async getFeaturedMenuItems(): Promise<MenuItem[]> {
    try {
      const response = await this.getAllMenuItems()
      return response.data.slice(0, 6)
    } catch (error) {
      console.error('Error fetching featured menu items:', error)
      throw error
    }
  }

  // Mengambil menu berdasarkan kategori
  async getMenuByCategory(categoryId: number): Promise<MenuItem[]> {
    try {
      const response = await this.getAllMenuItems()
      return response.data.filter(item => item.categoryId === categoryId)
    } catch (error) {
      console.error('Error fetching menu by category:', error)
      throw error
    }
  }

  // Mengambil menu item berdasarkan ID
  async getMenuItemById(id: number): Promise<MenuItem | null> {
    try {
      const response = await this.getAllMenuItems()
      return response.data.find(item => item.id === id) || null
    } catch (error) {
      console.error('Error fetching menu item by ID:', error)
      throw error
    }
  }

  // Mengambil menu yang tersedia saja
  async getAvailableMenuItems(): Promise<MenuItem[]> {
    try {
      const response = await this.getAllMenuItems()
      return response.data.filter(item => item.isAvailable)
    } catch (error) {
      console.error('Error fetching available menu items:', error)
      throw error
    }
  }
}

// Export instance yang bisa digunakan di seluruh aplikasi
export const menuApiService = new MenuApiService()

// Export individual functions jika prefer functional approach
export const fetchAllMenuItems = () => menuApiService.getAllMenuItems()
export const fetchFeaturedMenuItems = () => menuApiService.getFeaturedMenuItems()
export const fetchMenuByCategory = (categoryId: number) => menuApiService.getMenuByCategory(categoryId)
export const fetchMenuItemById = (id: number) => menuApiService.getMenuItemById(id)
export const fetchAvailableMenuItems = () => menuApiService.getAvailableMenuItems()