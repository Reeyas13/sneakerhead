import { useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AccountPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=account');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null; // Don't render anything while redirecting
  }

  // Check which tab is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold">
                {user.fullName.charAt(0)}
              </div>
              <div className="ml-4">
                <h2 className="font-semibold text-lg">{user.fullName}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <Link 
                to="/account" 
                className={`block px-4 py-2 rounded-md ${isActive('/account') && location.pathname === '/account' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <i className="fas fa-user-circle mr-2"></i> Profile
              </Link>
              <Link 
                to="/account/orders" 
                className={`block px-4 py-2 rounded-md ${isActive('/account/orders') ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <i className="fas fa-shopping-bag mr-2"></i> Orders
              </Link>
              <Link 
                to="/account/addresses" 
                className={`block px-4 py-2 rounded-md ${isActive('/account/addresses') ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <i className="fas fa-map-marker-alt mr-2"></i> Addresses
              </Link>
              <Link 
                to="/account/password" 
                className={`block px-4 py-2 rounded-md ${isActive('/account/password') ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <i className="fas fa-lock mr-2"></i> Change Password
              </Link>
              <button 
                onClick={logout} 
                className="w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <i className="fas fa-sign-out-alt mr-2"></i> Logout
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:w-3/4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
