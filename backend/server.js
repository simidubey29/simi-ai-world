import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// 🤖 Anthropic setup
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 💌 Confession Schema
const ConfessionSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now }
});
const Confession = mongoose.model("Confession", ConfessionSchema);

// ================= ROUTES =================

// 🟢 CHAT (REAL AI)
app.post("/api/chat", async (req, res) => {
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

// 💌 CONFESSION SAVE
app.post("/api/confession", async (req, res) => {
  try {
    const newConfession = new Confession({ text: req.body.text });
    await newConfession.save();
    res.json({ success: true });
  } catch {
    res.json({ success: false });
  }
});

// 👑 ADMIN VIEW CONFESSION
app.get("/api/confession", async (req, res) => {
  const data = await Confession.find().sort({ createdAt: -1 });
  res.json(data);
});

// 🎮 GAME (Truth & Dare)

const truths = [
  "What is your biggest secret?",
  "Have you ever had a crush secretly?",
  "What is your most embarrassing moment?"
];

const dares = [
  "Send a random emoji to someone 😜",
  "Sing loudly for 10 seconds 🎤",
  "Do a funny face and click selfie 😂"
];

app.get("/api/game/truth", (req, res) => {
  const q = truths[Math.floor(Math.random() * truths.length)];
  res.json({ question: q });
});

app.get("/api/game/dare", (req, res) => {
  const q = dares[Math.floor(Math.random() * dares.length)];
  res.json({ question: q });
});

// 🏠 ROOT
app.get("/", (req, res) => {
  res.send("Simi AI Backend Running 🚀");
});

// 🚀 START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});