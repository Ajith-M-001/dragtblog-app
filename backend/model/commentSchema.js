import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      maxlength: 100,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the user who wrote the comment
      required: true,
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog", // Reference to the blog post being commented on
      required: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment", // Optional reference to a parent comment for threaded replies
      default: null,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment", // Store references to replies to this comment
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    level: {
      type: Number,
      default: 0, // 0 for parent comments, 1 for first-level replies, 2 for second-level replies
    },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
