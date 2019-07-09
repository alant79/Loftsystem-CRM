const mongoose = require('mongoose');
const User = mongoose.model('User');
const Joi = require('@hapi/joi');
const resultItemConverter = require('./resultItemConverter');
const schema = Joi.object().keys({
  username: Joi.string(),
  password: Joi.string()
});
module.exports = body =>
  new Promise(async (resolve, reject) => {
    try {
      const param = JSON.parse(body);
      const { firstName, middleName, surName, username, password, img } = param;
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
      const newUser = new User({
        image: img,
        firstName,
        middleName,
        surName,
        username,
        permissionId: 1,
        permission: {
          chat: {
            C: true,
            R: true,
            U: true,
            D: true
          },
          news: {
            C: true,
            R: true,
            U: true,
            D: true
          },
          setting: {
            C: true,
            R: true,
            U: true,
            D: true
          }
        }
      });
      newUser.setPassword(password);
      const result = await newUser.save();
      resolve(resultItemConverter(result));
    } catch (err) {
      reject({
        success: false,
        message: err,
        status: 500
      });
    }
  });
