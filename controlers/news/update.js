const mongoose = require('mongoose');
const New = mongoose.model('New');
const resultItemConverter = require('./resultItemConverter');
module.exports = body =>
  new Promise(async (resolve, reject) => {
    try {
      const param = JSON.parse(body);
      const { id, text, theme } = param;

      const newItem = await New.findById(id);

      newItem.set({
        text: text || newItem.text,
        theme: theme || newItem.theme
      });
      let result = await newItem.save();

      result = await New.find();
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
