const mongoose = require('mongoose');
const New = mongoose.model('New');
const resultItemConverter = require('./resultItemConverter');
module.exports = ({ id }) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        reject({
          success: false,
          message: 'id на задано',
          status: 500
        });
      }
      await New.findByIdAndRemove(id);

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
