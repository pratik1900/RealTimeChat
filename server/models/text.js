const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const textSchema = new Schema({
  msg: {
    type: String,
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Text', textSchema);