import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

const PaymentSuccessPage = () => {
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEsewaPayment } = useOrders();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Scroll to top
    window.scrollTo(0, 0);
    
    // Get payment details from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const oid = queryParams.get('oid');
    const amt = queryParams.get('amt');
    const refId = queryParams.get('refId');
    
    // Get order ID from localStorage
    const storedOrderId = localStorage.getItem('currentOrderId');
    setOrderId(storedOrderId);
    
    // Verify payment if all required parameters are present
    const verifyPayment = async () => {
      if (oid && amt && refId) {
        try {
          const result = await verifyEsewaPayment({ oid, amt, refId });
          setSuccess(result.success);
        } catch (err) {
          console.error('Payment verification error:', err);
          setError('Failed to verify payment. Please contact customer support.');
        } finally {
          setVerifying(false);
          // Clear the stored order ID
          localStorage.removeItem('currentOrderId');
        }
      } else {
        setError('Missing payment information. Please contact customer support.');
        setVerifying(false);
      }
    };
    
    verifyPayment();
  }, [location.search, verifyEsewaPayment, navigate, isAuthenticated]);

  if (verifying) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 mb-4">
            <i className="fas fa-times-circle text-5xl"></i>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col space-y-3">
            <Link 
              to={orderId ? `/order/${orderId}` : '/account/orders'} 
              className="bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition duration-300"
            >
              View Order
            </Link>
            <Link 
              to="/" 
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-green-500 mb-4">
          <i className="fas fa-check-circle text-5xl"></i>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">Your payment has been processed successfully. Thank you for your order!</p>
        <div className="flex flex-col space-y-3">
          <Link 
            to={orderId ? `/order/${orderId}` : '/account/orders'} 
            className="bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition duration-300"
          >
            View Order
          </Link>
          <Link 
            to="/products" 
            className="text-primary-600 hover:text-primary-800 font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
