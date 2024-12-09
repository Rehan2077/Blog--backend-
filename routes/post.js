import express from "express";

import { isAdmin, isAuthenticated } from "../middleware/auth.js";
import {
  createPost,
  deletePost,
  generatePostContent,
  getAllPosts,
  getPost,
  likePost,
  updatePost,
} from "../controllers/post.js";

const router = express.Router();

router
  .route("/")
  .get(getAllPosts)
  .post(isAuthenticated, isAdmin, createPost);

router
  .route("/:slug")
  .get(getPost)
  .put(isAuthenticated, isAdmin, updatePost)
  .delete(isAuthenticated, isAdmin, deletePost)
  .patch(isAuthenticated, likePost);

router.route("/generate").post(isAuthenticated, isAdmin, generatePostContent);

export default router;