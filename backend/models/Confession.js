const mongoose = require('mongoose');

const confessionSchema = new mongoose.Schema({
  message: { type: String, required: true, trim: true },
  sender_name: { type: String, default: 'Anonymous', trim: true },
  is_read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Confession', confessionSchema);