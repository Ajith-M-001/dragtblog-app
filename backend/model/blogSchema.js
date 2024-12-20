import mongoose, { Schema } from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: Schema.Types.Mixed,
    },
    banner: {
      url: String,
    },
    metaDescription: {
      type: String,
      maxlength: 200,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
    },
    scheduledDate: {
      type: Date,
    },

    //tags should have been id ref to tags , to do aggrigate

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        index: true,
      },
    ],
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },

    //same categories should have been id ref to aggregate
    categories: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    readingTime: {
      minutes: {
        type: Number,
        default: 0,
      },
      words: {
        type: Number,
        default: 0,
      },
    },
    bookmarkedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blogActivity: {
      total_views: {
        type: Number,
        default: 0,
      },
      total_likes: {
        type: Number,
        default: 0,
      },
      total_comments: {
        type: Number,
        default: 0,
      },
      total_shares: {
        type: Number,
        default: 0,
      },
      total_bookmarks: {
        type: Number,
        default: 0,
      },
      total_replies: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
