const express = require('express');
const router = express.Router();
const { Product, Review } = require('../models');
const { Op } = require('sequelize');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Get all products with optional filtering
router.get('/', async (req, res) => {
  try {
    const { 
      category, brand, search, minPrice, maxPrice, 
      featured, newArrival, sort, page = 1, limit = 10 
    } = req.query;
    
    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (search) filter.name = { [Op.like]: `%${search}%` };
    if (minPrice && maxPrice) {
      filter.price = { [Op.between]: [minPrice, maxPrice] };
    } else if (minPrice) {
      filter.price = { [Op.gte]: minPrice };
    } else if (maxPrice) {
      filter.price = { [Op.lte]: maxPrice };
    }
    if (featured === 'true') filter.isFeatured = true;
    if (newArrival === 'true') filter.isNew = true;
    
    // Build sort options
    let order = [];
    if (sort) {
      switch (sort) {
        case 'price-asc':
          order = [['price', 'ASC']];
          break;
        case 'price-desc':
          order = [['price', 'DESC']];
          break;
        case 'newest':
          order = [['createdAt', 'DESC']];
          break;
        case 'rating':
          order = [['rating', 'DESC']];
          break;
        default:
          order = [['createdAt', 'DESC']];
      }
    } else {
      order = [['createdAt', 'DESC']];
    }
    
    // Pagination
    const offset = (page - 1) * limit;
    
    // Execute query
    const { count, rows: products } = await Product.findAndCountAll({
      where: filter,
      order,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: Review, as: 'reviews' }]
    });
    
    res.json({
      products,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Review, as: 'reviews' }]
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recommended products based on a product
router.get('/:id/recommendations', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Find similar products based on category and brand
    const recommendations = await Product.findAll({
      where: {
        id: { [Op.ne]: product.id },
        [Op.or]: [
          { category: product.category },
          { brand: product.brand }
        ]
      },
      limit: 8,
      order: [['rating', 'DESC']]
    });
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new product (Admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a product (Admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a product (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.destroy();
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
