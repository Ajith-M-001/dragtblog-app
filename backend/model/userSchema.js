import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true },
    password: {
      type: String,
    },
    username: {
      type: String,
      minlength: [3, "Username must be 3 letters long"],
      unique: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Author", "Subscriber", "Reader"],
      default: "Reader",
    },
    bio: { type: String },
    profilePicture: {
      type: String,
      default:
        "https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg",
    },
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: String, index: true },
    verificationOTPExpiry: { type: Date },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followingCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    ],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    drafts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    publishedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    followingTags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tags" }],
    googleId: { type: String, sparse: true, unique: true }, // For OAuth with Google
    resetPasswordOTP: { type: String, index: true },
    resetPasswordOTPExpiry: { type: Date },
    social_links: {
      youtube: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
    account_info: {
      total_posts: { type: Number, default: 0 },
      total_reads: { type: Number, default: 0 },
      total_likes: { type: Number, default: 0 },
      total_comments: { type: Number, default: 0 },
      post_engagement_rate: { type: Number, default: 0 },
      views_this_month: { type: Number, default: 0 },
      last_post_date: { type: Date },
    },
    likedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "blogs" }],
    blogs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "blogs",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
