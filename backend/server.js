import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

// ✅ FIX 1: middleware
app.use(cors());
app.use(express.json());

// ✅ FIX 2: MongoDB connection
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
  const msg = req.body.message;

  res.json({
    reply: "Simi 🤖: You said -> " + msg
  });
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

// 👑 VIEW CONFESSION
app.get("/api/confession", async (req, res) => {
  const data = await Confession.find();
  res.json(data);
});

// 🚀 START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Running on " + PORT);
});