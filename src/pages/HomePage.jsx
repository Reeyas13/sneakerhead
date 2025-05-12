import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';

const HomePage = () => {
  const { 
    featuredProducts, 
    newArrivals,
    fetchFeaturedProducts, 
    fetchNewArrivals, 
    loading 
  } = useProducts();

  useEffect(() => {
    // Fetch featured products and new arrivals
    fetchFeaturedProducts();
    fetchNewArrivals();
  }, [fetchFeaturedProducts, fetchNewArrivals]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}></div>
        
        <div className="container mx-auto px-4 py-32 relative z-20">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Step Into Style with SneakerHead</h1>
            <p className="text-lg mb-8">Discover the latest and greatest in sneaker fashion. Premium quality, authentic products, and unbeatable prices.</p>
            <div className="flex space-x-4">
              <Link to="/products" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition duration-300">
                Shop Now
              </Link>
              <Link to="/products?newArrival=true" className="bg-transparent hover:bg-white hover:text-gray-900 text-white px-6 py-3 rounded-md font-medium border border-white transition duration-300">
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition duration-300">
              <img src="/images/category-running.jpg" alt="Running Shoes" className="w-full h-64 object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Running Shoes</h3>
                  <Link to="/products?category=Running" className="text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded inline-block transition duration-300">
                    Shop Collection
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition duration-300">
              <img src="/images/category-basketball.jpg" alt="Basketball Shoes" className="w-full h-64 object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Basketball Shoes</h3>
                  <Link to="/products?category=Basketball" className="text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded inline-block transition duration-300">
                    Shop Collection
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition duration-300">
              <img src="/images/category-casual.jpg" alt="Casual Sneakers" className="w-full h-64 object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Casual Sneakers</h3>
                  <Link to="/products?category=Casual" className="text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded inline-block transition duration-300">
                    Shop Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products?featured=true" className="text-primary-600 hover:text-primary-800 font-medium">
              View All <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>
          
          {loading && featuredProducts.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Get 20% Off Your First Purchase</h2>
              <p className="text-lg mb-6">Sign up for our newsletter and receive a coupon for 20% off your first order.</p>
              <form className="flex max-w-md">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-2 rounded-l text-gray-900 focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="bg-gray-900 hover:bg-gray-800 px-6 py-2 rounded-r font-medium transition duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
            <div className="md:w-1/3">
              <img 
                src="/images/discount-banner.png" 
                alt="Discount Offer" 
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Link to="/products?newArrival=true" className="text-primary-600 hover:text-primary-800 font-medium">
              View All <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>
          
          {loading && newArrivals.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newArrivals.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Top Brands</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <Link to="/products?brand=Nike" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center">
              <img src="/images/brands/nike.png" alt="Nike" className="h-12 object-contain" />
            </Link>
            <Link to="/products?brand=Adidas" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center">
              <img src="/images/brands/adidas.png" alt="Adidas" className="h-12 object-contain" />
            </Link>
            <Link to="/products?brand=Jordan" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center">
              <img src="/images/brands/jordan.png" alt="Jordan" className="h-12 object-contain" />
            </Link>
            <Link to="/products?brand=Puma" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center">
              <img src="/images/brands/puma.png" alt="Puma" className="h-12 object-contain" />
            </Link>
            <Link to="/products?brand=New Balance" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center">
              <img src="/images/brands/new-balance.png" alt="New Balance" className="h-12 object-contain" />
            </Link>
            <Link to="/products?brand=Converse" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center">
              <img src="/images/brands/converse.png" alt="Converse" className="h-12 object-contain" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="flex text-yellow-400 mb-4">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="text-gray-700 mb-4">"The quality of the sneakers I received was exceptional. The customer service was top-notch, and delivery was faster than expected. Highly recommend!"</p>
              <div className="flex items-center">
                <img src="/images/testimonials/user1.jpg" alt="Customer" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold">Rajesh Sharma</h4>
                  <p className="text-gray-600 text-sm">Loyal Customer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="flex text-yellow-400 mb-4">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="text-gray-700 mb-4">"I've been buying sneakers from SneakerHead for over a year now. Their collection is always up-to-date with the latest trends, and the prices are very competitive."</p>
              <div className="flex items-center">
                <img src="/images/testimonials/user2.jpg" alt="Customer" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold">Priya Patel</h4>
                  <p className="text-gray-600 text-sm">Sneaker Enthusiast</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="flex text-yellow-400 mb-4">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
              <p className="text-gray-700 mb-4">"The eSewa payment integration makes checkout so convenient. I love how easy it is to browse and find exactly what I'm looking for. Great selection of brands too!"</p>
              <div className="flex items-center">
                <img src="/images/testimonials/user3.jpg" alt="Customer" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold">Anish Thapa</h4>
                  <p className="text-gray-600 text-sm">Regular Shopper</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
