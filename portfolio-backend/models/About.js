const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  skills: [String],
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);