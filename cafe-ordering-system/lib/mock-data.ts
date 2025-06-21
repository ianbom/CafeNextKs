import type { MenuItem, Review, CafeInfo } from "./types"

export const cafeInfo: CafeInfo = {
  name: "Brew & Bite Cafe",
  description:
    "A cozy neighborhood cafe serving freshly roasted coffee, artisanal pastries, and delicious comfort food. Perfect for work, study, or catching up with friends.",
  address: "123 Coffee Street, Downtown District, City 12345",
  openingHours: "Monday - Friday: 7:00 AM - 9:00 PM | Saturday - Sunday: 8:00 AM - 10:00 PM",
  phone: "+1 (555) 123-4567",
}

export const menuItems: MenuItem[] = [
  // Coffee
  {
    id: "1",
    name: "Espresso",
    description: "Rich and bold single shot of our signature blend",
    price: 3.5,
    category: "Coffee",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Cappuccino",
    description: "Perfect balance of espresso, steamed milk, and foam",
    price: 4.75,
    category: "Coffee",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Latte",
    description: "Smooth espresso with steamed milk and light foam",
    price: 5.25,
    category: "Coffee",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "4",
    name: "Cold Brew",
    description: "Smooth, refreshing cold-steeped coffee",
    price: 4.25,
    category: "Coffee",
    image: "/placeholder.svg?height=200&width=200",
  },
  // Food
  {
    id: "5",
    name: "Avocado Toast",
    description: "Fresh avocado on artisan sourdough with cherry tomatoes",
    price: 8.5,
    category: "Food",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "6",
    name: "Grilled Sandwich",
    description: "Turkey, cheese, and vegetables on fresh bread",
    price: 9.75,
    category: "Food",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "7",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with parmesan and croutons",
    price: 10.25,
    category: "Food",
    image: "/placeholder.svg?height=200&width=200",
  },
  // Pastries
  {
    id: "8",
    name: "Croissant",
    description: "Buttery, flaky French pastry baked fresh daily",
    price: 3.25,
    category: "Pastries",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "9",
    name: "Blueberry Muffin",
    description: "Moist muffin packed with fresh blueberries",
    price: 4.5,
    category: "Pastries",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "10",
    name: "Chocolate Chip Cookie",
    description: "Warm, gooey cookie with premium chocolate chips",
    price: 2.75,
    category: "Pastries",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export const reviews: Review[] = [
  {
    id: "1",
    customerName: "Sarah Johnson",
    rating: 5,
    comment: "Amazing coffee and friendly staff! The atmosphere is perfect for working.",
    date: "2024-01-15",
  },
  {
    id: "2",
    customerName: "Mike Chen",
    rating: 4,
    comment: "Great food and coffee. The avocado toast is my favorite!",
    date: "2024-01-12",
  },
  {
    id: "3",
    customerName: "Emily Davis",
    rating: 5,
    comment: "Best cafe in the neighborhood. Love coming here for meetings.",
    date: "2024-01-10",
  },
]

export const categories = ["All", "Coffee", "Food", "Pastries"]
