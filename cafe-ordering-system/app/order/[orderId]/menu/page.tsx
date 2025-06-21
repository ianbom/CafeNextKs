"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import MenuCard from "@/components/menu-card"
import CartSidebar from "@/components/cart-sidebar"
import CheckoutModal from "@/components/checkout-modal"
import { useCart } from "@/lib/cart-context"
import { menuItems, categories } from "@/lib/mock-data"
import type { MenuItem, CustomerInfo } from "@/lib/types"
import { useFeaturedMenu } from "@/hooks/useMenu"
import { useAllCategories } from "@/hooks/useCategories"
import React from "react"

interface MenuPageProps {
  params: {
    orderId: number
  }
}

export default function MenuPage({ params }: MenuPageProps) {
  const resolvedParams = typeof params.then === 'function' ? React.use(params) : params;
  const orderId = resolvedParams.orderId;
  
  const router = useRouter()
  const { cart, dispatch } = useCart()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState("")

  const { menuItems, loading, error, refetch} = useFeaturedMenu();
  const { categories } = useAllCategories();


  // Filter items berdasarkan search dan category
  const filteredItems = menuItems?.filter((item) => {
    const matchesSearch = searchTerm === "" || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    const matchesCategory = selectedCategory === "All" || 
      item.category.name === selectedCategory
    
    return matchesSearch && matchesCategory
  }) || []

  const handleAddToCart = (item: MenuItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const handleCheckout = () => {
    setShowCheckoutModal(true)
    setCheckoutError("")
  }

  const handleConfirmCheckout = async (customerInfo: CustomerInfo) => {
    if (!cart.items || cart.items.length === 0) {
      setCheckoutError("Cart is empty")
      return
    }

    setIsCheckingOut(true)
    setCheckoutError("")

    try {
      // Format cart items sesuai dengan struktur API
      const cartItems = cart.items.map(item => ({
        menuId: item.id,
        quantity: item.quantity,
        ...(item.notes && { notes: item.notes })
      }))

      const checkoutData = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        cartItems: cartItems
      }

      const response = await fetch(`http://localhost:3000/api/orders/${orderId}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Checkout successful:", data)

      // Clear cart and close modal
      dispatch({ type: "CLEAR_CART" })
      setShowCheckoutModal(false)

      // Navigate to payment page
      router.push(`/payment/${orderId}`)
      
    } catch (error) {
      console.error('Checkout error:', error)
      setCheckoutError(error instanceof Error ? error.message : "Checkout failed. Please try again.")
    } finally {
      setIsCheckingOut(false)
    }
  }

  const handleCloseCheckoutModal = () => {
    if (!isCheckingOut) {
      setShowCheckoutModal(false)
      setCheckoutError("")
    }
  }

  // Tambahkan "All" ke awal categories
  const allCategories = [
    { id: 0, name: "All" },
    ...(categories || [])
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
          Our Menu
        </h1>
        {/* <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Order #{params.orderId}</p> */}
         <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Order #{orderId}</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.name ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.name)}
              className={
                selectedCategory === category.name
                  ? "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white"
                  : "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              }
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Loading menu items...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 dark:text-red-400">Error loading menu items. Please try again.</p>
          <Button onClick={refetch} className="mt-4">
            Retry
          </Button>
        </div>
      )}

      {/* Menu Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}

      {!loading && !error && filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No items found matching your search.</p>
        </div>
      )}

      <CartSidebar onCheckout={handleCheckout} />

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={handleCloseCheckoutModal}
        onConfirm={handleConfirmCheckout}
        isLoading={isCheckingOut}
        error={checkoutError}
      />
    </div>
  )
}