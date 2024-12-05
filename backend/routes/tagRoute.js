import express from "express";
import { isAuthenticated } from "../utils/verifyToken.js";
import {
  createTag,
  getAllTags,
  getByTag,
} from "../controllers/tagController.js";

const router = express.Router();

router.post("/create", isAuthenticated, createTag);
router.get("/getAll", isAuthenticated, getAllTags);
router.get("/get-By-Tag/:tag", getByTag);

export default router;
