import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { ThemeProvider } from "@/lib/theme-context"
import Header from "@/components/header"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Pilih bobot font yang ingin Anda gunakan
  variable: '--font-poppins', // <-- Penting: Definisikan CSS variable
});

export const metadata: Metadata = {
  title: "Brew & Bite Cafe - Order Online",
  description:
    "Order delicious coffee, food, and pastries from Brew & Bite Cafe. Fresh ingredients, artisanal quality, delivered to your table.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">{children}</main>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
