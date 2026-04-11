const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ✅ PORT (works for local + Render)
const PORT = process.env.PORT || 3000;

// ✅ MongoDB connection (safe)
const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Connected ✅");
    } else {
      console.log("No MongoDB URI provided ⚠️ (Skipping DB)");
    }
  } catch (error) {
    console.error("MongoDB connection failed ❌", error.message);
    process.exit(1); // stop app if DB fails
  }
};

// Call DB connection
connectDB();

// ✅ Test route (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully!");
});

// Example route (optional)
app.get("/api/test", (req, res) => {
  res.json({ message: "API working ✅" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});