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
  likeBlog,
  editBlog,
  userWrittenBlogs,
  deleteBlog,
  bookmarkBlog,
  // getPersonalizedBlogs,
  getMonthlyPerformanceTrends,
} from "../controllers/blogController.js";
import { isAuthenticated } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/upload-image", upload.single("image"), uploadImage);
router.post("/publish-blog", isAuthenticated, publishBlog);

router.get("/get-latest-blogs", getLatestBlogs);
router.get("/get-trending-blogs", getTrendingBlogs);
router.get("/get-unique-categories", getUniqueCategories);
router.get("/getBlogs", getBlogs);
router.get("/search-blogs", searchBlogs);
router.get("/get-blog-by-slug/:slug", getBlogBySlug);
router.get("/get-similar-blogs/:slug", getSimilarBlogs);
router.put("/edit-blog/:slug", isAuthenticated, editBlog);
router.put("/like-blog/:slug", isAuthenticated, likeBlog);
router.get("/user-written-blogs", isAuthenticated, userWrittenBlogs);
router.delete("/delete-blogs/:id", isAuthenticated, deleteBlog);
router.put("/bookmarkBlog/:slug", isAuthenticated, bookmarkBlog);
// router.get("/personalized-blogs", isAuthenticated, getPersonalizedBlogs);
router.get(
  "/monthly-performance",
  isAuthenticated,
  getMonthlyPerformanceTrends
);

export default router;
