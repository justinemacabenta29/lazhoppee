const router = require('express').Router();
const Order = require('../models/order.model');

router.get('/my/:customerId', async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.customerId })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update items/totalPrice of a draft order (qty changes, item removal)
router.patch('/:id/items', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { items: req.body.items, totalPrice: req.body.totalPrice },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Finalize a draft order into a real placed order
router.patch('/:id/place', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { placed: true },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;