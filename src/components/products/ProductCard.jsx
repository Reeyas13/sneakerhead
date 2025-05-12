import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  // Calculate discount percentage
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-64 object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
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
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-gray-700 font-semibold text-lg truncate">
            <Link to={`/product/${product.id}`} className="hover:text-primary-600 transition-colors duration-300">
              {product.name}
            </Link>
          </h3>
          <span className="text-sm font-medium text-gray-600">{product.brand}</span>
        </div>
        
        <div className="text-sm text-gray-500 mb-2">{product.category}</div>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <i 
                key={i} 
                className={`fas fa-star ${i < Math.floor(product.rating) ? '' : 'text-gray-300'}`}
              ></i>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.numReviews})</span>
        </div>
        
        {/* Price */}
        <div className="flex justify-between items-center">
          <div>
            {product.discountPrice ? (
              <div className="flex items-center">
                <span className="text-lg font-bold text-primary-600">
                  ${typeof product.discountPrice === 'number' ? product.discountPrice.toFixed(2) : '0.00'}
                </span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-primary-600">
                ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
              </span>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors duration-300"
            aria-label="Add to cart"
            disabled={product.countInStock === 0}
          >
            {product.countInStock > 0 ? (
              <i className="fas fa-shopping-cart"></i>
            ) : (
              <i className="fas fa-ban"></i>
            )}
          </button>
        </div>
        
        {/* Stock Status */}
        {product.countInStock === 0 && (
          <p className="text-red-500 text-xs mt-2">Out of Stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
