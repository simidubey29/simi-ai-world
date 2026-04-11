const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
  session_id: { type: String },
  role: { type: String, required: true, enum: ['user', 'assistant'] },
  content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ChatLog', chatLogSchema);