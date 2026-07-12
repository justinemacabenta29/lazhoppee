const router = require('express').Router();
const Cart = require('../models/cart.model');

router.get('/', async (req, res) => {
  try {
    const items = await Cart.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // Reject items with no store — this is what was silently causing checkout failures
    if (!req.body.store) {
      return res.status(400).json({
        error: 'This product is missing store information and cannot be added to cart. Please contact the seller or try a different product.'
      });
    }

    const existing = await Cart.findOne({ productId: req.body.productId });
    if (existing) {
      existing.qty += 1;
      await existing.save();
      return res.json(existing);
    }

    // Enforce single-store cart: block adding an item from a different store
    const otherStoreItem = await Cart.findOne({ store: { $ne: req.body.store } });
    if (otherStoreItem) {
      return res.status(409).json({
        error: 'Your cart already has items from a different store. Please checkout or clear your cart before adding items from another store.'
      });
    }

    const item = new Cart(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    await Cart.deleteMany({});
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const item = await Cart.findByIdAndUpdate(
      req.params.id,
      { qty: req.body.qty },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;