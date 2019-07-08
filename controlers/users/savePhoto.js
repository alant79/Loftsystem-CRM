const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const sizeOf = require('image-size');
module.exports = files =>
  new Promise(async (resolve, reject) => {
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
      const dir = path.join('assets', 'img', 'users');
      const pathImg = path.join(uploadDir, fieldname + '.' + type);
      const dimensions = sizeOf(pathImg);

      fs.writeFileSync(pathImg, buffer);
      const minSize = Math.min(dimensions.width, dimensions.height);
      Jimp.read(pathImg, function (err, image) {
        if (err) throw err;
        image.cover(minSize, minSize).write(pathImg);
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
