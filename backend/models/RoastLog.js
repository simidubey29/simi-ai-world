const mongoose = require('mongoose');

const roastLogSchema = new mongoose.Schema({
  target_name: { type: String, required: true },
  roast_text: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('RoastLog', roastLogSchema);