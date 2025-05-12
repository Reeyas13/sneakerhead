const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discountPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  countInStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  numReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isNew: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sizes: {
    type: DataTypes.JSON,
    allowNull: true
  },
  colors: {
    type: DataTypes.JSON,
    allowNull: true
  }
});

module.exports = Product;
