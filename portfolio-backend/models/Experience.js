const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String }, // or "Present"
  description: [String]
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);