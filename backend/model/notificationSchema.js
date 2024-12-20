import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["comment", "like", "follow", "reply", "bookmark"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: String,
    read: {
      type: Boolean,
      default: false,
    },
    relatedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    relatedBlog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
    relatedComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
