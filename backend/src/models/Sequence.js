const mongoose = require('mongoose');

const sequenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Untitled Sequence'
  },
  nodes: [{
    id: String,
    type: String,
    position: {
      x: Number,
      y: Number
    },
    data: mongoose.Schema.Types.Mixed
  }],
  edges: [{
    id: String,
    source: String,
    target: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

sequenceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Sequence', sequenceSchema); 