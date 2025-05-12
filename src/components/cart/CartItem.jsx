import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateCartItemQuantity, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Get product from the item
  const product = item.Product;
  
  // Calculate item total
  const itemTotal = item.price * item.quantity;
  
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > product.countInStock) return;
    
    try {
      setIsUpdating(true);
      await updateCartItemQuantity(item.id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleRemove = async () => {
    try {
      setIsUpdating(true);
      await removeFromCart(item.id);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center py-6 border-b border-gray-200">
      {/* Product Image */}
      <div className="w-24 h-24 flex-shrink-0 mr-4 mb-4 sm:mb-0">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover rounded"
          />
        </Link>
      </div>
      
      {/* Product Details */}
      <div className="flex-grow">
        <Link 
          to={`/product/${product.id}`}
          className="text-lg font-medium text-gray-800 hover:text-primary-600 transition-colors duration-300"
        >
          {product.name}
        </Link>
        
        <div className="text-sm text-gray-600 mt-1">
          <span className="mr-4">Brand: {product.brand}</span>
          {item.size && <span className="mr-4">Size: {item.size}</span>}
          {item.color && <span>Color: {item.color}</span>}
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <button 
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
              className="px-2 py-1 border border-gray-300 rounded-l text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-minus text-xs"></i>
            </button>
            <span className="w-10 text-center border-t border-b border-gray-300 py-1">
              {isUpdating ? (
                <i className="fas fa-spinner fa-spin text-primary-600"></i>
              ) : (
                item.quantity
              )}
            </span>
            <button 
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= product.countInStock || isUpdating}
              className="px-2 py-1 border border-gray-300 rounded-r text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-plus text-xs"></i>
            </button>
          </div>
          
          <div className="text-right">
            <div className="text-primary-600 font-medium">
              ${itemTotal.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">
              ${item.price.toFixed(2)} each
            </div>
          </div>
        </div>
      </div>
      
      {/* Remove Button */}
      <button 
        onClick={handleRemove}
        disabled={isUpdating}
        className="ml-4 text-gray-500 hover:text-red-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Remove item"
      >
        <i className="fas fa-trash"></i>
      </button>
    </div>
  );
};

export default CartItem;
