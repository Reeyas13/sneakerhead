import { createContext, useState, useContext } from 'react';
import { ordersAPI, paymentAPI } from '../services/api';
import { useCart } from './CartContext';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { clearCart } = useCart();

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await ordersAPI.getOrders();
      setOrders(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch order by ID
  const fetchOrderById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await ordersAPI.getOrderById(id);
      setCurrentOrder(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create new order
  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await ordersAPI.createOrder(orderData);
      setCurrentOrder(data);
      
      // Clear the cart after successful order creation
      await clearCart();
      
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Process eSewa payment
  const processEsewaPayment = async (orderId, amount, productName) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await paymentAPI.createEsewaPayment({
        orderId,
        amount,
        productName
      });
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process payment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify eSewa payment
  const verifyEsewaPayment = async (verificationData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await paymentAPI.verifyEsewaPayment(verificationData);
      
      // If payment is verified, update order status
      if (data.success && currentOrder) {
        await ordersAPI.updateOrderToPaid(currentOrder.id, {
          paymentId: verificationData.refId
        });
        
        // Refresh current order
        await fetchOrderById(currentOrder.id);
      }
      
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify payment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    orders,
    currentOrder,
    loading,
    error,
    fetchOrders,
    fetchOrderById,
    createOrder,
    processEsewaPayment,
    verifyEsewaPayment
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
