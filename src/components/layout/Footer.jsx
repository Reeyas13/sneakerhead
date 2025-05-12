import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">SneakerHead</h3>
            <p className="text-gray-400 mb-4">
              Your premier destination for authentic, high-quality sneakers. We offer the latest styles from top brands at competitive prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition duration-300">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/products?newArrival=true" className="text-gray-400 hover:text-white transition duration-300">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/products?featured=true" className="text-gray-400 hover:text-white transition duration-300">
                  Featured Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=Running" className="text-gray-400 hover:text-white transition duration-300">
                  Running Shoes
                </Link>
              </li>
              <li>
                <Link to="/products?category=Basketball" className="text-gray-400 hover:text-white transition duration-300">
                  Basketball Shoes
                </Link>
              </li>
              <li>
                <Link to="/products?category=Casual" className="text-gray-400 hover:text-white transition duration-300">
                  Casual Sneakers
                </Link>
              </li>
              <li>
                <Link to="/products?category=Skate" className="text-gray-400 hover:text-white transition duration-300">
                  Skate Shoes
                </Link>
              </li>
              <li>
                <Link to="/products?brand=Nike" className="text-gray-400 hover:text-white transition duration-300">
                  Nike
                </Link>
              </li>
              <li>
                <Link to="/products?brand=Adidas" className="text-gray-400 hover:text-white transition duration-300">
                  Adidas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3"></i>
                <span>123 Sneaker Street, Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3"></i>
                <span>+977 9812345678</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3"></i>
                <span>info@sneakerhead.com</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-clock mr-3"></i>
                <span>Mon-Sat: 10:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">
                &copy; {currentYear} SneakerHead. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Payment Methods:</span>
              <div className="flex space-x-2">
                <i className="fab fa-cc-visa text-2xl text-gray-400"></i>
                <i className="fab fa-cc-mastercard text-2xl text-gray-400"></i>
                <i className="fab fa-cc-paypal text-2xl text-gray-400"></i>
                <span className="text-gray-400 font-semibold">eSewa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
