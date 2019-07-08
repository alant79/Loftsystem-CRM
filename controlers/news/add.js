const mongoose = require('mongoose');
const New = mongoose.model('New');
const resultItemConverter = require('./resultItemConverter');
module.exports = body =>
  new Promise(async (resolve, reject) => {
    try {
      const param = JSON.parse(body);
      const { date, text, theme, userId } = param;
      const itemNews = new New({
        date,
        text,
        theme,
        userId
      });

      let result = await itemNews.save();
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
