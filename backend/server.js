import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();

// 🔥 Gemini init AFTER dotenv
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

// ✅ FIX 1: middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// ✅ FIX 2: MongoDB connection
console.log("ENV CHECK:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("Mongo Error:", err));

// ✅ Schema
const Confession = mongoose.model("Confession", {
  text: String,
  createdAt: { type: Date, default: Date.now }
});

// ================= ROUTES =================

// 🔥 TEST ROUTE (IMPORTANT)
app.post("/api/chat", async (req, res) => {
  try {
    const userMsg = req.body.message;

    const prompt = `
You are Simi, a witty, slightly sarcastic, flirty AI girl.

Rules:
- Never repeat user message
- Reply short and natural
- Be playful, थोड़ा attitude 😏
- If user speaks Hindi → reply in Hindi/Hinglish
- If English → reply in English
- Sound human, not robotic
- No "as an AI" lines

User: ${userMsg}
Simi:
`;

    const result = await model.generateContent(prompt);
    
    console.log("AI RAW:", JSON.stringify(result, null, 2));

    // ✅ SAFE extraction (NO CRASH)
    let reply = "";

    if (result?.response?.candidates?.length > 0) {
      const parts = result.response.candidates[0].content.parts;
      reply = parts.map(p => p.text).join("");
    } else {
      reply = "Hmm… didn’t get that, say again 😏";
    }

    res.json({ reply });

  } catch (err) {
    console.log("AI ERROR FULL:", err); // 🔥 IMPORTANT for debugging
    res.json({ reply: "Okay wait… brain lag ho gaya 😵 try again" });
  }
});
// 💌 CONFESSION SAVE
app.post("/api/confession", async (req, res) => {
  try {
    const data = new Confession({ text: req.body.text });
    await data.save();

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});


// ✅ TRUTH
app.get("/api/game/truth", (req, res) => {
  const questions = [
    "What is your biggest secret?",
    "Who do you like secretly?",
    "What is your most embarrassing moment?",
    "Have you ever lied to your best friend?",
    "What’s something you never told your parents?",
    "Your biggest crush till now?",
    "Have you ever stalked someone? 😏",
    "What’s your guilty pleasure?"
];
  res.json({
    question: questions[Math.floor(Math.random() * questions.length)]
  });
});

// ✅ DARE
app.get("/api/game/dare", (req, res) => {
  const dares = [
    "Send a funny selfie 😂",
    "Text your crush 😏",
    "Dance for 10 seconds 💃",
    "Call a friend and say 'I love you' 😆",
    "Post a random emoji on your status",
    "Sing a song loudly 🎤",
    "Send last screenshot in your phone",
    "Say something embarrassing out loud"
  ];
  res.json({
    question: dares[Math.floor(Math.random() * dares.length)]
  });
});


// 🚀 START
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Simi AI Backend Running 😏");
});
app.listen(PORT, () => {
  console.log("Running on " + PORT);
});