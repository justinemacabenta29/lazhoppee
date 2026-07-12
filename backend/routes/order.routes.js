const router = require('express').Router();
const Order = require('../models/order.model');

// ── Customer's own orders ──
router.get('/my/:customerId', async (req, res) => {
  console.log('GET /orders/my/' + req.params.customerId);
  try {
    const orders = await Order.find({ customer: req.params.customerId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('ERROR in /my/:customerId', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── All orders (admin) ──
router.get('/', async (req, res) => {
  console.log('GET /orders (all)');
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('courier', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('ERROR in GET /', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Orders confirmed, waiting for a courier ──
router.get('/available', async (req, res) => {
  console.log('GET /orders/available');
  try {
    const orders = await Order.find({ placed: true, courier: null, status: 'confirmed' })
      .populate('customer', 'name')
      .sort({ createdAt: 1 });
    res.json(orders);
  } catch (err) {
    console.error('ERROR in /available', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Orders claimed by a specific courier ──
router.get('/courier/:courierId', async (req, res) => {
  console.log('GET /orders/courier/' + req.params.courierId);
  try {
    const orders = await Order.find({ courier: req.params.courierId })
      .populate('customer', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('ERROR in /courier/:courierId', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Orders belonging to a store (Store Owner dashboard) ──
router.get('/store/:storeId', async (req, res) => {
  console.log('GET /orders/store/' + req.params.storeId);
  try {
    const orders = await Order.find({ store: req.params.storeId, placed: true })
      .populate('customer', 'name')
      .populate('courier', 'name')
      .sort({ createdAt: -1 });
    console.log('  -> found', orders.length, 'orders');
    res.json(orders);
  } catch (err) {
    console.error('ERROR in /store/:storeId', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Single order (must stay AFTER the routes above) ──
router.get('/:id', async (req, res) => {
  console.log('GET /orders/:id ->', req.params.id);
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name')
      .populate('courier', 'name');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('ERROR in /:id', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Create a draft order (checkout) ──
router.post('/', async (req, res) => {
  console.log('POST /orders', req.body);
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('ERROR in POST /', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Update draft items (qty change, remove item) ──
router.patch('/:id/items', async (req, res) => {
  console.log('PATCH /orders/' + req.params.id + '/items');
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { items: req.body.items, totalPrice: req.body.totalPrice },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    console.error('ERROR in /:id/items', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Finalize draft into a real placed order ──
router.patch('/:id/place', async (req, res) => {
  console.log('PATCH /orders/' + req.params.id + '/place');
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { placed: true }, { new: true });
    res.json(order);
  } catch (err) {
    console.error('ERROR in /:id/place', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Store Owner confirms a pending order ──
router.patch('/:id/confirm', async (req, res) => {
  console.log('PATCH /orders/' + req.params.id + '/confirm');
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, status: 'pending' },
      { status: 'confirmed' },
      { new: true }
    );
    if (!order) return res.status(409).json({ error: 'Order is not in a pending state.' });
    res.json(order);
  } catch (err) {
    console.error('ERROR in /:id/confirm', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Courier claims an order ──
router.patch('/:id/assign', async (req, res) => {
  console.log('PATCH /orders/' + req.params.id + '/assign');
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, courier: null },
      { courier: req.body.courierId, status: 'in_transit' },
      { new: true }
    );
    if (!order) return res.status(409).json({ error: 'This order was already claimed by another courier.' });
    res.json(order);
  } catch (err) {
    console.error('ERROR in /:id/assign', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Customer's delivery pin ──
router.patch('/:id/delivery-location', async (req, res) => {
  console.log('PATCH /orders/' + req.params.id + '/delivery-location');
  try {
    const { lat, lng } = req.body;
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ error: 'lat and lng must be numbers.' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { deliveryLat: lat, deliveryLng: lng }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('ERROR in /:id/delivery-location', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Courier's live location ──
router.patch('/:id/courier-location', async (req, res) => {
  console.log('PATCH /orders/' + req.params.id + '/courier-location');
  try {
    const { lat, lng } = req.body;
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ error: 'lat and lng must be numbers.' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { courierLat: lat, courierLng: lng, courierLocationUpdatedAt: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('ERROR in /:id/courier-location', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Generic status update ──
router.patch('/:id', async (req, res) => {
  console.log('PATCH /orders/' + req.params.id, req.body);
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) {
    console.error('ERROR in /:id', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Cancel/delete ──
router.delete('/:id', async (req, res) => {
  console.log('DELETE /orders/' + req.params.id);
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    console.error('ERROR in DELETE /:id', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;