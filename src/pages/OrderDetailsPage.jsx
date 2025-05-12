import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { currentOrder, fetchOrderById, loading, error, processEsewaPayment } = useOrders();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Scroll to top
    window.scrollTo(0, 0);
    
    // Fetch order details
    fetchOrderById(id);
  }, [id, fetchOrderById, navigate, isAuthenticated]);

  const handlePayNow = async () => {
    try {
      // Store order ID in localStorage for verification after payment
      localStorage.setItem('currentOrderId', currentOrder.id);
      
      // Process eSewa payment
      const paymentData = await processEsewaPayment(
        currentOrder.id,
        currentOrder.totalAmount,
        `SneakerHead Order #${currentOrder.id}`
      );
      
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
    } catch (err) {
      console.error('Error processing payment:', err);
    }
  };

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
          <h3 className="text-lg font-semibold mb-2">Error Loading Order</h3>
          <p className="text-gray-600">{error}</p>
          <Link to="/account/orders" className="mt-4 inline-block bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition duration-300">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <div className="text-gray-400 mb-4"><i className="fas fa-search text-5xl"></i></div>
          <h3 className="text-xl font-semibold mb-2">Order Not Found</h3>
          <Link to="/account/orders" className="mt-4 inline-block bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition duration-300">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // Format date
  const orderDate = new Date(currentOrder.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/account/orders" className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Orders
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order #{currentOrder.id}</h1>
        <div className="text-sm text-gray-600">
          Placed on {orderDate}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Status</h2>
            
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentOrder.orderStatus !== 'cancelled' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  <i className={`fas ${currentOrder.orderStatus !== 'cancelled' ? 'fa-check' : 'fa-times'}`}></i>
                </div>
                <div className="absolute top-0 -ml-2 text-center w-16">
                  <div className="text-xs font-semibold mt-4">Ordered</div>
                </div>
              </div>
              
              <div className={`flex-grow h-1 mx-2 ${currentOrder.orderStatus === 'processing' || currentOrder.orderStatus === 'cancelled' ? 'bg-gray-300' : 'bg-green-500'}`}></div>
              
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentOrder.orderStatus === 'processing' || currentOrder.orderStatus === 'cancelled' ? 'bg-gray-300 text-gray-500' : 'bg-green-500 text-white'}`}>
                  {currentOrder.orderStatus !== 'processing' && currentOrder.orderStatus !== 'cancelled' ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <i className="fas fa-box"></i>
                  )}
                </div>
                <div className="absolute top-0 -ml-2 text-center w-16">
                  <div className="text-xs font-semibold mt-4">Shipped</div>
                </div>
              </div>
              
              <div className={`flex-grow h-1 mx-2 ${currentOrder.orderStatus === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentOrder.orderStatus === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                  {currentOrder.orderStatus === 'delivered' ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <i className="fas fa-home"></i>
                  )}
                </div>
                <div className="absolute top-0 -ml-2 text-center w-16">
                  <div className="text-xs font-semibold mt-4">Delivered</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Current Status: </span>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  currentOrder.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                  currentOrder.orderStatus === 'shipped' ? 'bg-yellow-100 text-yellow-800' :
                  currentOrder.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentOrder.orderStatus.charAt(0).toUpperCase() + currentOrder.orderStatus.slice(1)}
                </span>
              </div>
              
              <div>
                <span className="font-medium">Payment Status: </span>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  currentOrder.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  currentOrder.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentOrder.paymentStatus.charAt(0).toUpperCase() + currentOrder.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
            
            {currentOrder.paymentStatus === 'pending' && (
              <div className="mt-6">
                <button
                  onClick={handlePayNow}
                  className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition duration-300"
                >
                  Pay Now with eSewa
                </button>
              </div>
            )}
          </div>
          
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            
            <div className="divide-y divide-gray-200">
              {currentOrder.items && currentOrder.items.map(item => (
                <div key={item.id} className="py-4 flex">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src={item.Product.imageUrl} 
                      alt={item.Product.name} 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  
                  <div className="ml-4 flex-grow">
                    <h3 className="text-lg font-medium">
                      <Link to={`/product/${item.Product.id}`} className="hover:text-primary-600">
                        {item.Product.name}
                      </Link>
                    </h3>
                    
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="mr-4">Quantity: {item.quantity}</span>
                      {item.size && <span className="mr-4">Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    <div className="text-sm text-gray-600">${item.price.toFixed(2)} each</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>${(currentOrder.totalAmount * 0.85).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span>${(currentOrder.totalAmount * 0.02).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (13%):</span>
                <span>${(currentOrder.totalAmount * 0.13).toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${parseFloat(currentOrder.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium block">Address:</span>
                <span className="text-gray-600">{currentOrder.shippingAddress}</span>
              </div>
              
              <div>
                <span className="font-medium block">City:</span>
                <span className="text-gray-600">{currentOrder.shippingCity}</span>
              </div>
              
              <div>
                <span className="font-medium block">Postal Code:</span>
                <span className="text-gray-600">{currentOrder.shippingPostalCode}</span>
              </div>
              
              <div>
                <span className="font-medium block">Country:</span>
                <span className="text-gray-600">{currentOrder.shippingCountry}</span>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <span className="font-medium block">Payment Method:</span>
                <span className="text-gray-600">{currentOrder.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
