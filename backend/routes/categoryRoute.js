import express from "express";
import {
  createCategory,
  getAllCategories,
} from "../controllers/categoryController.js";
import { isAuthenticated } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create", isAuthenticated, createCategory);
router.get("/getall", isAuthenticated, getAllCategories);

export default router;
