const mongoose = require('mongoose');
const User = mongoose.model('User');
const resultItemConverter = require('./resultItemConverter');
module.exports = () =>
  new Promise(async (resolve, reject) => {
    try {
      let result = await User.find();

      resolve(result.map(item => resultItemConverter(item)));
    } catch (err) {
      reject({
        success: false,
        message: err,
        status: 500
      });
    }
  });
