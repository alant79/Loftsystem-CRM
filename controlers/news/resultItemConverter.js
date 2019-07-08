const mongoose = require('mongoose');
const User = mongoose.model('User');
module.exports = async item => {
  const user = await User.findById(item.userId);
  return {
    date: item.date,
    text: item.text,
    id: item.id,
    theme: item.theme,
    user: {
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
