const mongoose = require('mongoose');

// Atomic counter used to generate sequential employee IDs (EMP-0001, ...)
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model('Counter', counterSchema);
