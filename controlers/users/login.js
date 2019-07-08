const mongoose = require('mongoose');
const User = mongoose.model('User');
const Joi = require('@hapi/joi');
const resultItemConverter = require('./resultItemConverter');
const schema = Joi.object().keys({
  username: Joi.string(),
  password: Joi.string()
});
module.exports = (req, res, next) =>
  new Promise(async (resolve, reject) => {
    try {
      const param = JSON.parse(req.body);
      console.log(param);
      const { username, password, remembered } = param;
      const { error } = Joi.validate({ username, password }, schema);
      if (error) {
        console.log('Введены не все поля');
        return reject({
          success: false,
          message:
            'Пользователь и/или пароль не заданы! Авторизация не выполнена!',
          status: 401
        });
      }
      const user = await User.findOne({ username });
      if (!user) {
        reject({
          success: false,
          message:
            'Пользователь и/или пароль некорректны! Авторизация не выполнена!',
          status: 401
        });
      }
      if (!user.validPassword(password)) {
        reject({
          success: false,
          message:
            'Пользователь и/или пароль некорректны! Авторизация не выполнена!',
          status: 401
        });
      }
      const item = resultItemConverter(user);
      if (remembered) {
        res.cookie('access_token', item.access_token, {
          maxAge: 7 * 60 * 60 * 1000,
          path: '/',
          httpOnly: true
        });
      }
      resolve(item);
    } catch (err) {
      reject({
        success: false,
        message: err,
        status: 500
      });
    }
  });
