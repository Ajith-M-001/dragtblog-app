import express from "express";
import {
  addComment,
  getComments,
  editComment,
  deleteComment,
} from "../controllers/commentController.js";
import { isAuthenticated } from "../utils/verifyToken.js";
const router = express.Router();

router.post("/add-comment/:slug", isAuthenticated, addComment);
router.get("/get-comments/:slug", getComments);
router.put("/edit-comment/:commentId", isAuthenticated, editComment);
router.delete("/delete-comment/:commentId", isAuthenticated, deleteComment);
export default router;
