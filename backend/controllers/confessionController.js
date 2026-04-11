import Confession from "../models/Confession.js";

export const saveConfession = async (req, res) => {
  const { text, userId } = req.body;

  await Confession.create({ text, userId });

  res.json({ message: "Saved 😈" });
};