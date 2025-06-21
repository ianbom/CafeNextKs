// pages/index.tsx atau app/page.tsx
'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Star, Clock, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cafeInfo, reviews } from "@/lib/mock-data"
import { useFeaturedMenu } from "@/hooks/useMenu" // Asumsi hook ini mengembalikan data featured menu

// Shadcn UI Dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CafeHomepage() {
  const router = useRouter()
  const { menuItems, loading, error, refetch } = useFeaturedMenu()

  // State untuk modal pilih meja (sudah ada)
  const [showTableModal, setShowTableModal] = useState(false)
  const [tableNumber, setTableNumber] = useState<string>("")
  const [isSubmittingTable, setIsSubmittingTable] = useState(false)
  const [tableSubmitError, setTableSubmitError] = useState<string | null>(null)

  // State baru untuk modal cek order
  const [showCheckOrderModal, setShowCheckOrderModal] = useState(false)
  const [orderIdInput, setOrderIdInput] = useState<string>("")
  const [isCheckingOrder, setIsCheckingOrder] = useState(false)
  const [checkOrderError, setCheckOrderError] = useState<string | null>(null)

  const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000'; // Menggunakan NEXT_PUBLIC_BACKEND_API_URL

  // Handler ketika tombol "Order Now" diklik (sudah ada)
  const handleOrderNowClick = () => {
    setShowTableModal(true)
    setTableSubmitError(null);
    setTableNumber("");
  }

  // Handler ketika form pemilihan meja disubmit (sudah ada)
  const handleTableSubmit = async () => {
    if (!tableNumber || isNaN(Number(tableNumber)) || Number(tableNumber) <= 0) {
      setTableSubmitError("Please enter a valid table number.")
      return
    }

    setIsSubmittingTable(true)
    setTableSubmitError(null)

    try {
      const response = await fetch(`${BACKEND_API_URL}/api/orders/choose-table`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableNumber: Number(tableNumber) }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const orderId = data.id; // Asumsi response memiliki properti 'id' untuk order yang baru dibuat

      setShowTableModal(false);
      router.push(`/order/${orderId}/menu`); // Redirect ke halaman order menu
    } catch (err: any) {
      console.error("Failed to choose table:", err);
      setTableSubmitError(`Failed to choose table: ${err.message}`);
    } finally {
      setIsSubmittingTable(false);
    }
  }

  // Handler baru ketika tombol "Check Order" diklik
  const handleCheckOrderClick = () => {
    setShowCheckOrderModal(true); // Tampilkan modal
    setCheckOrderError(null); // Reset error sebelumnya
    setOrderIdInput(""); // Reset input ID order
  }

  // Handler ketika form cek order disubmit
  const handleCheckOrderSubmit = async () => {
    if (!orderIdInput || isNaN(Number(orderIdInput)) || Number(orderIdInput) <= 0) {
      setCheckOrderError("Please enter a valid Order ID.")
      return
    }

    setIsCheckingOrder(true)
    setCheckOrderError(null)

    try {
      // Coba ambil detail order untuk memverifikasi ID
      const response = await fetch(`${BACKEND_API_URL}/api/orders/${orderIdInput}/payment`); // Gunakan endpoint detail order

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Order not found or an error occurred. Status: ${response.status}`);
      }

    

      // Jika respons OK, berarti order ditemukan
      setShowCheckOrderModal(false); // Tutup modal
      router.push(`/payment/${orderIdInput}`); // Redirect ke halaman detail order
    } catch (err: any) {
      console.error("Failed to check order:", err);
      setCheckOrderError(`Failed to check order: ${err.message}`);
    } finally {
      setIsCheckingOrder(false);
    }
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
              {cafeInfo.name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto transition-colors duration-300">
              {cafeInfo.description}
            </p>
            <div className="flex justify-center space-x-4"> {/* Container untuk tombol */}
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-lg px-8 py-3 text-white transition-colors duration-300"
                onClick={handleOrderNowClick}
              >
                Order Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-500 dark:hover:bg-gray-700 text-lg px-8 py-3 transition-colors duration-300"
                onClick={handleCheckOrderClick} // Handler untuk tombol baru
              >
                Check Order
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center transition-colors duration-300">
          <Clock className="h-8 w-8 text-amber-600 dark:text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Opening Hours</h2>
          <p className="text-gray-600 dark:text-gray-300">{cafeInfo.openingHours}</p>
        </div>
      </section>

      {/* Featured Menu */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Featured Menu
          </h2>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Discover our most popular items
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading menu items...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button
              onClick={refetch}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Menu Items Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg dark:hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div className="aspect-square relative">
                  <Image
                    src={item.thumbnailUrl || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{item.name}</h3>
                    <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs px-2 py-1 rounded">
                      {item.category.name}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    Estimated Time: {item.estimatedTime} min
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-500">
                      Rp{item.price.toLocaleString('id-ID')}
                    </p>
                    {!item.isAvailable && (
                      <span className="text-red-500 text-sm font-medium">Unavailable</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Show message if no items */}
        {!loading && !error && menuItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300">No menu items available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
          {/* Ubah Link ini juga jika ingin melalui alur pilih meja */}
          {/* <Link href="/order/new/menu">
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              View Full Menu
            </Button>
          </Link> */}
        </div>
      </section>

      {/* Location */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
              Visit Us
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-1" />
                <p className="text-gray-600 dark:text-gray-300">{cafeInfo.address}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                <p className="text-gray-600 dark:text-gray-300">{cafeInfo.phone}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center transition-colors duration-300">
            <p className="text-gray-500 dark:text-gray-400">Map Placeholder - Google Maps Embed</p>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Read reviews from our happy customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300"
            >
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">"{review.comment}"</p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">{review.customerName}</span>
                  <span>{new Date(review.date).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Modal untuk Memilih Nomor Meja (sudah ada) */}
      <Dialog open={showTableModal} onOpenChange={setShowTableModal}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>Choose Your Table</DialogTitle>
            <DialogDescription>
              Please enter your table number to proceed with your order.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tableNumber" className="text-right">
                Table No.
              </Label>
              <Input
                id="tableNumber"
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="col-span-3 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                min="1"
              />
            </div>
            {tableSubmitError && (
              <p className="text-red-500 text-sm text-center">{tableSubmitError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={handleTableSubmit}
              disabled={isSubmittingTable}
              className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white"
            >
              {isSubmittingTable ? "Submitting..." : "Start Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Baru untuk Memasukkan ID Order */}
      <Dialog open={showCheckOrderModal} onOpenChange={setShowCheckOrderModal}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>Check Your Order</DialogTitle>
            <DialogDescription>
              Please enter your Order ID to view its details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orderId" className="text-right">
                Order ID
              </Label>
              <Input
                id="orderId"
                type="number"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="col-span-3 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                min="1"
              />
            </div>
            {checkOrderError && (
              <p className="text-red-500 text-sm text-center">{checkOrderError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={handleCheckOrderSubmit}
              disabled={isCheckingOrder}
              className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white"
            >
              {isCheckingOrder ? "Checking..." : "View Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}