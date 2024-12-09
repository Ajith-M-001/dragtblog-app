import express from "express";
import { addComment, getComments } from "../controllers/commentController.js";
import { isAuthenticated } from "../utils/verifyToken.js";
const router = express.Router();

router.post("/add-comment/:slug", isAuthenticated, addComment);
router.get("/get-comments/:slug", getComments);

export default router;
