const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  feedback: { type: String, required: true },
  company: { type: String },
  avatarUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);