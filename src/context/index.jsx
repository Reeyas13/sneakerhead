import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { ProductProvider } from './ProductContext';
import { OrderProvider } from './OrderContext';

// Combine all providers into a single provider component
export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            {children}
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

// Export all context hooks
export { useAuth } from './AuthContext';
export { useCart } from './CartContext';
export { useProducts } from './ProductContext';
export { useOrders } from './OrderContext';
