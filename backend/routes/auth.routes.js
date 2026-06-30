const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      role: role || 'customer',
      storeApproved: role === 'store_owner' ? false : true
    });

    await user.save();
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      storeApproved: user.storeApproved
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Wrong password' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      storeApproved: user.storeApproved
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;