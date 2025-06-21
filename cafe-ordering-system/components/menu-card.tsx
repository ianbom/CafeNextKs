"use client"

import Image from "next/image"
import type { MenuItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface MenuCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg dark:hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="aspect-square relative">
        <Image src={item.thumbnailUrl || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{item.name}</h3>
        <p className="text-xl font-bold text-amber-600 dark:text-amber-500">Rp. {item.price.toFixed()}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(item)}
          className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
