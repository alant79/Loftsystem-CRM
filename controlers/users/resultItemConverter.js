const jwt = require('jsonwebtoken');
module.exports = item => {
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
