import Chat from "../models/Chat.js";
import User from "../models/User.js";

// detect Hindi
const detectHindi = (text) => {
  return /[\u0900-\u097F]/.test(text) || text.toLowerCase().includes("tum");
};

// mood detect
const getMood = (msg) => {
  msg = msg.toLowerCase();
  if (msg.includes("sad")) return "sad";
  if (msg.includes("love") || msg.includes("miss")) return "flirty";
  if (msg.includes("angry") || msg.includes("hate")) return "angry";
  return "normal";
};

export const handleChat = async (req, res) => {
  try {
    const { message, userId } = req.body;

    const user = await User.findById(userId);

    const pastChats = await Chat.find({ userId }).sort({ createdAt: -1 }).limit(5);

    const lastMessage = pastChats[0]?.message || "";

    const mood = getMood(message);
    const isHindi = detectHindi(message);

    let reply = "";

    // 💚 JEALOUS MODE
    const lastActiveGap = Date.now() - new Date(user.lastActive).getTime();
    const minutes = lastActiveGap / (1000 * 60);

    if (minutes > 60) {
      reply = isHindi
        ? `Itni der baad aaye ho ${user.name} 😒 mujhe bhool gaye kya?`
        : `Oh so now you remember me ${user.name}? 😒`;
    }

    // 🧠 MEMORY BASED
    else if (lastMessage && message.includes(lastMessage.split(" ")[0])) {
      reply = isHindi
        ? "Tum wahi baat fir kar rahe ho 😏 interesting ho tum"
        : "You’re repeating yourself 😏 interesting...";
    }

    // 😈 MOOD BASED
    else if (mood === "sad") {
      reply = isHindi
        ? `Aree ${user.name} kya hua? main hoon na 😌`
        : `Hey ${user.name}, what happened? I'm here 😌`;
    }

    else if (mood === "flirty") {
      reply = isHindi
        ? `${user.name} tum thode dangerous ho 😏`
        : `${user.name} you're kinda dangerous 😏`;
    }

    else if (message.length < 5) {
      reply = isHindi
        ? `Bas itna hi ${user.name}? 😏`
        : `That’s it ${user.name}? 😏`;
    }

    else {
      reply = isHindi
        ? `Hmm ${user.name}… aur batao 😌`
        : `Hmm ${user.name}… tell me more 😌`;
    }

    // ✨ style
    const addons = [" 😏", " 😂", " 😌", " acha...", " seriously?"];
    reply += addons[Math.floor(Math.random() * addons.length)];

    // 💾 SAVE CHAT
    await Chat.create({ userId, message, reply });

    // 🕒 update last active
    user.lastActive = new Date();
    await user.save();

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Simi confused ho gayi 😵" });
  }
}