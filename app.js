const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
require('./db');
const bodyParser = require('body-parser');
var multer = require('multer'); 
var upload = multer();
const ctrlUsers = require('./controlers/users');
const ctrlNews = require('./controlers/news');

app.locals.basedir = path.join(__dirname, 'views');
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
require('./config-passport');
app.use(passport.initialize());
app.use(passport.session());
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
      maxAge: 30 * 60 * 1000,
    },
    saveUninitialized: false,
    resave: true,
    ephemeral: true,
    rolling: true,
  })
);
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'./public/index.html'));
});

app.post('/api/saveNewUser', async (req, res) => {
  try {
    const result = await ctrlUsers.add(req.body);
    res.json(result);
  }
  catch (err) {
    console.log(err);
  }
});

app.put('/api/updateUserPermission/:id', async (req, res) => {
  try {
    const result = await ctrlUsers.updateUserPermition(req.body);
    res.json(result);
  }
  catch (err) {
    console.log(err);
  }
});

app.post('/api/newNews', async (req, res) => {
  try {
    const result = await ctrlNews.add(req.body);
    res.json(result);
  }
  catch (err) {
    console.log(err);
  }
});

app.get('/api/getUsers', async (req, res) => {
  try {
    const result = await ctrlUsers.getAll();
    res.json(result);
  }
  catch (err) {
    console.log(err);
  }
});

app.get('/api/getNews', async (req, res) => {
  try {
    const result = await ctrlNews.getAll();
    res.json(result);
  }
  catch (err) {
    console.log(err);
  }
});

app.put('/api/updateUser/:id', async (req, res) => {
  try {
    const result = await ctrlUsers.update(req.body);
    res.json(result);
  }
  catch (err) {
    console.log(err);
  }
});

app.put('/api/updateNews/:id', async (req, res) => {
  try {
    const result = await ctrlNews.update(req.body);
    res.json(result);
  }
  catch (err) {
    console.log(err);
  }
});

app.post('/api/saveUserImage/:id', upload.any(), async (req, res) => {
  try {
    const result = await ctrlUsers.savePhoto(req.files);
    res.json(result);
  }
  catch (err) {
    console.log(err);
  }
});


app.post('/api/login', async (req, res, next) => {
  try {
    const result = await ctrlUsers.login(req, res, next);
    res.json(result);
  }
  catch (err) {
    console.log(err);
  }
});


app.delete('/api/deleteNews/:id', async (req, res, next) => {
  try {
    const result = await ctrlNews.delete(req.params);
    res.json(result);
  }
  catch (err) {
    console.log(err);
  }
});

app.delete('/api/deleteUser/:id', async (req, res, next) => {
  try {
    const result = await ctrlUsers.delete(req.params);
    res.json(result);
  }
  catch (err) {
    console.log(err);
  }
});

const server = app.listen(process.env.PORT || 3000, function () {
  console.log('Сервер запущен на порте: ' + server.address().port);
});

const io = require('socket.io').listen(server);

const clients = {};

io.on('connection', socket => {
  const id = socket.id;
  const obj = {
    id,
    username: socket.request.headers.username
  }
  clients[id] = obj;

  socket.json.emit('all users', clients);
  socket.broadcast.json.emit('new user', obj);

  socket.on('chat message', (message,user) => {
    console.log( id, user);
    io.sockets.sockets[user].json.emit('chat message', { message, id });
  });

  socket.on('disconnect', () => {
    socket.broadcast.json.emit('delete user', id);
    delete clients[id];
  });
});