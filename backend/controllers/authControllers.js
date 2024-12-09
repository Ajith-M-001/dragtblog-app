import User from "../model/userSchema.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import {
  sendPasswordResetOTP,
  sendVerificationCode,
  sendWelcomeEmail,
} from "../middleware/Email.js";
import { CACHE_KEYS, CACHE_TTL, cacheUtils } from "../config/redisConfig.js";
import Blog from "../model/blogSchema.js";

export const signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json(ApiResponse.error("Request fields can't be empty.", 400));
    }
    // Generate a username from email (new addition)
    const username = email.split("@")[0];

    // Check if a user with the same email or username already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json(ApiResponse.error("Email or username already exists.", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 11);

    const verificationOTP = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Add OTP expiry time (10 minutes from now)
    // const verificationOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const verificationOTPExpiry = new Date(Date.now() + 2 * 60 * 1000);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
      username,
      verificationOTP,
      verificationOTPExpiry,
    });

    sendVerificationCode(user.email, verificationOTP);

    // Method 2: Fetch user without password
    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );

    // Send success response
    return res
      .status(201)
      .json(
        ApiResponse.success(
          { email: user.email },
          "Account created successfully, Please verify your email with OTP sent.",
          201
        )
      );
  } catch (error) {
    // Handle any other errors that occur during the signup process
    next(new ApiError(500, "An error occurred during signup.")); // Create a custom error
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check for missing fields
    if (!email || !password) {
      return res
        .status(401)
        .json(ApiResponse.error("Invalid email or password", 401));
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res
        .status(401)
        .json(ApiResponse.error("Invalid email or password", 401));
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json(ApiResponse.error("Please verify your email to login", 403));
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json(ApiResponse.error("Invalid email or password", 401));
    }

    // Generate token
    const token = generateToken({ userId: user._id });

    // Set cookie with token
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure flag in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
    });

    // Send success response without password
    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );
    return res
      .status(200)
      .json(
        ApiResponse.success(userWithoutPassword, "Logged in successfully", 200)
      );
  } catch (error) {
    // Pass the error to the next middleware with a standardized response
    next(new ApiError(500, "An error occurred during sign in.")); // Create a custom error
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the access_token cookie
    const userId = req.user._id;
    cacheUtils.del(`${CACHE_KEYS.USER_PROFILE}${userId}`),
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "strict", // CSRF protection
      });

    return res
      .status(200)
      .json(ApiResponse.success(null, "Logged out successfully", 200));
  } catch (error) {
    return res
      .status(500)
      .json(ApiResponse.error("An error occurred during logout", 500));
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, verificationOTP } = req.body;

    // Find user with valid OTP and non-expired OTP
    const user = await User.findOne({
      email,
      verificationOTP,
      verificationOTPExpiry: { $gt: new Date() },
    }).select("email fullName isVerified");

    // Handle invalid or expired OTP in one step
    if (!user) {
      return res
        .status(401)
        .json(ApiResponse.error("Invalid or expired OTP", 401));
    }

    // Update user's verification status and clear OTP fields
    await User.findByIdAndUpdate(user._id, {
      $set: { isVerified: true },
      $unset: { verificationOTP: 1, verificationOTPExpiry: 1 },
    });

    // Send welcome email asynchronously without blocking response
    sendWelcomeEmail(user.email, user.fullName).catch((err) => {
      console.error(`Failed to send welcome email to ${user.email}:`, err);
    });

    // Respond with success message
    return res
      .status(200)
      .json(ApiResponse.success({}, "OTP verified successfully", 200));
  } catch (error) {
    // Handle unexpected errors
    return res
      .status(500)
      .json(
        ApiResponse.error("An error occurred during OTP verification", 500)
      );
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email, isPasswordReset = false } = req.body;

    if (!email) {
      return res.status(400).json(ApiResponse.error("Email is required", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json(ApiResponse.error("email not found", 404));
    }

    // Generate new OTP
    const verificationOTP = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Set new expiry time (10 minutes)
    const OTPExpiry = new Date(Date.now() + 2 * 60 * 1000);

    if (isPasswordReset) {
      // Handle password reset OTP
      user.resetPasswordOTP = verificationOTP;
      user.resetPasswordOTPExpiry = OTPExpiry;
      await user.save();

      // Send password reset OTP
      await sendPasswordResetOTP(user.email, verificationOTP);
    } else {
      // Handle email verification OTP
      if (user.isVerified) {
        return res
          .status(400)
          .json(ApiResponse.error("Email is already verified", 400));
      }

      // Update user with new OTP and expiry
      user.verificationOTP = verificationOTP;
      user.verificationOTPExpiry = OTPExpiry;
      await user.save();

      // Send verification OTP
      sendVerificationCode(user.email, verificationOTP);
    }

    return res
      .status(200)
      .json(ApiResponse.success({}, "OTP resent successfully", 200));
  } catch (error) {
    return res
      .status(500)
      .json(ApiResponse.error("An error occurred while resending OTP", 500));
  }
};

