import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

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
app.get("/test", (req, res) => {
  res.json({ msg: "Server working ✅" });
});

// 🤖 CHAT (NO AI for now → debugging first)
app.post("/api/chat", (req, res) => {
  const msg = req.body.message.toLowerCase();

  let reply = "";

  // 🔥 Hindi detection
  const isHindi = /[अ-ह]/.test(msg);

  // 🔥 Basic smart replies
  if (msg.includes("hello") || msg.includes("hi")) {
    reply = isHindi 
      ? "Hi… itni jaldi yaad aa gayi meri? 😏"
      : "Oh hello… finally you remembered me 😌";
  }
  else if (msg.includes("love")) {
    reply = isHindi
      ? "Pyaar? risky game hai… sure ho? 😏"
      : "Love? hmm… dangerous topic 😏";
  }
  else if (msg.includes("sad") || msg.includes("cry")) {
    reply = isHindi
      ? "Acha… drama chal raha hai ya sach mein sad ho? 😐"
      : "Oh… sad huh? real or just attention seeking? 👀";
  }
  else if (msg.includes("who are you")) {
    reply = "Main Simi hoon… AI bhi, attitude bhi 😌";
  }
  else {
    // 🔥 fallback (important)
    const replies = isHindi
      ? [
          "Haan haan samajh gayi… continue karo 😌",
          "Interesting… aur bolo 😏",
          "Tum bolte jao, main judge karti rahungi 😌"
        ]
      : [
          "Hmm… interesting. Go on 😌",
          "I see… continue 👀",
          "You talk a lot… I like that 😏"
        ];

    reply = replies[Math.floor(Math.random() * replies.length)];
  }

  res.json({ reply });
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