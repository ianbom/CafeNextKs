

// hooks/useMenu.ts
'use client'

import { useState, useEffect } from 'react'
import { Categories, categoriesApiService } from '@/lib/api/categories'

export interface UseCategoriesState {
  categories: Categories[]
  loading: boolean
  error: string | null
  refetch: () => void
}



// Hook untuk semua menu items
export const useAllCategories = (): UseCategoriesState & { pagination: any }=> {
  const [categories, setMenuItems] = useState<Categories[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoriesApiService.getAllCategories()
      setMenuItems(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error in useAllCategories:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    categories,
    pagination,
    loading,
    error,
    refetch: fetchData
  }
}



