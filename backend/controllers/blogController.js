import cloudinary from "../config/cloudinaryConfig.js";
import Blog from "../model/blogSchema.js";
import ApiResponse from "../utils/ApiResponse.js";
import slugify from "slugify"; // Use to generate slugs
import User from "../model/userSchema.js";
import ApiError from "../utils/ApiError.js";
import Category from "../model/categorySchema.js";
import Tag from "../model/tagSchema.js";
import mongoose from "mongoose";
import Notification from "../model/notificationSchema.js";
import Comment from "../model/commentSchema.js";

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError("No image file provided", 404));
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "draftblogapp", // Optional folder name in cloudinary
    });

    res
      .status(200)
      .json(ApiResponse.success(result, "Image uploaded successfully"));
  } catch (error) {
    next(error);
  }
};

export const publishBlog = async (req, res, next) => {
  try {
    const {
      title,
      banner,
      categories,
      tags,
      metaDescription,
      content,
      status,
      scheduledDate,
      readingTime,
    } = req.body;

    if (!title || !banner || !content) {
      return next(new ApiError("Title, banner, and content are required", 400));
    }

    //once user publishers a blog then change user role to author
    // await User.findByIdAndUpdate(req.user._id, {
    //   $set: { role: "author" },
    // });

    if (status === "scheduled" && !scheduledDate) {
      return next(
        new ApiError("Scheduled date is required for scheduled posts", 400)
      );
    }

    if (scheduledDate && new Date(scheduledDate) < new Date()) {
      return next(new ApiError("Scheduled date must be in the future", 400));
    }

    const titleExists = await Blog.findOne({ title });
    if (titleExists) {
      return next(new ApiError("A blog with this title already exists", 400));
    }

    const slug = slugify(title, { lower: true, strict: true });
    // Check if the slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return next(new ApiError("A blog with this title already exists", 400));
    }

    const newBlog = new Blog({
      title,
      slug,
      banner: {
        url: banner.url,
      },
      categories,
      tags,
      metaDescription,
      content,
      status,
      readingTime,
      author: req.user._id,
    });

    const savedBlog = await newBlog.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        publishedPosts: savedBlog._id,
        blogs: savedBlog._id,
      },
      $inc: { "account_info.total_posts": 1 },
      $set: { "account_info.last_post_date": new Date() },
    });

    const category = await Category.findOne({
      category: categories,
    });

    await Category.findByIdAndUpdate(
      category._id,
      {
        $push: { blogs: savedBlog._id },
        $inc: { "meta.total_blogs": 1 },
      },
      { upsert: true }
    );

    if (tags && tags.length > 0) {
      await Promise.all(
        tags.map(async (tagName) => {
          let tag = await Tag.findOne({ tag: tagName });

          // Update the tag with the new blog ID
          await Tag.findByIdAndUpdate(tag._id, {
            $push: { blogs: savedBlog._id },
            $inc: { tag_used_count: 1 },
          });
        })
      );
    }

    res
      .status(200)
      .json(ApiResponse.success(savedBlog, "Blog published successfully"));
  } catch (error) {
    next(error);
  }
};

