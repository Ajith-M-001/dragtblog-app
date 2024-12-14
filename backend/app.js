import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import { notFound } from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import connectDB from "./config/connectDB.js";
import cors from "cors";
import passport from "passport";
import "./config/passport.js";
import session from "express-session";
import cookieParser from "cookie-parser"; // Add this import
import blogRoute from "./routes/blogRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import tagRoute from "./routes/tagRoute.js";
import commentRoute from "./routes/commentRoute.js";
import notificationRoute from "./routes/notificationRoute.js";


// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL_PRODUCTION
      : process.env.FRONTEND_URL_DEVELOPMENT,
  credentials: true, // Important for cookies/authentication
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Enable pre-flight requests for all routes
app.options("*", cors(corsOptions));

// Add session middleware BEFORE passport.initialize()
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 12 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
// Add cookie-parser middleware BEFORE routes
app.use(cookieParser());

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to Blogify API!");
});

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/tag", tagRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/notification", notificationRoute);
// Catch all undefined routes
app.use(notFound);

// Global error handling middleware (after all other middlewares and routes)
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Error starting server:", error);
    process.exit(1);
  }
};

start();

export default app;
