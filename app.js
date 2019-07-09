const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
require('./db');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

app.locals.basedir = path.join(__dirname, 'views');
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: 'key-secret',
    key: 'session-key',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 30 * 60 * 1000
    },
    saveUninitialized: false,
    resave: true,
    ephemeral: true,
    rolling: true,
    isAuth: false
  })
);

app.use(function (req, res, next) {
  let securedPathes = [];
  securedPathes.push('/api/saveNewUser');
  securedPathes.push('/api/updateUserPermission/:id');
  securedPathes.push('/api/newNews');
  securedPathes.push('/api/getUsers');
  securedPathes.push('/api/getNews');
  securedPathes.push('/api/updateUser/:id');
  securedPathes.push('/api/updateNews/:id');
  securedPathes.push('/api/saveUserImage/:id');
  securedPathes.push('/api/deleteNews/:id');
  securedPathes.push('/api/deleteUser/:id');
  if (
    securedPathes.includes(req.path) &&
    !req.session.isAuth
  ) {
    res.json({
      success: false,
      message:
        'Пользователь и/или пароль не заданы! Авторизация не выполнена!',
      status: 401
    });
  }
  next();
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use('/api', require('./router'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
});
const server = app.listen(port, function () {
  console.log('Сервер запущен на порте: ' + server.address().port);
});

// обработка ошибки

require('./chat').startChat(server);
