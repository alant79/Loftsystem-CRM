const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  date: {
    type: Date
  },
  text: {
    type: String
  },
  theme: {
    type: String
  },
  userId: {
    type: String
  }
});

mongoose.model('New', userSchema);
