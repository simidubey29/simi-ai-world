import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = express.Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

router.post("/", async (req, res) => {
  try {
    const msg = req.body.message;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 200,
      messages: [{ role: "user", content: msg }]
    });

    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error(err);
    res.json({ reply: "AI error ❌" });
  }
});

export default router;