import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

const CartPage = () => {
  const { cartItems, loading, error, clearCart } = useCart();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <div className="text-red-500 mb-4"><i className="fas fa-exclamation-circle text-xl"></i></div>
          <h3 className="text-lg font-semibold mb-2">Error Loading Cart</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 mb-4">
            <i className="fas fa-shopping-cart text-5xl"></i>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link 
            to="/products" 
            className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Cart Items ({cartItems.length})
              </h2>
              <button 
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>
            
            <div className="divide-y divide-gray-200">
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            
            <div className="mt-8">
              <Link 
                to="/products" 
                className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        
        {/* Cart Summary */}
        <div className="lg:w-1/3">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
