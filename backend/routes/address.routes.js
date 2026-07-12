const router = require('express').Router();
const Address = require('../models/address.model');

// GET all addresses for a user
router.get('/my/:userId', async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.params.userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE new address
router.post('/', async (req, res) => {
  try {
    if (req.body.isDefault) {
      await Address.updateMany({ user: req.body.user }, { isDefault: false });
    }
    const address = new Address(req.body);
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE address
router.patch('/:id', async (req, res) => {
  try {
    const existing = await Address.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Address not found' });

    if (req.body.isDefault) {
      await Address.updateMany({ user: existing.user }, { isDefault: false });
    }

    const address = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SET default
router.patch('/:id/default', async (req, res) => {
  try {
    const existing = await Address.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Address not found' });

    await Address.updateMany({ user: existing.user }, { isDefault: false });
    const address = await Address.findByIdAndUpdate(req.params.id, { isDefault: true }, { new: true });
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE address
router.delete('/:id', async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;