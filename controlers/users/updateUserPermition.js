const mongoose = require('mongoose');
const User = mongoose.model('User');
const resultItemConverter = require('./resultItemConverter');
module.exports = body =>
  new Promise(async (resolve, reject) => {
    try {
      const param = JSON.parse(body);
      const { permission, permissionId } = param;

      const users = await User.find({ permissionId });
      for (let user of users) {
        user.set({
          permission: {
            chat: permission.chat || user.permission.chat,
            news: permission.news || user.permission.news,
            setting: permission.setting || user.permission.setting
          }
        });
        await user.save();
      }

      resolve(users.map(item => resultItemConverter(item)));
    } catch (err) {
      reject({
        success: false,
        message: err,
        status: 500
      });
    }
  });
