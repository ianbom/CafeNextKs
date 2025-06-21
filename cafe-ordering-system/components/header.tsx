"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Coffee } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import ThemeToggle from "./theme-toggle"

export default function Header() {
  const { state, dispatch } = useCart()
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const pathname = usePathname()

  // Sembunyikan cart jika rute adalah "/" atau cocok dengan "/payment/[id]"
  const hideCart = pathname === "/" || /^\/payment\/[^/]+$/.test(pathname)

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-amber-600 dark:text-amber-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Brew & Bite</span>
          </Link>

          {/* <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/order/new/menu"
              className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
            >
              Menu
            </Link>
          </nav> */}

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {!hideCart && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch({ type: "TOGGLE_CART" })}
                className="relative border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 dark:bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}