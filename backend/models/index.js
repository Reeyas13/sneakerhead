const User = require('./user.model');
const Product = require('./product.model');
const Order = require('./order.model');
const OrderItem = require('./orderItem.model');
const Review = require('./review.model');
const Cart = require('./cart.model');

// Additional relationships not defined in individual models
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

// Export all models
module.exports = {
  User,
  Product,
  Order,
  OrderItem,
  Review,
  Cart
};
