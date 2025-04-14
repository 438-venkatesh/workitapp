const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: 'your_razorpay_key_id',
  key_secret: 'your_razorpay_key_secret'
});

// Create order
router.post('/create-order', async (req, res) => {
  const { workId, amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${workId}`,
      payment_capture: 1 // auto capture payment
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  const { orderId, paymentId, signature, workId } = req.body;
  
  try {
    // Create expected signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    // Verify signature
    if (expectedSignature === signature) {
      // Payment is successful, update your database
      // Example: Update work status to paid
      // await Work.findByIdAndUpdate(workId, { status: 'paid' });
      
      res.json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

module.exports = router;