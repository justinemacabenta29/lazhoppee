const router = require('express').Router();
const Store = require('../models/store.model');

router.get('/', async (req, res) => {
  try {
    const stores = await Store.find().populate('owner', 'name email');
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my/:ownerId', async (req, res) => {
  try {
    const stores = await Store.find({ owner: req.params.ownerId });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate('owner', 'name email');
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const store = new Store(req.body);
    await store.save();
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ APPROVE store
router.patch('/:id/approve', async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { approved: true, active: true, categories: req.body.categories || [] },
      { new: true }
    );
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ REJECT store
router.patch('/:id/reject', async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { approved: false, active: false },
      { new: true }
    );
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Store.findByIdAndDelete(req.params.id);
    res.json({ message: 'Store deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;