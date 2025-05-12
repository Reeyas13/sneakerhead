import { createContext, useState, useEffect, useContext } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Load cart items when user is authenticated
  useEffect(() => {
    const fetchCartItems = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const { data } = await cartAPI.getCart();
          setCartItems(data);
        } catch (err) {
          console.error('Error fetching cart:', err);
          setError(err.response?.data?.message || 'Failed to fetch cart');
        } finally {
          setLoading(false);
        }
      } else {
        // For non-authenticated users, load cart from localStorage
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }
      }
    };

    fetchCartItems();
  }, [isAuthenticated]);

  // Save cart to localStorage for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated && cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  // Add item to cart
  const addToCart = async (product, quantity = 1, size = null, color = null) => {
    try {
      setLoading(true);
      setError(null);

      if (isAuthenticated) {
        // For authenticated users, use API
        const { data } = await cartAPI.addToCart({
          productId: product.id,
          quantity,
          size,
          color,
        });

        // Update cart items with the new item
        const existingItemIndex = cartItems.findIndex(item => item.id === data.id);
        if (existingItemIndex !== -1) {
          // Replace existing item
          setCartItems(prevItems => [
            ...prevItems.slice(0, existingItemIndex),
            data,
            ...prevItems.slice(existingItemIndex + 1),
          ]);
        } else {
          // Add new item
          setCartItems(prevItems => [...prevItems, data]);
        }
      } else {
        // For non-authenticated users, handle cart locally
        const existingItemIndex = cartItems.findIndex(
          item => item.productId === product.id && item.size === size && item.color === color
        );

        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          const updatedCartItems = [...cartItems];
          updatedCartItems[existingItemIndex].quantity += quantity;
          setCartItems(updatedCartItems);
        } else {
          // Add new item
          const newItem = {
            id: Date.now().toString(), // Generate temporary ID
            productId: product.id,
            quantity,
            size,
            color,
            price: product.discountPrice || product.price,
            Product: product, // Include product details
          };
          setCartItems(prevItems => [...prevItems, newItem]);
        }
      }

      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItemQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);
      setError(null);

      if (isAuthenticated) {
        // For authenticated users, use API
        await cartAPI.updateCartItem(itemId, { quantity });

        // Update cart items
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        );
      } else {
        // For non-authenticated users, update locally
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        );
      }

      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      setError(null);

      if (isAuthenticated) {
        // For authenticated users, use API
        await cartAPI.removeFromCart(itemId);
      }

      // Remove item from state
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));

      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isAuthenticated) {
        // For authenticated users, use API
        await cartAPI.clearCart();
      }

      // Clear cart in state and localStorage
      setCartItems([]);
      localStorage.removeItem('cart');

      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart totals
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );

  const itemsCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    itemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
