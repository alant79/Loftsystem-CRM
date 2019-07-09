const mongoose = require('mongoose');
const New = mongoose.model('New');
const resultItemConverter = require('./resultItemConverter');
module.exports = () =>
  new Promise(async (resolve, reject) => {
    try {
      let result = await New.find();
      let arr = [];
      for (let item of result) {
        arr.push(await resultItemConverter(item));
      }
      resolve(arr);
    } catch (err) {
      reject({
        success: false,
        message: err,
        status: 500
      });
    }
  });
