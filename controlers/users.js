const mongoose = require('mongoose');
const User = mongoose.model('User');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const sizeOf = require('image-size');

const schema = Joi.object().keys({
  username: Joi.string(),
  password: Joi.string()
});

const resultItemConverter = item => {
  const token = jwt.sign({ id: item.id }, 'tasmanianDevil');
  return {
    access_token: token,
    firstName: item.firstName,
    id: item.id,
    image: item.image,
    middleName: item.middleName,
    permission: item.permission,
    permissionId: item.permissionId,
    surName: item.surName,
    username: item.username
  };
};

exports.getAll = () => new Promise(async (resolve, reject) => {
  try {
    let result = await User.find();

    resolve(result.map((item) => resultItemConverter(item)));
  } catch (err) {
    reject({
      success: false,
      message: err,
      status: 500
    });
  }
});

exports.add = (body) => new Promise(async (resolve, reject) => {
  try {
    const param = JSON.parse(body);
    const { firstName, middleName, surName, username, password, img } = param;
    const { error } = Joi.validate({ username, password }, schema);
    if (error) {
      console.log('Введены не все поля');
      return reject({
        success: false,
        message: 'Пользователь и/или пароль не заданы! Авторизация не выполнена!',
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

exports.login = (req, res, next) => new Promise(async (resolve, reject) => {
  try {
    const param = JSON.parse(req.body);
    const { username, password, remembered } = param;
    const { error } = Joi.validate({ username, password }, schema);
    if (error) {
      console.log('Введены не все поля');
      return reject({
        success: false,
        message: 'Пользователь и/или пароль не заданы! Авторизация не выполнена!',
        status: 401
      });
    }
    const user = await User.findOne({ username });
    if (!user) {
      reject({
        success: false,
        message: 'Пользователь и/или пароль некорректны! Авторизация не выполнена!',
        status: 401
      });
    }
    if (!user.validPassword(password)) {
      reject({
        success: false,
        message: 'Пользователь и/или пароль некорректны! Авторизация не выполнена!',
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

exports.loginWithToken = (req, res, next) => new Promise(async (resolve, reject) => {
  try {
    const param = JSON.parse(req.body);
    const id = jwt.decode(param.access_token);
    const user = await User.findById(id.id);
    if (!user) {
      reject({
        success: false,
        message: 'Пользователь и/или пароль некорректны! Авторизация не выполнена!',
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

exports.update = (body) => new Promise(async (resolve, reject) => {
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

exports.updateUserPermition = (body) => new Promise(async (resolve, reject) => {
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

    resolve(users.map((item) => resultItemConverter(item)));
  } catch (err) {
    reject({
      success: false,
      message: err,
      status: 500
    });
  }
});

exports.savePhoto = (files) => new Promise(async (resolve, reject) => {
  try {
    if (!files || !files.length) {
      reject({
        success: false,
        message: 'Ошибка чтения картинки с формы',
        status: 500
      });
    }
    const { fieldname, originalname, buffer } = files[0];
    const uploadDir = path.join(
      process.cwd(),
      '/public',
      'assets',
      'img',
      'users'
    );
    const arr = originalname.split('.');
    const type = arr[arr.length - 1];

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    const dir = path.join(
      'assets',
      'img',
      'users'
    );
    const pathImg = path.join(uploadDir, fieldname + '.' + type);
    const dimensions = sizeOf(pathImg);

    fs.writeFileSync(
      pathImg,
      buffer);
    const minSize = Math.min(dimensions.width, dimensions.height);
    Jimp.read(pathImg, function (err, image) {
      if (err) throw err;
      image.cover(minSize, minSize)
        .write(pathImg);
    });

    resolve({ path: path.join(dir, fieldname + '.' + type) });
  } catch (err) {
    reject({
      success: false,
      message: err,
      status: 500
    });
  }
});

exports.delete = ({ id }) => new Promise(async (resolve, reject) => {
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
