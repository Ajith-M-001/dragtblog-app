import express from "express";
import { upload } from "../config/cloudinaryConfig.js";
import {
  uploadImage,
  publishBlog,
  getLatestBlogs,
  getTrendingBlogs,
  getUniqueCategories,
  getBlogs,
  searchBlogs,
  getBlogBySlug,
  getSimilarBlogs,
  editBlog,
} from "../controllers/blogController.js";
import { isAuthenticated } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/upload-image", upload.single("image"), uploadImage);
router.post("/publish-blog", isAuthenticated, publishBlog);

router.get("/get-latest-blogs", getLatestBlogs);
router.get("/get-trending-blogs", getTrendingBlogs);
router.get("/get-unique-categories", getUniqueCategories);
router.get("/getBlogs", getBlogs)
router.get("/search-blogs", searchBlogs);
router.get("/get-blog-by-slug/:slug", getBlogBySlug);
router.get("/get-similar-blogs/:slug", getSimilarBlogs);
router.put("/edit-blog/:slug", isAuthenticated, editBlog);

export default router;
