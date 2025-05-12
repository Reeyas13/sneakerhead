import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { fetchProductById, fetchRecommendations, product, recommendations, loading, error } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      await fetchProductById(id);
      await fetchRecommendations(id);
    };
    
    loadProduct();
  }, [id, fetchProductById, fetchRecommendations]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.imageUrl);
      
      // Set default size and color if available
      const sizes = product.sizes ? JSON.parse(product.sizes) : [];
      const colors = product.colors ? JSON.parse(product.colors) : [];
      
      if (sizes.length > 0) setSelectedSize(sizes[0]);
      if (colors.length > 0) setSelectedColor(colors[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedSize, selectedColor);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.countInStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center py-10">
          <div className="text-red-500 mb-4"><i className="fas fa-exclamation-circle text-xl"></i></div>
          <h3 className="text-lg font-semibold mb-2">Error Loading Product</h3>
          <p className="text-gray-600">{error}</p>
          <Link to="/products" className="mt-4 inline-block bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition duration-300">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center py-10">
          <div className="text-gray-400 mb-4"><i className="fas fa-search text-5xl"></i></div>
          <h3 className="text-xl font-semibold mb-2">Product Not Found</h3>
          <Link to="/products" className="mt-4 inline-block bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition duration-300">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Parse sizes and colors
  const sizes = product.sizes ? JSON.parse(product.sizes) : [];
  const colors = product.colors ? JSON.parse(product.colors) : [];

  // Calculate discount percentage
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <Link to="/" className="text-gray-500 hover:text-primary-600">Home</Link>
        <span className="mx-2 text-gray-500">/</span>
        <Link to="/products" className="text-gray-500 hover:text-primary-600">Products</Link>
        <span className="mx-2 text-gray-500">/</span>
        <Link to={`/products?category=${product.category}`} className="text-gray-500 hover:text-primary-600">{product.category}</Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-auto object-contain aspect-square"
            />
          </div>
          
          {/* Badges */}
          <div className="flex gap-2 mb-4">
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                NEW
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <i 
                  key={i} 
                  className={`fas fa-star ${i < Math.floor(product.rating) ? '' : 'text-gray-300'}`}
                ></i>
              ))}
            </div>
            <span className="text-gray-600">{product.rating} ({product.numReviews} reviews)</span>
          </div>
          
          <div className="mb-6">
            {product.discountPrice ? (
              <div className="flex items-center">
                <span className="text-3xl font-bold text-primary-600">
                  ${typeof product.discountPrice === 'number' ? product.discountPrice.toFixed(2) : '0.00'}
                </span>
                <span className="text-xl text-gray-500 line-through ml-3">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                </span>
                <span className="ml-3 bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                  Save ${typeof product.price === 'number' && typeof product.discountPrice === 'number' ? (product.price - product.discountPrice).toFixed(2) : '0.00'}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-primary-600">
                ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
              </span>
            )}
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-gray-700 font-medium w-24">Brand:</span>
              <span className="text-gray-600">{product.brand}</span>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-gray-700 font-medium w-24">Category:</span>
              <span className="text-gray-600">{product.category}</span>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-gray-700 font-medium w-24">Availability:</span>
              {product.countInStock > 0 ? (
                <span className="text-green-600">{product.countInStock} in stock</span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </div>
          </div>
          
          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-gray-700 font-medium mb-2">Size:</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 border rounded-md ${selectedSize === size ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Colors */}
          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-gray-700 font-medium mb-2">Color:</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 border rounded-md ${selectedColor === color ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-gray-700 font-medium mb-2">Quantity:</h3>
            <div className="flex items-center">
              <button 
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="px-3 py-1 border border-gray-300 rounded-l-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-minus"></i>
              </button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.countInStock))}
                className="w-16 text-center border-t border-b border-gray-300 py-1 text-gray-700"
                min="1"
                max={product.countInStock}
              />
              <button 
                onClick={incrementQuantity}
                disabled={quantity >= product.countInStock}
                className="px-3 py-1 border border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <div className="mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className={`w-full py-3 px-6 rounded-md font-medium ${product.countInStock > 0 ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} transition duration-300`}
            >
              {product.countInStock > 0 ? (
                <><i className="fas fa-shopping-cart mr-2"></i> Add to Cart</>
              ) : (
                <><i className="fas fa-ban mr-2"></i> Out of Stock</>
              )}
            </button>
          </div>
          
          {/* Social Share */}
          <div className="flex items-center">
            <span className="text-gray-700 mr-4">Share:</span>
            <div className="flex space-x-2">
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-400">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-pink-600">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-red-600">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Product Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.slice(0, 4).map(rec => (
              <div key={rec.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Link to={`/product/${rec.id}`} className="block">
                  <img 
                    src={rec.imageUrl} 
                    alt={rec.name} 
                    className="w-full h-64 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="text-gray-700 font-semibold">
                    <Link to={`/product/${rec.id}`} className="hover:text-primary-600 transition-colors duration-300">
                      {rec.name}
                    </Link>
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-primary-600 font-bold">
                      ${typeof rec.discountPrice === 'number' ? rec.discountPrice.toFixed(2) : typeof rec.price === 'number' ? rec.price.toFixed(2) : '0.00'}
                    </span>
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star ${i < Math.floor(rec.rating) ? '' : 'text-gray-300'}`}
                        ></i>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
