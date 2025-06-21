// hooks/useMenu.ts
'use client'

import { useState, useEffect } from 'react'
import { MenuItem, menuApiService } from '@/lib/api/menu'

export interface UseMenuState {
  menuItems: MenuItem[]
  loading: boolean
  error: string | null
  refetch: () => void
}

// Hook untuk featured menu items
export const useFeaturedMenu = (): UseMenuState => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const items = await menuApiService.getFeaturedMenuItems()
      setMenuItems(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error in useFeaturedMenu:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    menuItems,
    loading,
    error,
    refetch: fetchData
  }
}

// Hook untuk semua menu items
export const useAllMenu = (): UseMenuState & { pagination: any } => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await menuApiService.getAllMenuItems()
      setMenuItems(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error in useAllMenu:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    menuItems,
    pagination,
    loading,
    error,
    refetch: fetchData
  }
}

// Hook untuk menu berdasarkan kategori
export const useMenuByCategory = (categoryId: number): UseMenuState => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const items = await menuApiService.getMenuByCategory(categoryId)
      setMenuItems(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error in useMenuByCategory:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (categoryId) {
      fetchData()
    }
  }, [categoryId])

  return {
    menuItems,
    loading,
    error,
    refetch: fetchData
  }
}

// Hook untuk menu yang tersedia saja
export const useAvailableMenu = (): UseMenuState => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const items = await menuApiService.getAvailableMenuItems()
      setMenuItems(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error in useAvailableMenu:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    menuItems,
    loading,
    error,
    refetch: fetchData
  }
}