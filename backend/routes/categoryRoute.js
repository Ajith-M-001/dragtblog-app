import express from "express";
import {
  createCategory,
  getAllCategories,
  getByCategory,
} from "../controllers/categoryController.js";
import { isAuthenticated } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create", isAuthenticated, createCategory);
router.get("/getall", isAuthenticated, getAllCategories);
router.get("/get-By-Category/:category", getByCategory);

export default router;
