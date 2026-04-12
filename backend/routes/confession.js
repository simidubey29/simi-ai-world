import express from "express";
import Confession from "../models/Confession.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const newConfession = new Confession({ text: req.body.text });
  await newConfession.save();
  res.json({ success: true });
});

// 👇 ADMIN VIEW
router.get("/", async (req, res) => {
  const data = await Confession.find().sort({ createdAt: -1 });
  res.json(data);
});

export default router;