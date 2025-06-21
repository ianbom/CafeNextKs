"use client"

import { useState } from "react"
import { CheckCircle, CreditCard, Smartphone, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useOrderDetails } from "@/hooks/useOrderDetails" // Import hook baru
import Link from "next/link"

interface PaymentPageProps {
  params: {
    orderId: string // params.orderId dari URL selalu string
  }
}

export default function PaymentPage({ params }: PaymentPageProps) {
  // Gunakan hook useOrderDetails untuk mengambil data
  const { order, loading, error, refetch } = useOrderDetails(params.orderId);

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Loading order details...</p>
      </div>
    );
  }

  // Tampilkan error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
        <Button onClick={refetch} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  // Tampilkan pesan jika order tidak ditemukan setelah loading selesai
 if (error || !order || !order.customerName) { // Tambahkan !order.customerName sebagai cek tambahan jika order object ada tapi datanya kosong
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300">
          <CardHeader className="flex flex-col items-center justify-center pt-8 pb-4">
            <XCircle className="h-16 w-16 text-red-500 dark:text-red-400 mb-4" />
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Order Not Found!
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We couldn't find an order with ID: <span className="font-semibold text-gray-800 dark:text-gray-200">{params.orderId}</span>.
              Please check the Order ID and try again, or start a new order.
            </p>
            {error && (
              <p className="text-red-500 text-sm mb-4">Error: {error}</p>
            )}
            <div className="flex flex-col space-y-4">
              <Button
                onClick={refetch}
                className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white"
              >
                Try Again
              </Button>
              <Link href="/" passHref>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subtotalCalculated = order.orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Order Confirmed!
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Order #{order.id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{item.menu.name}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">x{item.quantity}</span>
                  {item.notes && <p className="text-xs text-gray-500 dark:text-gray-400 italic">Notes: {item.notes}</p>}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Rp{(item.subtotal).toLocaleString('id-ID')}
                </span>
              </div>
            ))}

            <Separator className="bg-gray-200 dark:bg-gray-700" />

            <div className="space-y-2">
              <div className="flex justify-between text-gray-900 dark:text-white">
                <span>Subtotal</span>
                <span>Rp{subtotalCalculated.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-900 dark:text-white">
                <span>Tax</span>
                <span>Rp{order.tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-900 dark:text-white">
                <span>Service Charge</span>
                <span>Rp{order.serviceCharge.toLocaleString('id-ID')}</span>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>Rp{order.totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Payment Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Scan QRIS to Pay</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Use your mobile banking app to scan and pay
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-6 w-6 text-green-600 dark:text-green-500" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Pay with Card</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Credit or debit card payment</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <div className="h-6 w-6 bg-amber-600 dark:bg-amber-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Pay with Cash</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Pay when you pick up your order</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 transition-colors duration-300">
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Order Information</h4>
              <div className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <p>
                  <strong>Customer:</strong> {order.customerName}
                </p>
                <p>
                  <strong>Phone:</strong> {order.customerPhone}
                </p>
                <p>
                  <strong>Table Number:</strong> {order.tableNumber}
                </p>
                <p>
                  <strong>Estimated Time:</strong> {order.estimatedTime} minutes
                </p>
              </div>
            </div>

            <Button
              className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white"
              size="lg"
            >
              Confirm Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
          Thank you for your order! We'll start preparing your items once payment is confirmed.
        </p>
      </div>
    </div>
  )
}