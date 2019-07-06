var express = require('express');
var router = express.Router();

const usersCtrl = require('../../controllers/users');

const errorHandler = (err, res) => {
  console.error("err", err);
  res.status(err.statusCode || 500).json({
    message: err ? (err.message || err).toString() : "Internal Error"
  });
}

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const result = await usersCtrl.getAll();
    res.json({
      data: result
    });
  }
  catch (err) {
    errorHandler(err, res);
  }
});

router.post('/', async (req, res) => {
  try {
    const result = await usersCtrl.add({ ...req.body });
    res.json({
      data: result
    });
  }
  catch (err) {
    errorHandler(err, res);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await usersCtrl.get({ ...req.params });
    res.json({
      data: result
    });
  }
  catch (err) {
    errorHandler(err, res);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const result = await usersCtrl.update({ ...req.params, ...req.body });
    res.json({
      data: result
    });
  }
  catch (err) {
    errorHandler(err, res);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await usersCtrl.delete({ ...req.params });
    res.json({
      data: result
    });
  }
  catch (err) {
    errorHandler(err, res);
  }
});


module.exports = router;
