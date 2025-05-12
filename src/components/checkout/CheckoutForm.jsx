import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';

const CheckoutForm = () => {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { createOrder, processEsewaPayment, loading, error } = useOrders();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Nepal',
    paymentMethod: 'eSewa'
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [orderProcessing, setOrderProcessing] = useState(false);

  // Calculate shipping cost (free shipping over $100)
  const shippingCost = typeof cartTotal === 'number' && cartTotal > 100 ? 0 : 10;
  
  // Calculate tax (13% tax rate)
  const taxRate = 0.13;
  const taxAmount = typeof cartTotal === 'number' ? cartTotal * taxRate : 0;
  
  // Calculate order total - ensure it's a valid number
  const orderTotal = (typeof cartTotal === 'number' ? cartTotal : 0) + 
                     (typeof shippingCost === 'number' ? shippingCost : 0) + 
                     (typeof taxAmount === 'number' ? taxAmount : 0);

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';
    if (!formData.country.trim()) errors.country = 'Country is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setOrderProcessing(true);
        
        // Prepare order items with type checking for price
        const orderItems = cartItems.map(item => {
          // Ensure price is a valid number, defaulting to 0 if not
          const price = typeof item.price === 'number' ? item.price : 0;
          return {
            productId: item.productId,
            quantity: typeof item.quantity === 'number' ? item.quantity : 1,
            price: price,
            size: item.size || null,
            color: item.color || null
          };
        });
        
        // Create order
        const orderData = {
          orderItems,
          shippingAddress: formData.address,
          shippingCity: formData.city,
          shippingPostalCode: formData.postalCode,
          shippingCountry: formData.country,
          paymentMethod: formData.paymentMethod,
          totalAmount: orderTotal
        };
        
        const order = await createOrder(orderData);
        
        // Process payment based on selected method
        if (formData.paymentMethod === 'eSewa') {
          // Generate eSewa payment URL and parameters
          const paymentData = await processEsewaPayment(
            order.id,
            orderTotal,
            `SneakerHead Order #${order.id}`
          );
          
          // Store order ID in localStorage for verification after payment
          localStorage.setItem('currentOrderId', order.id);
          
          // Redirect to eSewa payment page
          const form = document.createElement('form');
          form.setAttribute('method', 'POST');
          form.setAttribute('action', paymentData.paymentUrl);
          
          // Add parameters to form
          for (const key in paymentData.params) {
            const hiddenField = document.createElement('input');
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', paymentData.params[key]);
            form.appendChild(hiddenField);
          }
          
          document.body.appendChild(form);
          form.submit();
        } else {
          // For other payment methods (COD, etc.)
          navigate(`/order/${order.id}`);
        }
      } catch (err) {
        console.error('Error processing order:', err);
        setOrderProcessing(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your full name"
              />
              {formErrors.fullName && <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your email"
              />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your phone number"
              />
              {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
            </div>
            
            <div>
              <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your address"
              />
              {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
            </div>
            
            <div>
              <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your city"
              />
              {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
            </div>
            
            <div>
              <label htmlFor="postalCode" className="block text-gray-700 font-medium mb-2">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your postal code"
              />
              {formErrors.postalCode && <p className="text-red-500 text-sm mt-1">{formErrors.postalCode}</p>}
            </div>
            
            <div>
              <label htmlFor="country" className="block text-gray-700 font-medium mb-2">Country</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.country ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="Nepal">Nepal</option>
                <option value="India">India</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Bhutan">Bhutan</option>
                <option value="Sri Lanka">Sri Lanka</option>
              </select>
              {formErrors.country && <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>}
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Payment Method</h3>
          
          <div className="space-y-3">
            <label className="flex items-center p-4 border rounded-md cursor-pointer transition duration-300 hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="eSewa"
                checked={formData.paymentMethod === 'eSewa'}
                onChange={handleChange}
                className="mr-3"
              />
              <div className="flex items-center">
                <span className="text-purple-700 font-semibold mr-2">eSewa</span>
                <span className="text-sm text-gray-600">- Pay securely with eSewa</span>
              </div>
            </label>
            
            <label className="flex items-center p-4 border rounded-md cursor-pointer transition duration-300 hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={formData.paymentMethod === 'COD'}
                onChange={handleChange}
                className="mr-3"
              />
              <div className="flex items-center">
                <span className="font-semibold mr-2">Cash on Delivery</span>
                <span className="text-sm text-gray-600">- Pay when you receive your order</span>
              </div>
            </label>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Order Summary</h3>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="space-y-2 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex items-center">
                    <span className="font-medium">{item.quantity} x</span>
                    <span className="ml-2">{item.Product.name}</span>
                    {item.size && <span className="text-sm text-gray-600 ml-2">(Size: {item.size})</span>}
                    {item.color && <span className="text-sm text-gray-600 ml-1">(Color: {item.color})</span>}
                  </div>
                  <span>${typeof item.price === 'number' && typeof item.quantity === 'number' ? (item.price * item.quantity).toFixed(2) : '0.00'}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${typeof cartTotal === 'number' ? cartTotal.toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                {shippingCost === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span>${typeof shippingCost === 'number' ? shippingCost.toFixed(2) : '0.00'}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>Tax (13%):</span>
                <span>${typeof taxAmount === 'number' ? taxAmount.toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span>${typeof orderTotal === 'number' ? orderTotal.toFixed(2) : '0.00'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading || orderProcessing || cartItems.length === 0}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading || orderProcessing ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-spinner fa-spin mr-2"></i> Processing Order...
            </span>
          ) : (
            `Place Order - $${orderTotal.toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
