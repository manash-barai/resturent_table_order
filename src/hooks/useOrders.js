import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/orderService';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(() => {
    try {
      const data = orderService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    // Listen for storage events (if multiple tabs/windows open)
    const handleStorageChange = (e) => {
      if (e.key === 'south_pos_orders_v1') {
        loadOrders();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadOrders]);

  const createOrder = useCallback((orderData) => {
    const newOrder = orderService.createOrder(orderData);
    loadOrders();
    return newOrder;
  }, [loadOrders]);

  const updateOrder = useCallback((orderId, updatedData) => {
    const updated = orderService.updateOrder(orderId, updatedData);
    loadOrders();
    return updated;
  }, [loadOrders]);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    const updated = orderService.updateOrderStatus(orderId, newStatus);
    loadOrders();
    return updated;
  }, [loadOrders]);

  const updatePayment = useCallback((orderId, paymentMethod, paymentStatus) => {
    const updated = orderService.updatePayment(orderId, paymentMethod, paymentStatus);
    loadOrders();
    return updated;
  }, [loadOrders]);

  const deleteOrder = useCallback((orderId) => {
    const success = orderService.deleteOrder(orderId);
    loadOrders();
    return success;
  }, [loadOrders]);

  const resetOrders = useCallback(() => {
    const demo = orderService.resetToDemo();
    setOrders(demo);
    return demo;
  }, []);

  return {
    orders,
    loading,
    refreshOrders: loadOrders,
    createOrder,
    updateOrder,
    updateOrderStatus,
    updatePayment,
    deleteOrder,
    resetOrders
  };
}
