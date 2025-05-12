const express = require('express');
const router = express.Router();
const { Cart, Product } = require('../models');
const { authenticateToken } = require('../middleware/auth.middleware');

// Get cart items for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'discountPrice', 'imageUrl', 'brand', 'countInStock']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;
    
    // Check if product exists
    const product = await Product.findByPk(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if product is in stock
    if (product.countInStock < quantity) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }
    
    // Check if item already exists in cart
    const existingCartItem = await Cart.findOne({
      where: {
        userId: req.user.id,
        productId,
        size,
        color
      }
    });
    
    if (existingCartItem) {
      // Update quantity
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      
      // Fetch updated cart item with product details
      const updatedCartItem = await Cart.findByPk(existingCartItem.id, {
        include: [{
          model: Product,
          attributes: ['id', 'name', 'price', 'discountPrice', 'imageUrl', 'brand', 'countInStock']
        }]
      });
      
      return res.json(updatedCartItem);
    }
    
    // Create new cart item
    const cartItem = await Cart.create({
      userId: req.user.id,
      productId,
      quantity,
      size,
      color
    });
    
    // Fetch created cart item with product details
    const createdCartItem = await Cart.findByPk(cartItem.id, {
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'discountPrice', 'imageUrl', 'brand', 'countInStock']
      }]
    });
    
    res.status(201).json(createdCartItem);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update cart item quantity
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    // Find cart item
    const cartItem = await Cart.findByPk(req.params.id);
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    // Check if user owns this cart item
    if (cartItem.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Check if product is in stock
    const product = await Product.findByPk(cartItem.productId);
    
    if (product.countInStock < quantity) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }
    
    // Update quantity
    cartItem.quantity = quantity;
    await cartItem.save();
    
    // Fetch updated cart item with product details
    const updatedCartItem = await Cart.findByPk(cartItem.id, {
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'discountPrice', 'imageUrl', 'brand', 'countInStock']
      }]
    });
    
    res.json(updatedCartItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(400).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Find cart item
    const cartItem = await Cart.findByPk(req.params.id);
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    // Check if user owns this cart item
    if (cartItem.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Delete cart item
    await cartItem.destroy();
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.delete('/', authenticateToken, async (req, res) => {
  try {
    // Delete all cart items for this user
    await Cart.destroy({
      where: { userId: req.user.id }
    });
    
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
