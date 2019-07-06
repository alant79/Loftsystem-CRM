const mongoose = require('mongoose');
const User = mongoose.model('User');
const uuidv4 = require('uuid/v4');
const passport = require('passport');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const resultItemConverter = item => {
  return {
    access_token: item.access_token,
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
    const token = uuidv4();
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
    newUser.setToken(token);

    const result = await newUser.save();

    resolve(resultItemConverter(result));
  }
  catch (err) {
    reject(err);
  }
});

exports.login = ( req, res, next ) => new Promise(async (resolve, reject) => {
  try {
    const param = JSON.parse(req.body);
    User.findOne({ username: param.username }).then(user => {
    resolve(resultItemConverter(user));
  });
} catch (err) {
  reject(err);
}
  // passport.authenticate('local', function(err, user, info) {
  //   if (err) {
  //     reject(next(err));
  //   }
  //   if (!user) {
  //     reject('Пользователь не обнаружен');
  //   }
  //   req.login(user, function(err) {
  //     if (err) {
  //       reject(next(err));
  //     }
  //     if (req.body.remember) {
  //       const token = uuidv4();
  //       user.setToken(token);
  //       user.save().then(user => {
  //         res.cookie('token', token, {
  //           maxAge: 7 * 60 * 60 * 1000,
  //           path: '/',
  //           httpOnly: true,
  //         });
  //         resolve(user);
  //       });
  //     } else {
  //       resolve(user);
  //     }
  //   });
  // })(req, res, next);
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
      if (err) throw err;
      image.resize(256, 256)
           .quality(50)                 
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
