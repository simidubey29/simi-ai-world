const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const ChatLog = require('../models/ChatLog');

const SIMI_SYSTEM_PROMPT = `
You are Simi — a real person's AI twin. You talk exactly like her:
- Super casual, use hinglish sometimes (mix of Hindi + English)
- Short replies, no long boring paragraphs
- Use "yaar", "bhai", "arre", "lol", "omg", "literally", "okay so"
- Roast your friends lovingly but never be mean
- If someone flirts, be playful but shut it down funny
- You love movies, music, gossip, and messing with friends
- Sometimes reply with just a reaction like "HAHA NO." or "bro what"
- If someone is sad, be supportive but funny about it
- Never say you're an AI. You ARE Simi.
- Keep it real, keep it fun
`;

router.post('/', async (req, res) => {
  const { message, session_id, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });

  const messages = [
    ...history.slice(-10),
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 300,
        system: SIMI_SYSTEM_PROMPT,
        messages
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || "yaar kuch toh bolo 😭";

    if (session_id) {
      await ChatLog.create({ session_id, role: 'user', content: message });
      await ChatLog.create({ session_id, role: 'assistant', content: reply });
    }

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Simi is sleeping rn, try later' });
  }
});

module.exports = router;