import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-primary-700 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-sm">
            <span className="mr-4"><i className="fas fa-phone mr-2"></i>+977 9812345678</span>
            <span><i className="fas fa-envelope mr-2"></i>info@sneakerhead.com</span>
          </div>
          <div className="text-sm">
            {isAuthenticated ? (
              <div className="flex items-center">
                <Link to="/account" className="hover:text-primary-200 mr-4">
                  <i className="fas fa-user mr-1"></i> {user.fullName}
                </Link>
                <button 
                  onClick={logout} 
                  className="hover:text-primary-200"
                >
                  <i className="fas fa-sign-out-alt mr-1"></i> Logout
                </button>
              </div>
            ) : (
              <div>
                <Link to="/login" className="hover:text-primary-200 mr-4">
                  <i className="fas fa-sign-in-alt mr-1"></i> Login
                </Link>
                <Link to="/register" className="hover:text-primary-200">
                  <i className="fas fa-user-plus mr-1"></i> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/" className="text-2xl font-bold text-primary-700">
              <span className="flex items-center">
                <i className="fas fa-shoe-prints text-3xl mr-2"></i>
                SneakerHead
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-2/5 mb-4 md:mb-0">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search for sneakers..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-primary-600 text-white px-4 py-2 rounded-r hover:bg-primary-700 transition duration-300"
              >
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>

          {/* Cart and Mobile Menu Button */}
          <div className="flex items-center">
            <Link to="/cart" className="relative mr-6">
              <i className="fas fa-shopping-cart text-2xl text-gray-700 hover:text-primary-600 transition duration-300"></i>
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Link>
            <button 
              className="md:hidden text-gray-700 focus:outline-none" 
              onClick={toggleMenu}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`bg-gray-100 py-3 ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
        <div className="container mx-auto px-4">
          <ul className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-8">
            <li>
              <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">
                All Sneakers
              </Link>
            </li>
            <li>
              <Link to="/products?category=Running" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">
                Running
              </Link>
            </li>
            <li>
              <Link to="/products?category=Basketball" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">
                Basketball
              </Link>
            </li>
            <li>
              <Link to="/products?category=Casual" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">
                Casual
              </Link>
            </li>
            <li>
              <Link to="/products?newArrival=true" className="text-gray-700 hover:text-primary-600 font-medium transition duration-300">
                New Arrivals
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li>
                <Link to="/admin" className="text-primary-700 hover:text-primary-800 font-medium transition duration-300">
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
