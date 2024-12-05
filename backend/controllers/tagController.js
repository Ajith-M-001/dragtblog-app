import slugify from "slugify";
import Tag from "../model/tagSchema.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createTag = async (req, res, next) => {
  try {
    const { tag, description } = req.body;
    const userId = req.user;

    if (!tag) {
      return next(new ApiError(400, "Tag name is required"));
    }

    if (!userId || !userId._id) {
      return next(new ApiError(400, "User not authenticated"));
    }

    const slug = slugify(tag, { lower: true, strict: true });

    const existingTag = await Tag.findOne({ slug });
    if (existingTag) {
      return next(new ApiError(400, "Tag already exists"));
    }

    const newTag = new Tag({
      tag,
      slug,
      description: description || "",
      created_by: userId._id,
      meta: {
        total_views: 0,
        total_followers: 0,
      },
    });

    const savedTag = await newTag.save();

    return res
      .status(201)
      .json(ApiResponse.success(savedTag, "Tag created successfully", 201));
  } catch (error) {
    next(error);
  }
};

export const getAllTags = async (req, res, next) => {
  try {
    const tags = await Tag.find();
    return res
      .status(200)
      .json(ApiResponse.success(tags, "Tags fetched successfully", 200));
  } catch (error) {
    next(error);
  }
};

export const getByTag = async (req, res, next) => {
  try {
    const { tag } = req.params;
    const tagData = await Tag.findOne({ tag });
    return res
      .status(200)
      .json(ApiResponse.success(tagData, "Tag fetched successfully", 200));
  } catch (error) {
    next(error);
  }
};
