import mongoose, { Schema } from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true, // Ensure each tag is unique
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: 150,
    },
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog", // Reference to blogs associated with this tag
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // Users who are following this tag
      },
    ],
    tag_used_count: {
      type: Number,
      default: 0,
      index: true, // Helpful for finding trending tags
    },
    meta: {
      total_views: {
        type: Number,
        default: 0,
      },
      total_followers: {
        type: Number,
        default: 0,
      },
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// // Pre-save middleware to auto-generate the slug from the tag name
// tagSchema.pre("save", function (next) {
//   if (!this.slug) {
//     this.slug = this.name
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-") // Replace spaces and special chars with hyphens
//       .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
//   }
//   next();
// });

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