export const googleCallback = async (req, res) => {
  try {
    // Generate token
    const userId = req.user;
    const token = generateToken({ userId: userId._id });

    // Set cookie with token
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 12 * 60 * 60 * 1000,
    });

    const FRONTEND_URL =
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL_PRODUCTION
        : process.env.FRONTEND_URL_DEVELOPMENT;

    // Redirect to frontend success page
    res.redirect(`${FRONTEND_URL}/auth/redirect=/`);
  } catch (error) {
    res.redirect(`${FRONTEND_URL}/auth/failure`);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const cacheKey = `${CACHE_KEYS.USER_PROFILE}${req.user._id}`;
    const cachedUser = await cacheUtils.get(cacheKey);
    if (cachedUser) {
      return res
        .status(200)
        .json(
          ApiResponse.success(
            cachedUser,
            "User profile fetched from cache",
            200
          )
        );
    }
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json(ApiResponse.error("User not found", 404));
    }

    await cacheUtils.set(cacheKey, user, CACHE_TTL.USER_PROFILE);

    return res
      .status(200)
      .json(
        ApiResponse.success(user, "User profile fetched successfully1", 200)
      );
  } catch (error) {
    return res
      .status(500)
      .json(ApiResponse.error("Error fetching user profile", 500));
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(404).json(ApiResponse.error("Email required", 404));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(ApiResponse.error("Email not found", 404));
    }

    const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const resetOTPExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    user.resetPasswordOTP = resetOTP;
    user.resetPasswordOTPExpiry = resetOTPExpiry;
    await user.save();

    await sendPasswordResetOTP(user.email, resetOTP);

    return res
      .status(200)
      .json(
        ApiResponse.success(
          { email: user.email },
          "Password reset OTP sent successfully",
          200
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(ApiResponse.error("Error fetching user profile", 500));
  }
};

export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json(ApiResponse.error("Email and OTP required", 400));
    }
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(404)
        .json(ApiResponse.error("Invalid or expired OTP", 401));
    }

    // Clear the OTP fields but don't save yet (will save when password is reset)
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    await user.save();

    return res
      .status(200)
      .json(
        ApiResponse.success(
          { email: user.email },
          "OTP verified successfully",
          200
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        ApiResponse.error("An error occurred during OTP verification", 500)
      );
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json(ApiResponse.error("Email and password required", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 11);
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: { password: hashedPassword },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json(ApiResponse.error("Email not found", 404));
    }

    return res
      .status(200)
      .json(ApiResponse.success(null, "Password reset successfully", 200));
  } catch (error) {
    return res
      .status(500)
      .json(ApiResponse.error("An error occurred during password reset", 500));
  }
};

export const searchUser = async (req, res, next) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      fullName: { $regex: query, $options: "i" },
      username: { $regex: query, $options: "i" },
      email: { $regex: query, $options: "i" },
    })
      .select("profilePicture fullName username bio")
      .limit(10)
      .lean();
    res.status(200).json(ApiResponse.success(users, "Search successful", 200));
  } catch (error) {
    next(new ApiError(500, "An error occurred during search"));
  }
};

export const getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 5 } = req.query; // Get page and limit from query params

    const user = await User.findOne({ username }).select(
      "fullName profilePicture username bio followers following account_info.total_posts account_info.total_likes "
    );

    if (!user) {
      return res.status(404).json(ApiResponse.error("User not found", 404));
    }

    // Calculate the count of followers and following
    const followersCount = user.followers.length;
    const followingCount = user.following.length;
    const totalBlogs = await Blog.countDocuments({ author: user._id });

    const blogs = await Blog.find({ author: user._id })
      .select(
        "title metaDescription banner slug blogActivity categories createdAt"
      )
      .sort({ createdAt: -1 })
      .populate("author", "profilePicture fullName username")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(totalBlogs / limit);
    const hasNextPage = page < totalPages;

    // Add the counts to the user object
    const userWithCounts = {
      ...user.toObject(),
      followersCount,
      followingCount,
      blogs,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalBlogs,
        hasNextPage,
        nextPage: hasNextPage ? Number(page) + 1 : null,
      },
    };

    res
      .status(200)
      .json(
        ApiResponse.success(userWithCounts, "User fetched successfully", 200)
      );
  } catch (error) {
    next(new ApiError(500, "An error occurred during search"));
  }
};
















































































// export const addLikedPostField = async (req, res, next) => {
//   try {
//     const userId = req.user._id;
//     await User.findByIdAndUpdate(userId, {
//       $set: { likedBlogs: [] },
//     });
//     res
//       .status(200)    
//       .json(
//         ApiResponse.success(null, "Liked post field added successfully")
//       );
//   } catch (error) {
//     next(new ApiError(500, "An error occurred during adding liked post field"));
//   }
// };
