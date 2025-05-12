const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user.model');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shippingCity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingPostalCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingCountry: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'eSewa'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  orderStatus: {
    type: DataTypes.ENUM('processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'processing'
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

// Establish relationship
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Order;
