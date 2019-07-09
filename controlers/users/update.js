const mongoose = require('mongoose');
const User = mongoose.model('User');
const resultItemConverter = require('./resultItemConverter');
module.exports = body =>
  new Promise(async (resolve, reject) => {
    try {
      const param = JSON.parse(body);
      const { id, firstName, middleName, surName, password, image } = param;

      const user = await User.findById(id);

      user.set({
        firstName: firstName || user.firstName,
        middleName: middleName || user.middleName,
        surName: surName || user.surName,
        image: image || user.image
      });
      if (password) {
        user.setPassword(password);
      }
      const result = await user.save();

      resolve(resultItemConverter(result));
    } catch (err) {
      reject({
        success: false,
        message: err,
        status: 500
      });
    }
  });
