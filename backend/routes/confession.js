const express = require('express');
const router = express.Router();
const Confession = require('../models/Confession');

router.post('/', async (req, res) => {
  const { message, sender_name } = req.body;
  if (!message || message.trim().length < 3) {
    return res.status(400).json({ error: 'confession too short lol' });
  }
  await Confession.create({ message: message.trim(), sender_name: sender_name?.trim() || 'Anonymous' });
  res.json({ success: true, message: 'Confession sent 💌' });
});

module.exports = router;