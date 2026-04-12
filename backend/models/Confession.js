import mongoose from "mongoose";

const schema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Confession", schema);