
// lib/api/menu.ts

export type Categories = {
  id: number
  name: string
  description: number
}

export type ApiResponse = {
  data: Categories[]
    pagination: {
    totalItems: number
    currentPage: number
    itemsPerPage: number
    totalPages: number
    nextPage: number | null
    prevPage: number | null
  }

}

class CategoriesApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  }

  // Mengambil semua menu items
  async getAllCategories(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/categories`, {
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
      console.error('Error fetching categories items:', error)
      throw new Error('Failed to fetch categories items')
    }
  }

  // Mengambil menu item berdasarkan ID
  async getCategoriesById(id: number): Promise<Categories | null> {
    try {
      const response = await this.getAllCategories()
      return response.data.find(item => item.id === id) || null
    } catch (error) {
      console.error('Error fetching menu item by ID:', error)
      throw error
    }
  }


}

// Export instance yang bisa digunakan di seluruh aplikasi
export const categoriesApiService = new CategoriesApiService()

// Export individual functions jika prefer functional approach
export const fetchAllCategories = () => categoriesApiService.getAllCategories()
export const fetchCategoriesById = (id: number) => categoriesApiService.getCategoriesById(id)
