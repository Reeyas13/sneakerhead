import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-red-500">Sneaker<span className="text-gray-800">Head</span></span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-gray-700 hover:text-red-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-300">
                Home
              </Link>
              <Link to="/products" className="border-transparent text-gray-700 hover:text-red-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-300">
                Products
              </Link>
              <Link to="/about" className="border-transparent text-gray-700 hover:text-red-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-300">
                About
              </Link>
              <Link to="/contact" className="border-transparent text-gray-700 hover:text-red-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-300">
                Contact
              </Link>
            </div>
          </div>
          
          {/* Right side buttons */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {/* Search */}
            <button className="p-1 rounded-full text-gray-600 hover:text-red-500 transition-colors duration-300">
              <i className="fas fa-search text-xl"></i>
            </button>
            
            {/* Cart */}
            <Link to="/cart" className="p-1 rounded-full text-gray-600 hover:text-red-500 transition-colors duration-300 relative">
              <i className="fas fa-shopping-cart text-xl"></i>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {/* Profile dropdown */}
            {user ? (
              <div className="relative">
                <div>
                  <button onClick={toggleProfile} className="flex text-sm rounded-full focus:outline-none">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </button>
                </div>
                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-200">
                      Signed in as <span className="font-medium text-gray-900">{user.username}</span>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="btn-outline py-1 px-3 text-sm">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary py-1 px-3 text-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-500 hover:bg-gray-100 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <i className="fas fa-times text-xl"></i>
              ) : (
                <i className="fas fa-bars text-xl"></i>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-red-500 hover:text-red-500">
              Home
            </Link>
            <Link to="/products" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-red-500 hover:text-red-500">
              Products
            </Link>
            <Link to="/about" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-red-500 hover:text-red-500">
              About
            </Link>
            <Link to="/contact" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-red-500 hover:text-red-500">
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center text-white">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.fullName}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link to="/profile" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                    Your Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-4 py-2">
                <Link to="/login" className="btn-outline w-full text-center">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary w-full text-center">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
