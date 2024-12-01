import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    description: {
      type: String,
      maxlength: 100,
    },
    meta: {
      total_blogs: {
        type: Number,
        default: 0,
      },
      total_followers: {
        type: Number,
        default: 0,
      },
      total_views: {
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

const Category = mongoose.model("Category", categorySchema);
export default Category;

// categorySchema.pre("save", function (next) {
//   if (!this.slug) {
//     this.slug = this.name
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-") // Replace spaces and special chars with hyphens
//       .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
//   }
//   next();
// });
