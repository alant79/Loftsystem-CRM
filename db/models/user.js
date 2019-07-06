const mongoose = require("mongoose");
const bCrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  permission: {
    chat: {
      C: { type: Boolean },
      R: { type: Boolean },
      U: { type: Boolean },
      D: { type: Boolean }
    },
    news: {
      C: { type: Boolean },
      R: { type: Boolean },
      U: { type: Boolean },
      D: { type: Boolean }
    },
    setting: {
      C: { type: Boolean },
      R: { type: Boolean },
      U: { type: Boolean },
      D: { type: Boolean }
    }
  },
  permissionId: {
    type: Number
  },
  username: {
    type: String,
    required: [true, 'Username required'],
    unique: true
  },
  surName: {
    type: String
  },
  firstName: {
    type: String
  },
  access_token: {
    type: String
  },
  image: {
    type: String
  },
  middleName: {
    type: String
  },
  hash: {
    type: String,
    required: [true, 'Password required'],
  },
});

userSchema.methods.setPassword = function(password) {
  this.hash = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function(password) {
  return bCrypt.compareSync(password, this.hash);
};

userSchema.methods.setToken = function(access_token) {
  this.access_token = access_token;
};

mongoose.model("User", userSchema);
