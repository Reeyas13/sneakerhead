import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PaymentFailurePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const orderId = localStorage.getItem('currentOrderId');

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Scroll to top
    window.scrollTo(0, 0);
    
    // Clear the stored order ID
    localStorage.removeItem('currentOrderId');
  }, [navigate, isAuthenticated]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-red-500 mb-4">
          <i className="fas fa-times-circle text-5xl"></i>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-6">Your payment could not be processed. Please try again or choose a different payment method.</p>
        <div className="flex flex-col space-y-3">
          {orderId && (
            <Link 
              to={`/order/${orderId}`} 
              className="bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition duration-300"
            >
              Try Again
            </Link>
          )}
          <Link 
            to="/cart" 
            className="bg-gray-800 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition duration-300"
          >
            Return to Cart
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
};

export default PaymentFailurePage;
