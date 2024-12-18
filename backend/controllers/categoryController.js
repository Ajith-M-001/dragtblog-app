import Category from "../model/categorySchema.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import slugify from "slugify";
import User from "../model/userSchema.js";

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

export const getByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    console.log("category", category);
    const categoryData = await Category.findOne({ category });
    console.log("categoryData", categoryData);
    return res
      .status(200)
      .json(
        ApiResponse.success(categoryData, "Category fetched successfully", 200)
      );
  } catch (error) {
    next(error);
  }
};

export const followCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const currentUserId = req.user._id;

    // Add category to the followingCategories array
    await User.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { followingCategories: categoryId } },
      { new: true }
    );

    // Add user to the followers array of the category
    await Category.findByIdAndUpdate(
      categoryId,
      { $addToSet: { followers: currentUserId } },
      { new: true }
    );
    res
      .status(200)
      .json(ApiResponse.success(null, "You are now following the category"));
  } catch (error) {
    res.status(500).json({ message: "Failed to follow category.", error });
  }
};


export const unfollowCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const currentUserId = req.user._id;

    // Remove category from the followingCategories array
    await User.findByIdAndUpdate(
      currentUserId,
      { $pull: { followingCategories: categoryId } },
      { new: true }
    );

    // Remove user from the followers array of the category
    await Category.findByIdAndUpdate(
      categoryId,
      { $pull: { followers: currentUserId } },
      { new: true }
    );

    res
      .status(200)
      .json(ApiResponse.success(null, "You have unfollowed the category"));
  } catch (error) {
    res.status(500).json({ message: "Failed to unfollow category.", error });
  }
};
