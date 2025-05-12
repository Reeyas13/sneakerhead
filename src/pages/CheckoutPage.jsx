import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CheckoutForm from '../components/checkout/CheckoutForm';

const CheckoutPage = () => {
  const { isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=checkout" replace />;
  }

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="max-w-3xl mx-auto">
        <CheckoutForm />
      </div>
    </div>
  );
};

export default CheckoutPage;
