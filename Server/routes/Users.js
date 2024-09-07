const express = require("express");
const router = express.Router();
const { Users } = require("../models");
// bcryptjs Install??
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddreware");

const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
    res.json("SUCCES! ! !");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username: username } });

  if (!user) {
    return res.json({ error: "User doesn't exist" });
  }

  bcrypt.compare(password, user.password).then((match) => {
    if (!match) {
      return res.json({ error: "Wrong username or password" });
    }
    const accessToken = sign(
      { username: user.username, id: user.id },
      "importantsecret"
    );
    return res.json({
      token: accessToken,
      username: user.username,
      id: user.id,
    });
  });
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicInfo/:id", async (req, res) => {
  const id = req.params.id;
  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  res.json(basicInfo);
});

module.exports = router;
