import User from "../model/userSchema.js";
import ApiResponse from "./ApiResponse.js";
import jwt from "jsonwebtoken"; // Add this import

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res
        .status(401)
        .json(ApiResponse.error("Authentication required", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json(ApiResponse.error("User not found", 401));
    }

    req.user = user;
    next();
  } catch (error) {
     res.clearCookie("access_token", {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production", // Secure in production
       sameSite: "strict", // CSRF protection
     });
    return res
      .status(401)
      .json(ApiResponse.error("Invalid or expired token", 401));
  }
};
