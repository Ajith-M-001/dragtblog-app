import express from "express";
import { isAuthenticated } from "../utils/verifyToken.js";
import {
  createTag,
  getAllTags,
  followTag,
  getByTag,
  unfollowTag,
} from "../controllers/tagController.js";

const router = express.Router();

router.post("/create", isAuthenticated, createTag);
router.get("/getAll", isAuthenticated, getAllTags);
router.get("/get-By-Tag/:tag", getByTag);
router.put("/followtag/:tagId", isAuthenticated, followTag);
router.put("/unfollowtag/:tagId", isAuthenticated, unfollowTag);

export default router;
