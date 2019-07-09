const express = require('express');
const multer = require('multer');
const upload = multer();
const ctrlUsers = require('../controlers/users');
const ctrlNews = require('../controlers/news');
const path = require('path');
const router = express.Router();

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

router.post('/api/saveNewUser', async (req, res) => {
  try {
    const result = await ctrlUsers.add(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.put('/api/updateUserPermission/:id', async (req, res) => {
  try {
    const result = await ctrlUsers.updateUserPermition(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.post('/api/newNews', async (req, res) => {
  try {
    const result = await ctrlNews.add(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Username are already exist'
    });
    res.status(err.status).json(err);
  }
});

router.get('/api/getUsers', async (req, res) => {
  try {
    const result = await ctrlUsers.getAll();
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.get('/api/getNews', async (req, res) => {
  try {
    const result = await ctrlNews.getAll();
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.put('/api/updateUser/:id', async (req, res) => {
  try {
    const result = await ctrlUsers.update(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.put('/api/updateNews/:id', async (req, res) => {
  try {
    const result = await ctrlNews.update(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.post('/api/saveUserImage/:id', upload.any(), async (req, res) => {
  try {
    const result = await ctrlUsers.savePhoto(req.files);
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.post('/api/authFromToken', async (req, res, next) => {
  try {
    const result = await ctrlUsers.loginWithToken(req, res, next);
    req.session.isAuth = true;
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.post('/api/login', async (req, res, next) => {
  try {
    const result = await ctrlUsers.login(req, res, next);
    req.session.isAuth = true;
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.delete('/api/deleteNews/:id', async (req, res, next) => {
  try {
    const result = await ctrlNews.delete(req.params);
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.delete('/api/deleteUser/:id', async (req, res, next) => {
  try {
    const result = await ctrlUsers.delete(req.params);
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

module.exports = router;
