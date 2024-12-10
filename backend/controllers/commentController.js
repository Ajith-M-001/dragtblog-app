import Blog from "../model/blogSchema.js";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import Comment from "../model/commentSchema.js";
import Notification from "../model/notificationSchema.js";
import ApiResponse from "../utils/ApiResponse.js";

export const addComment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { comment, parentCommentId } = req.body;
    const { slug } = req.params;
    const user = req.user;

    if (!user._id) {
      return next(new ApiError(400, "User not authenticated"));
    }

    // Validate comment
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const blog = await Blog.findOne({ slug }).populate("author");

    if (!blog) {
      return next(new ApiError(400, "Blog not found"));
    }
    console.log(blog);

    let level = 0;
    let parentComment = null;

    if (parentCommentId) {
      if (!mongoose.Types.ObjectId.isValid(parentCommentId)) {
        return next(new ApiError(400, "Invalid parent comment ID"));
      }
      parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return next(new ApiError(400, "Parent comment not found"));
      }
      level = parentComment.level + 1;
    }

    // Create new comment
    const newComment = new Comment({
      comment,
      author: user._id,
      blog: blog._id,
      level,
      parentComment: parentCommentId ? parentCommentId : null,
    });

    // Save comment
    await newComment.save({ session });

    if (parentCommentId) {
      await Blog.findOneAndUpdate(
        { _id: blog._id },
        {
          $inc: { "blogActivity.total_replies": 1 },
          $inc: { "blogActivity.total_comments": 1 },
        },
        { session }
      );
      await Comment.findByIdAndUpdate(
        parentCommentId,
        {
          $push: { replies: newComment._id },
        },
        { session }
      );

      if (newComment.author._id.toString() !== user._id.toString()) {
        await Notification.create(
          [
            {
              recipient: newComment.author._id,
              type: "reply",
              title: "New Reply on Your Comment",
              message: `${user.fullName} replied to your comment on "${blog.title}"`,
              link: `/blog/${blog.slug}`,
              relatedUser: user._id,
              relatedBlog: blog._id,
              relatedComment: newComment._id,
            },
          ],
          { session }
        );
      }
    } else {
      await Blog.findOneAndUpdate(
        { _id: blog._id },
        {
          $inc: { "blogActivity.total_comments": 1 },
          $push: { comments: newComment._id },
        },
        { new: true, session }
      );

      // But only if the comment author is not the blog author
      if (blog.author._id.toString() !== user._id.toString()) {
        await Notification.create(
          [
            {
              recipient: blog.author._id,
              type: "comment",
              title: "New Comment on Your Blog",
              message: `${user.fullName} commented on your blog "${blog.title}"`,
              link: `/blog/${blog.slug}`,
              relatedUser: user._id,
              relatedBlog: blog._id,
              relatedComment: newComment._id,
            },
          ],
          { session }
        );
      }
    }

    // Commit transaction
    await session.commitTransaction();

    // Populate comment with author details for response

    await newComment.populate("author", "name profilePicture");

    const commentCount = await Comment.countDocuments({ blog: blog._id });
    newComment.commentCount = commentCount;

    const customComment = parentCommentId ? "reply" : "comment";

    res
      .status(200)
      .json(
        ApiResponse.success(newComment, `${customComment} added successfully`)
      );
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const getComments = async (req, res, next) => {
  const { slug } = req.params;
  const { maxLimit = 5, page = 1, sort = "desc", skip = 0 } = req.query;

  const limit = parseInt(maxLimit);
  const pageNumber = parseInt(page);
  const sortOrder = sort === "desc" ? -1 : 1;
  const commentSkip = (pageNumber - 1) * limit;
  console.log("commentSkip", commentSkip);

  try {
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return next(new ApiError(404, "Blog not found"));
    }

    const createPopulateObject = (currentLevel, maxLevel = 5) => {
      if (currentLevel >= maxLevel) return null;

      return {
        path: "replies",
        populate: [
          {
            path: "author",
            select: "username profilePicture",
          },
          createPopulateObject(currentLevel + 1, maxLevel),
        ].filter(Boolean), // Remove null values
      };
    };

    const comments = await Comment.find({
      blog: blog._id,
      level: 0,
      parentComment: null,
    })
      .sort({ createdAt: sortOrder })
      .skip(commentSkip)
      .limit(limit)
      .populate(createPopulateObject(0))
      .populate("author", "username profilePicture")
      .lean();

    const totalComments = await Comment.countDocuments({
      blog: blog._id,
      level: 0,
      parentComment: null,
    });

    const totalPages = Math.ceil(totalComments / limit);
    const hasNextPage = pageNumber < totalPages;

    const nextPage = hasNextPage ? pageNumber + 1 : null;

    const responseObject = {
      comments,
      totalPages,
      currentPage: pageNumber,
      nextPage,
      hasNextPage,
    };
    res
      .status(200)
      .json(
        ApiResponse.success(responseObject, "Comments fetched successfully")
      );
  } catch (error) {
    next(error);
  }
};
