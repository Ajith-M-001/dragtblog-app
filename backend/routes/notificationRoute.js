import express from "express";
import { isAuthenticated } from "../utils/verifyToken.js";
import { getNewNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/new-notification", isAuthenticated, getNewNotification);

export default router;
