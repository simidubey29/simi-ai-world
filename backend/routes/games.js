const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const RoastLog = require('../models/RoastLog');
const QuizScore = require('../models/QuizScore');

router.post('/roast', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 150,
      messages: [{ role: 'user', content: `You are Simi, a savage but loving friend. Generate a short funny roast (2-3 lines max) for someone named ${name}. Keep it in casual Hinglish tone, playful not mean.` }]
    })
  });

  const data = await response.json();
  const roast = data.content?.[0]?.text || `${name} is too boring to roast 💀`;

  await RoastLog.create({ target_name: name, roast_text: roast });
  res.json({ roast });
});

router.get('/truth-or-dare', async (req, res) => {
  const type = req.query.type === 'dare' ? 'dare' : 'truth';
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 100,
      messages: [{ role: 'user', content: `Generate one funny ${type} in Simi's casual Hinglish style. Fun, slightly spicy but not inappropriate. Just the ${type} text only.` }]
    })
  });

  const data = await response.json();
  res.json({ result: data.content?.[0]?.text || 'Skip karo yaar' });
});

router.get('/would-you-rather', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Give me one fun "Would you rather" question for friends. Return ONLY valid JSON: {"optionA": "...", "optionB": "..."}' }]
    })
  });

  const data = await response.json();
  try {
    const text = data.content[0].text.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(text));
  } catch {
    res.json({ optionA: 'Eat spicy food forever', optionB: 'Never eat spicy food again' });
  }
});

router.post('/quiz-score', async (req, res) => {
  const { player_name, score, total } = req.body;
  await QuizScore.create({ player_name: player_name || 'Anonymous', score, total });
  res.json({ success: true });
});

module.exports = router;