import express from "express";

import { isAuthenticated } from "../middleware/auth.js";
import { createComment, deleteComment, getAllComments, updateComment } from "../controllers/comment.js";


const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, getAllComments)
  .post(isAuthenticated, createComment)

  router.route("/:commentId")
  .put(isAuthenticated, updateComment)
  .delete(isAuthenticated, deleteComment)

export default router;
