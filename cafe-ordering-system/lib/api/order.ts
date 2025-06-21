// src/lib/api/orderDetails.ts

// Definisikan interface untuk data order yang diterima dari API
// Ini harus sesuai dengan struktur JSON yang Anda berikan
export interface OrderDetail {
  id: number;
  customerName: string;
  customerPhone: string;
  tableNumber: number;
  totalAmount: number;
  tax: number;
  serviceCharge: number;
  orderStatus: string;
  estimatedTime: number;
  createdAt: string;
  updatedAt: string;
  orderItems: Array<{
    id: number;
    orderId: number;
    menuId: number;
    quantity: number;
    price: number; // Harga per item di order (bisa berbeda dari harga menu saat ini)
    notes: string | null;
    subtotal: number; // Subtotal untuk item ini (quantity * price)
    createdAt: string;
    updatedAt: string;
    menu: { // Detail menu terkait item order
      id: number;
      categoryId: number;
      name: string;
      price: number; // Harga menu saat ini (mungkin berbeda dari price di orderItem)
      isAvailable: boolean;
      estimatedTime: number;
      thumbnailUrl: string;
      createdAt: string;
      updatedAt: string;
    };
  }>;
}

class OrderDetailsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';
  }

  /**
   * Fetches order details by order ID.
   * @param orderId The ID of the order to fetch.
   * @returns A promise that resolves to OrderDetail.
   * @throws An error if the fetch fails or the order is not found.
   */
  async getOrderDetailsById(orderId: string): Promise<OrderDetail> {
    if (!orderId) {
      throw new Error("Order ID is required to fetch details.");
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/orders/${orderId}/payment`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Penting untuk data yang sering berubah
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const data: OrderDetail = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching order details for ID ${orderId}:`, error);
      throw new Error(`Failed to fetch order details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export instance yang bisa digunakan di seluruh aplikasi
export const orderDetailsService = new OrderDetailsService();

// Export individual functions jika prefer functional approach
export const fetchOrderDetailsById = (orderId: string) => orderDetailsService.getOrderDetailsById(orderId);