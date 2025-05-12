const express = require('express');
const router = express.Router();
const { Order, OrderItem, Product, User } = require('../models');
const { sequelize } = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Create new order
router.post('/', authenticateToken, async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      orderItems,
      shippingAddress,
      shippingCity,
      shippingPostalCode,
      shippingCountry,
      paymentMethod,
      totalAmount
    } = req.body;
    
    // Create order
    const order = await Order.create({
      userId: req.user.id,
      totalAmount,
      shippingAddress,
      shippingCity,
      shippingPostalCode,
      shippingCountry,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'processing'
    }, { transaction });
    
    // Create order items
    const orderItemsPromises = orderItems.map(async (item) => {
      // Check product availability
      const product = await Product.findByPk(item.productId, { transaction });
      
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      
      if (product.countInStock < item.quantity) {
        throw new Error(`Product ${product.name} is out of stock`);
      }
      
      // Update product stock
      await product.update({
        countInStock: product.countInStock - item.quantity
      }, { transaction });
      
      // Create order item
      return OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color
      }, { transaction });
    });
    
    await Promise.all(orderItemsPromises);
    await transaction.commit();
    
    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product
        }]
      }]
    });
    
    res.status(201).json(completeOrder);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating order:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product
        }]
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'fullName']
      }]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update order to paid
router.put('/:id/pay', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update order
    order.paymentStatus = 'completed';
    order.paymentId = req.body.paymentId;
    
    await order.save();
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order payment:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update order status (Admin only)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update order status
    order.orderStatus = req.body.status;
    
    if (req.body.status === 'delivered') {
      order.deliveredAt = new Date();
    }
    
    await order.save();
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (Admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    
    const orders = await Order.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'fullName']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
