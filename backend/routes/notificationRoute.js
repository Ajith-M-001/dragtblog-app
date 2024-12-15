import express from "express";
import { isAuthenticated } from "../utils/verifyToken.js";
import {
  getNewNotification,
  getNotification,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/new-notification", isAuthenticated, getNewNotification);
router.get("/get-notification", isAuthenticated, getNotification);
router.put("/mark-as-read/:notificationId", isAuthenticated, markAsRead);

export default router;
