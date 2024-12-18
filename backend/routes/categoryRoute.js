import express from "express";
import {
  createCategory,
  getAllCategories,
  getByCategory,
  followCategory,
  unfollowCategory,
} from "../controllers/categoryController.js";
import { isAuthenticated } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create", isAuthenticated, createCategory);
router.get("/getall", isAuthenticated, getAllCategories);
router.get("/get-By-Category/:category", getByCategory);
router.put("/followcategory/:categoryId", isAuthenticated, followCategory);
router.put("/unfollowcategory/:categoryId", isAuthenticated, unfollowCategory);


export default router;