export const getLatestBlogs = async (req, res, next) => {
  try {
    const { maxLimit = 5, page = 1 } = req.query;
    const skip = (page - 1) * maxLimit;

    const blogs = await Blog.find({ status: "published" })
      .sort({ createdAt: -1 })
      .select(
        "title metaDescription banner slug blogActivity categories createdAt"
      )
      .limit(Number(maxLimit))
      .skip(Number(skip))
      .populate("author", "profilePicture fullName username");

    const totalBlogs = await Blog.countDocuments({ status: "published" });
    const totalPages = Math.ceil(totalBlogs / maxLimit);
    const hasNextPage = page < totalPages;

    res.status(200).json(
      ApiResponse.success(
        {
          blogs,
          currentPage: Number(page),
          totalPages,
          totalBlogs,
          hasNextPage,
          nextPage: hasNextPage ? Number(page) + 1 : null,
        },
        "Latest blogs fetched"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getTrendingBlogs = async (req, res, next) => {
  try {
    const { maxLimit = 5 } = req.query;
    const blogs = await Blog.find({ status: "published" })
      .sort({
        blogActivity: -1,
        createdAt: -1,
      })
      .limit(maxLimit)
      .populate("author", "profilePicture fullName username")
      .select(
        "title metaDescription banner slug blogActivity categories createdAt"
      );

    res.status(200).json(ApiResponse.success(blogs, "Trending blogs fetched"));
  } catch (error) {
    next(error);
  }
};

export const getUniqueCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().select("category");
    res
      .status(200)
      .json(ApiResponse.success(categories, "Unique categories fetched"));
  } catch (error) {
    next(error);
  }
};

export const getBlogs = async (req, res, next) => {
  try {
    const { category, order, tag, maxLimit } = req.query;

    console.log("dfas", category, order, tag, maxLimit);

    // Parse query parameters
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(10, parseInt(req.query.limit, 10) || 10)
    );
    const sortDirection = order === "asc" ? 1 : -1;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build query object
    const query = { status: "published" }; // Add status filter

    let categoryDetails = null;

    // Optional category filter
    if (category && typeof category === "string") {
      const trimmedCategory = category.trim();
      query.categories = trimmedCategory;
      categoryDetails = await Category.findOne({
        category: trimmedCategory,
      }).select("meta category");
      if (!categoryDetails) {
        return next(new ApiError(404, "Category not found"));
      }
    }

    // Fetch blogs with pagination
    const [blogs, totalBlogs] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: sortDirection })
        .skip(skip)
        .limit(limit)
        .select(
          "title slug banner categories createdAt metaDescription blogActivity"
        )
        .populate("author", "profilePicture fullName username")
        .lean(),
      Blog.countDocuments(query),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalBlogs / limit);
    const hasNextPage = page < totalPages;

    // Structured response for infinite scroll
    res.status(200).json(
      ApiResponse.success(
        {
          blogs,
          categoryDetails,
          pagination: {
            currentPage: page,
            totalPages,
            totalBlogs,
            hasNextPage,
            nextPage: hasNextPage ? page + 1 : null,
          },
        },
        "Blogs fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const searchBlogs = async (req, res, next) => {
  try {
    const { query: searchQuery, order, maxLimit = 5, page = 1 } = req.query;
    const query = { status: "published" };
    const sortDirection = order === "asc" ? 1 : -1;
    const skip = (page - 1) * maxLimit;

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { metaDescription: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
        { categories: { $regex: searchQuery, $options: "i" } },
        { tags: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const [blogs, totalBlogs, categories, tags] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: sortDirection })
        .skip(skip)
        .limit(maxLimit)
        .select(
          "title slug banner categories createdAt metaDescription blogActivity"
        )
        .populate("author", "profilePicture fullName username"),
      Blog.countDocuments(query),
      Category.find({
        category: { $regex: searchQuery, $options: "i" },
      }).select("category"),
      Tag.find({ tag: { $regex: searchQuery, $options: "i" } }).select("tag"),
    ]);

    const totalPages = Math.ceil(totalBlogs / maxLimit);
    const hasNextPage = page < totalPages;

    const nextPage = hasNextPage ? page + 1 : null;

    const pagination = {
      currentPage: page,
      totalPages,
      totalBlogs,
      hasNextPage,
      nextPage,
    };

    res
      .status(200)
      .json(
        ApiResponse.success(
          { blogs, categories, tags, totalBlogs, pagination },
          "Blogs fetched successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const { draft, mode } = req.query;

    console.log("dfas", draft, mode);

    const incrementViews = mode === "edit" ? 0 : 1;
    const blog = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { "blogActivity.total_views": incrementViews } },
      { new: true }
    ).populate(
      "author",
      "profilePicture fullName username likedBlogs followers"
    );

    await User.findByIdAndUpdate(blog.author._id, {
      $inc: { "account_info.total_reads": incrementViews },
    });

    res
      .status(200)
      .json(ApiResponse.success(blog, "Blog fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getSimilarBlogs = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { maxLimit = 3 } = req.query;
    console.log("dfas", slug);
    const blog = await Blog.findOne({ slug });
    const similarBlogs = await Blog.find({
      categories: { $in: blog.categories },
      _id: { $ne: blog._id },
    })
      .sort({ createdAt: -1 })
      .select(
        "title slug banner categories createdAt metaDescription blogActivity"
      )
      .limit(maxLimit)
      .populate("author", "profilePicture fullName username");

    res
      .status(200)
      .json(ApiResponse.success(similarBlogs, "Similar blogs fetched"));
  } catch (error) {
    next(error);
  }
};

export const editBlog = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const {
      title,
      banner,
      categories,
      tags,
      metaDescription,
      content,
      status,
      scheduledDate,
      readingTime,
    } = req.body;

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return next(new ApiError("Blog not found", 404));
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blog._id,
      {
        title,
        banner,
        categories,
        tags,
        metaDescription,
        content,
        status,
        scheduledDate,
        readingTime,
      },
      { new: true }
    );

    res
      .status(200)
      .json(ApiResponse.success(updatedBlog, "Blog updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const likeBlog = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { slug } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findOne({ slug }).populate("author");
    console.log("blog", blog);
    if (!blog) {
      return next(new ApiError("Blog not found", 404));
    }

    const alreadyLiked = blog.likedBy.includes(userId);
    if (alreadyLiked) {
      await Blog.findByIdAndUpdate(blog._id, {
        $pull: { likedBy: userId },
        $inc: { "blogActivity.total_likes": -1 },
      });
      await User.findByIdAndUpdate(userId, {
        $pull: { likedBlogs: blog._id },
      });

      // Remove the like notification if it exists

      await Notification.findOneAndDelete(
        {
          recipient: blog.author._id,
          type: "like",
          relatedUser: userId,
          relatedBlog: blog._id,
        },
        { session }
      );
    } else {
      await Blog.findByIdAndUpdate(blog._id, {
        $push: { likedBy: userId },
        $inc: { "blogActivity.total_likes": 1 },
      });
      await User.findByIdAndUpdate(userId, {
        $push: { likedBlogs: blog._id },
      });

      // Create a notification for the blog author
      if (blog.author._id.toString() !== userId.toString()) {
        await Notification.create(
          [
            {
              recipient: blog.author._id,
              type: "like",
              title: "New Blog Like",
              message: `${req.user.fullName} liked your blog "${blog.title}"`,
              link: `/blog/${blog.slug}`,
              relatedUser: userId,
              relatedBlog: blog._id,
            },
          ],
          { session }
        );
      }
    }

    const customMessage = alreadyLiked ? "unliked" : "liked";

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json(ApiResponse.success(null, `Blog ${customMessage} successfully`));
  } catch (error) {
    // Abort the transaction
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const userWrittenBlogs = async (req, res, next) => {
  try {
    const id = req.user._id;
    const { maxLimit = 5, page = 1, order = "desc", status, title } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(maxLimit) || 5;
    const skip = (pageNumber - 1) * limit;

    const query = { author: id };
    if (status) {
      query.status = status;
    }
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: order === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .select(
        "title slug banner categories createdAt metaDescription blogActivity "
      )
      .populate("author", "profilePicture fullName username");

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);
    const hasNextPage = pageNumber < totalPages;

    const responseObject = {
      blogs,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalBlogs,
        hasNextPage,
        nextPage: hasNextPage ? pageNumber + 1 : null,
      },
    };

    res
      .status(200)
      .json(ApiResponse.success(responseObject, "Blogs fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId).session(session);

    if (!blog) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Blog not found" });
    }

    await Comment.deleteMany({ blog: blogId }).session(session);
    await Notification.deleteMany({ relatedBlog: blogId }).session(session);

     await User.updateMany(
       { bookmarks: blogId },
       { $pull: { bookmarks: blogId } }, // Remove blogId from bookmarks
       { session }
     );

    await User.updateMany(
      {},
      {
        $pull: {
          blogs: blogId,
          publishedPosts: blogId,
        },
      },
      { session }
    );

    await Category.findOneAndUpdate(
      { blogs: blogId },
      {
        $pull: { blogs: blogId },
        $inc: { "meta.total_blogs": -1 },
      },
      { session }
    );

    await Tag.updateMany(
      { blogs: blogId },
      {
        $pull: { blogs: blogId },
        $inc: { tag_used_count: -1 },
      },
      { session }
    );

    const deletedBlog = await Blog.findByIdAndDelete(blogId).session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json(ApiResponse.success(null, "blog deleted successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const bookmarkBlog = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { slug } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return next(new ApiError("Blog not found", 404));
    }

    const alreadyBookmarked = blog.bookmarkedBy.includes(userId);
    if (alreadyBookmarked) {
      await Blog.findByIdAndUpdate(blog._id, {
        $pull: { bookmarkedBy: userId },
      });
      await User.findByIdAndUpdate(userId, {
        $pull: { bookmarks: blog._id },
      });
    } else {
      await Blog.findByIdAndUpdate(blog._id, {
        $push: { bookmarkedBy: userId },
      });
      await User.findByIdAndUpdate(userId, {
        $push: { bookmarks: blog._id },
      });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json(
        ApiResponse.success(
          null,
          `Blog ${
            alreadyBookmarked ? "unbookmarked" : "bookmarked"
          } successfully`
        )
      );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
