import express from "express";
const router = express.Router();

const truths = [
  "What is your biggest secret?",
  "Have you ever lied to your best friend?"
];

const dares = [
  "Send a random emoji to your crush 😜",
  "Sing a song loudly 🎤"
];

router.get("/truth", (req, res) => {
  const q = truths[Math.floor(Math.random() * truths.length)];
  res.json({ question: q });
});

router.get("/dare", (req, res) => {
  const q = dares[Math.floor(Math.random() * dares.length)];
  res.json({ question: q });
});

export default router;