const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddreware");

router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes] });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post);
  res.json(post);
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const postt = await Posts.findByPk(id);
  res.json(postt);
});
router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({ where: { id: postId } });
  res.json("Post deleted success");
});

module.exports = router;
