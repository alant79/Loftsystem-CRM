const mongoose = require('mongoose');
const User = mongoose.model('User');
module.exports = ({ id }) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        return reject({
          success: false,
          message: 'Id is required',
          status: 500
        });
      }
      await User.findByIdAndRemove(id);

      resolve(true);
    } catch (err) {
      reject({
        success: false,
        message: err,
        status: 500
      });
    }
  });
