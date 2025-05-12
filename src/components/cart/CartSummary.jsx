import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const CartSummary = () => {
  const { cartItems, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  // Calculate shipping cost (free shipping over $100)
  const shippingCost = cartTotal > 100 ? 0 : 10;
  
  // Calculate tax (13% tax rate)
  const taxRate = 0.13;
  const taxAmount = (cartTotal - discount) * taxRate;
  
  // Calculate order total
  const orderTotal = cartTotal - discount + shippingCost + taxAmount;

  const handleApplyCoupon = () => {
    // Simple coupon validation
    if (couponCode.trim() === '') {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    // Example coupon codes
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setDiscount(cartTotal * 0.1); // 10% discount
      setCouponError('');
    } else if (couponCode.toUpperCase() === 'SNEAKER20') {
      setDiscount(cartTotal * 0.2); // 20% discount
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setDiscount(0);
    }
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({cartItems.length} items)</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          {shippingCost === 0 ? (
            <span className="text-green-600">Free</span>
          ) : (
            <span>${shippingCost.toFixed(2)}</span>
          )}
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Tax (13%)</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between font-semibold text-lg text-gray-800">
            <span>Total</span>
            <span>${orderTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Coupon Code */}
      <div className="mb-6">
        <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
          Apply Coupon
        </label>
        <div className="flex">
          <input
            type="text"
            id="coupon"
            placeholder="Enter coupon code"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button
            onClick={handleApplyCoupon}
            className="bg-gray-800 text-white px-4 py-2 rounded-r hover:bg-gray-700 transition duration-300"
          >
            Apply
          </button>
        </div>
        {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
      </div>
      
      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={cartItems.length === 0}
        className="w-full bg-primary-600 text-white py-3 rounded-md font-medium hover:bg-primary-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Proceed to Checkout
      </button>
      
      {/* Payment Methods */}
      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-2">We Accept:</p>
        <div className="flex items-center space-x-3">
          <i className="fab fa-cc-visa text-2xl text-blue-700"></i>
          <i className="fab fa-cc-mastercard text-2xl text-red-500"></i>
          <i className="fab fa-cc-paypal text-2xl text-blue-800"></i>
          <span className="text-sm font-semibold text-purple-700">eSewa</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
