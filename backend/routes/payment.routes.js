const express = require('express');
const router = express.Router();
const { Order } = require('../models');
const jwt = require('jsonwebtoken');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Generate eSewa payment URL
router.post('/esewa/create', authenticateToken, async (req, res) => {
  try {
    const { orderId, amount, productName } = req.body;
    
    // Verify order exists and belongs to user
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // eSewa parameters
    const esewaParams = {
      amt: amount,
      pdc: 0, // Delivery charge
      psc: 0, // Service charge
      txAmt: 0, // Tax amount
      tAmt: amount, // Total amount
      pid: `SNEAKERHEAD-${orderId}-${Date.now()}`, // Unique payment ID
      scd: process.env.ESEWA_MERCHANT_ID || 'EPAYTEST', // Merchant ID (use EPAYTEST for testing)
      su: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`, // Success URL
      fu: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/failure` // Failure URL
    };
    
    // For production, use https://esewa.com.np/epay/main
    const esewaUrl = 'https://uat.esewa.com.np/epay/main';
    
    res.json({
      paymentUrl: esewaUrl,
      params: esewaParams
    });
  } catch (error) {
    console.error('Error generating eSewa payment:', error);
    res.status(500).json({ message: error.message });
  }
});

// eSewa payment verification
router.post('/esewa/verify', async (req, res) => {
  try {
    const { oid, amt, refId } = req.body;
    
    // Extract orderId from oid (SNEAKERHEAD-{orderId}-{timestamp})
    const orderIdMatch = oid.match(/SNEAKERHEAD-(\d+)-\d+/);
    
    if (!orderIdMatch) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }
    
    const orderId = orderIdMatch[1];
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // For production, use https://esewa.com.np/epay/transrec
    const verifyUrl = 'https://uat.esewa.com.np/epay/transrec';
    
    // Verify with eSewa (in a real implementation, you would make an HTTP request to eSewa)
    // This is a simplified version for demonstration
    const merchantId = process.env.ESEWA_MERCHANT_ID || 'EPAYTEST';
    
    // In a real implementation, you would verify the payment with eSewa API
    // For now, we'll assume the payment is valid if refId is provided
    if (refId) {
      // Update order payment status
      order.paymentStatus = 'completed';
      order.paymentId = refId;
      await order.save();
      
      return res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error verifying eSewa payment:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
