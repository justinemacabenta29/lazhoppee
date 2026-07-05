const router = require('express').Router();
const Message = require('../models/message.model');

router.get('/inbox/:userId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.params.userId }, { receiver: req.params.userId }]
    })
    .populate('sender', 'name')
    .populate('receiver', 'name')
    .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:userId/:otherId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.params.userId, receiver: req.params.otherId },
        { sender: req.params.otherId, receiver: req.params.userId }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;