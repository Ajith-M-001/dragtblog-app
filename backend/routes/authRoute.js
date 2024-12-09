import express from "express";
import {
  signup,
  signin,
  logout,
  verifyOTP,
  resendOTP,
  googleCallback,
  getUserProfile,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  searchUser,
  getUserByUsername,
  // addLikedPostField,
} from "../controllers/authControllers.js";
import passport from "passport";
import { isAuthenticated } from "../utils/verifyToken.js";

const router = express.Router();

// Route for user signup
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", isAuthenticated, logout);
router.put("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.get("/user/profile", isAuthenticated, getUserProfile);
router.get("/search-user", searchUser);
router.get("/getUser/:username", getUserByUsername);

router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.put("/reset-password", resetPassword);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    access_type: "offline",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallback
);

// router.put("/addlikedpostfield", isAuthenticated, addLikedPostField);
export default router;
