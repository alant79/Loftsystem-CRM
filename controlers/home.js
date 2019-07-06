const fs = require("fs");
const path = require("path");
const User = require('../db/models/user');

module.exports.post = function(req, res) {
  try {
    console.log(req.body);
    const { username, password } = req.body;
    res.send({
      access_token: "fghfghfghfgh",
      firstName: "fhfghf",
      id: 1,
      image: "",
      middleName: "hfghfgh",
      permission: {
        chat: { C: true, R: true, U: true, D: true },
        news: { C: true, R: true, U: true, D: true },
        setting: { C: true, R: true, U: true, D: true }
      },
      permissionId: 1,
      surName: "fghfghfg",
      username: "fghfghf"
    });
  } catch (err) {
    const status = 500;
    res.status(status).render("error", { status, message: err });
  }
};
