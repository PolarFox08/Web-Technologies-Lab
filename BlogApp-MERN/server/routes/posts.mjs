import express from "express";
import { ObjectId } from "mongodb";
import db from "../db/conn.mjs";

const router = express.Router();

// Get all posts (newest first)
router.get("/", async (req, res) => {
  try {
    const results = await db
      .collection("posts")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send({ error: "Failed to fetch posts" });
  }
});

// Get a single post
router.get("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ error: "Invalid post id" });
    }
    const post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).send({ error: "Post not found" });
    res.status(200).send(post);
  } catch (e) {
    res.status(500).send({ error: "Failed to fetch post" });
  }
});

// Create a post
router.post("/", async (req, res) => {
  try {
    const { title, author, content } = req.body;
    if (!title || !author || !content) {
      return res
        .status(400)
        .send({ error: "title, author and content are required" });
    }
    const newPost = { title, author, content, createdAt: new Date() };
    const result = await db.collection("posts").insertOne(newPost);
    res.status(201).send({ ...newPost, _id: result.insertedId });
  } catch (e) {
    res.status(500).send({ error: "Failed to create post" });
  }
});

// Update a post
router.patch("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ error: "Invalid post id" });
    }
    const { title, author, content } = req.body;
    const result = await db
      .collection("posts")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { title, author, content } }
      );
    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Post not found" });
    }
    res.status(200).send({ message: "Post updated" });
  } catch (e) {
    res.status(500).send({ error: "Failed to update post" });
  }
});

// Delete a post
router.delete("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ error: "Invalid post id" });
    }
    const result = await db
      .collection("posts")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Post not found" });
    }
    res.status(200).send({ message: "Post deleted" });
  } catch (e) {
    res.status(500).send({ error: "Failed to delete post" });
  }
});

export default router;
