// src/hooks/useOrderDetails.ts
'use client'; // Pastikan directive ini ada jika digunakan di komponen klien

import { useState, useEffect, useCallback } from "react";
import { orderDetailsService, OrderDetail } from "@/lib/api/order"; // Import service dan interface

// Export interface OrderDetail agar komponen lain bisa menggunakannya
export type { OrderDetail };

interface UseOrderDetailsResult {
  order: OrderDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOrderDetails(orderId: string): UseOrderDetailsResult {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setOrder(null);
      setLoading(false);
      setError("Order ID is missing.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Panggil fungsi API dari service yang terpisah
      const data = await orderDetailsService.getOrderDetailsById(orderId);
      setOrder(data);
    } catch (err: any) {
      console.error("Error fetching order details in hook:", err);
      // Tangkap error dari service, pastikan pesan error informatif
      setError(err.message || "Failed to load order details.");
    } finally {
      setLoading(false);
    }
  }, [orderId]); // orderId tetap menjadi dependency karena hook bergantung padanya

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]); // Panggil fetchOrder setiap kali fetchOrder berubah (termasuk orderId)

  const refetch = () => {
    fetchOrder();
  };

  return { order, loading, error, refetch };
}