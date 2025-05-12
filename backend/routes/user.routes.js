const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Order, OrderItem, Product } = require('../models');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName, address, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [sequelize.Op.or]: [{ email }, { username }] 
      } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      fullName,
      address,
      phone
    });
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'sneakerhead_secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'sneakerhead_secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user fields
    const { username, email, fullName, address, phone, password } = req.body;
    
    if (username) user.username = username;
    if (email) user.email = email;
    if (fullName) user.fullName = fullName;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    if (password) user.password = password;
    
    await user.save();
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      address: user.address,
      phone: user.phone,
      role: user.role
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product
        }]
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all users (Admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
