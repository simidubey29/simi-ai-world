const express = require('express');
const router = express.Router();
const Confession = require('../models/Confession');
const ChatLog = require('../models/ChatLog');
const QuizScore = require('../models/QuizScore');
const RoastLog = require('../models/RoastLog');

const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'simi123';

function auth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token !== ADMIN_PASS) return res.status(401).json({ error: 'wrong password babe' });
  next();
}

router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASS) res.json({ success: true, token: ADMIN_PASS });
  else res.status(401).json({ error: 'nope' });
});

router.get('/confessions', auth, async (req, res) => {
  const rows = await Confession.find().sort({ createdAt: -1 });
  res.json(rows);
});

router.patch('/confessions/:id/read', auth, async (req, res) => {
  await Confession.findByIdAndUpdate(req.params.id, { is_read: true });
  res.json({ success: true });
});

router.delete('/confessions/:id', auth, async (req, res) => {
  await Confession.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

router.get('/chats', auth, async (req, res) => {
  const rows = await ChatLog.find().sort({ createdAt: -1 }).limit(200);
  res.json(rows);
});

router.get('/quiz-scores', auth, async (req, res) => {
  const rows = await QuizScore.find().sort({ score: -1 });
  res.json(rows);
});

router.get('/roasts', auth, async (req, res) => {
  const rows = await RoastLog.find().sort({ createdAt: -1 });
  res.json(rows);
});

router.get('/stats', auth, async (req, res) => {
  const [confessions, unread, chats, roasts] = await Promise.all([
    Confession.countDocuments(),
    Confession.countDocuments({ is_read: false }),
    ChatLog.countDocuments(),
    RoastLog.countDocuments()
  ]);
  res.json({ confessions, unread, chats, roasts });
});

module.exports = router;