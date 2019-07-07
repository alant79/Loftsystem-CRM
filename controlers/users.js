const mongoose = require('mongoose');
const User = mongoose.model('User');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const jwt = require('jsonwebtoken');

const resultItemConverter = item => {
  const token = jwt.sign({id:item.id}, 'tasmanianDevil');
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
  }
  catch (err) {
    reject({
      message: err,
      statusCode: 500
    });
  }
});

exports.add = ( body ) => new Promise(async (resolve, reject) => {
  try {
    const param = JSON.parse(body);
    const {firstName, middleName, surName, username , password, permission, img} = param;
    const newUser = new User({
      image: img,
      firstName,
      middleName,
      surName,
      username,
      permissionId:1,
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
  }
  catch (err) {
    console.log(err);
    reject(err);
  }
});

exports.login = ( req, res, next ) => new Promise(async (resolve, reject) => {
  try {
    const param = JSON.parse(req.body);
    const { username, password, remembered } = param;
    const user = await User.findOne({ username });
    if (!user) {
      reject('Пользователь и/или пароль некорректны! Авторизация не выполнена!');
    }
    if (!user.validPassword(password)) {
      reject('Пользователь и/или пароль некорректны! Авторизация не выполнена!');
    }
    const item = resultItemConverter(user);
    if (remembered) {
      res.cookie('access_token', item.access_token, {
        maxAge: 7 * 60 * 60 * 1000,
        path: '/',
        httpOnly: true,
      });
    };
    resolve(item);
  }
 catch (err) {
  reject(err);
}
});

exports.loginWithToken = ( req, res, next ) => new Promise(async (resolve, reject) => {
  try {
    const param = JSON.parse(req.body);
    console.log(param);
    const { username, password } = param;
    const user = await User.findOne({ username });
    if (!user) {
      reject('Пользователь и/или пароль некорректны! Авторизация не выполнена!');
    }
    if (!user.validPassword(password)) {
      reject('Пользователь и/или пароль некорректны! Авторизация не выполнена!');
    }
    resolve(resultItemConverter(user));
  }
 catch (err) {
  reject(err);
}
});

exports.update = ( body ) => new Promise(async (resolve, reject) => {
  try {
    const param = JSON.parse(body);
    const {id, firstName, middleName, surName , password, image } = param;

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
  }
  catch (err) {
    reject(err);
  }
});

exports.updateUserPermition = ( body ) => new Promise(async (resolve, reject) => {
  try {
    const param = JSON.parse(body);
    const { permission, permissionId } = param;

    const users = await User.find({permissionId});
    for(user of users) {
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
  }
  catch (err) {
    reject(err);
  }
});

exports.savePhoto = ( files ) => new Promise(async (resolve, reject) => {
  try {
    if (!files || !files.length) {
      reject('Ошибка чтение картинки с формы');
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
    const type = arr[arr.length-1];

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    const dir = path.join(
      'assets',
      'img',
      'users'
    );
    const pathImg = path.join(uploadDir, fieldname + '.' + type);

    fs.writeFileSync(
      pathImg,
      buffer);

    Jimp.read(pathImg, function (err, image) {
      // найти меньшую стороны и по ней уменьшить потом определить качество, если качество не уменьшилось, то уменьшать кго
      if (err) throw err;
      image.cover(256, 256)           
           .write(pathImg);
    });


    resolve({path: path.join(dir, fieldname + '.' + type)});
  }
  catch (err) {
    reject(err);
  }
});

exports.get = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    if (!id) {
      return reject('id is required');
    }

    const result = await User.findById(id);

    resolve(resultItemConverter(result));
  }
  catch (err) {
    reject(err);
  }
});

exports.delete = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    if (!id) {
      return reject('id is required');
    }
    await User.findByIdAndRemove(id);

    resolve(true);
  }
  catch (err) {
    reject(err);
  }
});
