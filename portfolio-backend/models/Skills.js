const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Frontend, Backend, Tools
  proficiency: { type: Number, min: 1, max: 100 }, // percentage
  iconUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);