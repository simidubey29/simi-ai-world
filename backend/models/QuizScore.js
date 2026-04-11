const mongoose = require('mongoose');

const quizScoreSchema = new mongoose.Schema({
  player_name: { type: String, default: 'Anonymous' },
  score: { type: Number, required: true },
  total: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('QuizScore', quizScoreSchema);