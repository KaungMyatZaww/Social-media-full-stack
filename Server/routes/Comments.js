const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddreware");

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comments.findAll({ where: { PostId: postId } });
  res.json(comments);
});

router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  const username = req.user.username;
  comment.username = username;
  try {
    // Create a new comment in the database
    const newComment = await Comments.create(comment);

    // Log the new comment to verify it has an ID
    console.log("New Comment created:", newComment);

    // Return the created comment object with the ID
    res.json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the comment" });
  }
});

router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;
  await Comments.destroy({ where: { id: commentId } });
  res.json("Comment deleted success");
});

module.exports = router;
