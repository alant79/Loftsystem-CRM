const mongoose = require('mongoose');
const New = mongoose.model('New');
const User = mongoose.model('User');

const resultItemConverter = item => {
  const user = User.findById(item.userId);
  return {
    date: item.date,
    text: item.text,
    id: item.id,
    theme: item.theme,
    user: {
      access_token: user.access_token,
      firstName: user.firstName,
      id: user.id,
      image: user.image,
      middleName: user.middleName,
      permission: user.permission,
      permissionId: user.permissionId,
      surName: user.surName,
      username: user.username
    }
  };
};

exports.getAll = () => new Promise(async (resolve, reject) => {
  try {
    let result = await New.find();

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
    const { date, text, theme, userId } = param;
    const itemNews = new New({
      date,
      text,
      theme,
      userId
    });

    let result = await itemNews.save();
    result = await New.find();

    resolve(result.map((item) => resultItemConverter(item)));
  }
  catch (err) {
    reject(err);
  }
});

exports.update = ( body ) => new Promise(async (resolve, reject) => {
  try {
    const param = JSON.parse(body);
    const { id, text, theme } = param;

    const newItem = await New.findById(id);

    newItem.set({         
      text: text || newItem.text,
      theme: theme || newItem.theme
    });
    
    let result = await newItem.save();

    result = await New.find();

    resolve(result.map((item) => resultItemConverter(item)));
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
    await New.findByIdAndRemove(id);

    const result = await New.find();

    resolve(result.map((item) => resultItemConverter(item)));
  }
  catch (err) {
    reject(err);
  }
});
