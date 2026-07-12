const router = require('express').Router();
const Review = require('../models/review.model');
const Product = require('../models/product.model');

// GET reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('customer', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET reviews by customer
router.get('/my/:customerId', async (req, res) => {
  try {
    const reviews = await Review.find({ customer: req.params.customerId })
      .populate('product', 'name imageUrl')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST submit a review
router.post('/', async (req, res) => {
  try {
    const { product, customer, order, rating, comment } = req.body;

    // check if already reviewed
    const existing = await Review.findOne({ product, customer, order });
    if (existing) {
      return res.status(409).json({ error: 'You have already reviewed this product for this order.' });
    }

    const review = new Review({ product, customer, order, rating, comment });
    await review.save();

    // update product's average rating
    const all = await Review.find({ product });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await Product.findByIdAndUpdate(product, { rating: Math.round(avg * 10) / 10 });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE remove a review
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;