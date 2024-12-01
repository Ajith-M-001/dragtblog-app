import Category from "../model/categorySchema.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import slugify from "slugify";

export const createCategory = async (req, res, next) => {
  try {
    const { categories: category } = req.body;

    if (!category) {
      return next(new ApiError(400, "Category name is required"));
    }

    const existingCategory = await Category.findOne({ category });
    if (existingCategory) {
      return next(new ApiError(400, "Category already exists"));
    }

    // Generate slug from name
    const slug = slugify(category, {
      lower: true, // Convert to lowercase
      strict: true, // Remove special characters
    });

    const newCategory = new Category({ category, slug });
    await newCategory.save();
    return res
      .status(201)
      .json(
        ApiResponse.success(newCategory, "Category created successfully", 201)
      );
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .select("-createdAt -updatedAt -blogs")
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json(
        ApiResponse.success(categories, "Categories fetched successfully", 200)
      );
  } catch (error) {
    next(error);
  }
};
