const express = require('express');
const multer = require('multer');
const upload = multer();
const ctrlUsers = require('../controlers/users');
const ctrlNews = require('../controlers/news');
const router = express.Router();

router.post('/saveNewUser', async (req, res) => {
  try {
    const result = await ctrlUsers.add(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.put('/updateUserPermission/:id', async (req, res) => {
  try {
    const result = await ctrlUsers.updateUserPermition(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.post('/newNews', async (req, res) => {
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

router.get('/getUsers', async (req, res) => {
  try {
    const result = await ctrlUsers.getAll();
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.get('/getNews', async (req, res) => {
  try {
    const result = await ctrlNews.getAll();
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.put('/updateUser/:id', async (req, res) => {
  try {
    const result = await ctrlUsers.update(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.put('/updateNews/:id', async (req, res) => {
  try {
    const result = await ctrlNews.update(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.post('/saveUserImage/:id', upload.any(), async (req, res) => {
  try {
    const result = await ctrlUsers.savePhoto(req.files);
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.post('/authFromToken', async (req, res, next) => {
  try {
    const result = await ctrlUsers.loginWithToken(req, res, next);
    req.session.isAuth = true;
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const result = await ctrlUsers.login(req, res, next);
    req.session.isAuth = true;
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.delete('/deleteNews/:id', async (req, res, next) => {
  try {
    const result = await ctrlNews.delete(req.params);
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

router.delete('/deleteUser/:id', async (req, res, next) => {
  try {
    const result = await ctrlUsers.delete(req.params);
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

module.exports = router;
