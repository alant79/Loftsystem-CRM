const mongoose = require('mongoose');
const User = mongoose.model('User');
const resultItemConverter = require('./resultItemConverter');
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) =>
  new Promise(async (resolve, reject) => {
    try {
      const param = JSON.parse(req.body);
      const id = jwt.decode(param.access_token);
      const user = await User.findById(id.id);
      if (!user) {
        reject({
          success: false,
          message:
            'Пользователь и/или пароль некорректны! Авторизация не выполнена!',
          status: 401
        });
      }
      resolve(resultItemConverter(user));
    } catch (err) {
      reject({
        success: false,
        message: err,
        status: 500
      });
    }
  });
