import PropTypes from "prop-types";
import { Box, IconButton, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCommentsWrapper,
  selectCurrentBlog,
  selectIsLiked,
  setCommentsWrapper,
  setIsLiked,
} from "../redux/slices/blogSlice";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { useLikeBlogMutation } from "../redux/api/blogApiSlice";
import { useEffect } from "react";

const BlogInteraction = () => {
  const currentBlog = useSelector(selectCurrentBlog);
  const { userInfo } = useSelector((state) => state.user);
  const likes = currentBlog?.blogActivity?.total_likes;
  const comments = currentBlog?.blogActivity?.total_comments;

  const blogAuthorId = currentBlog?.author?._id;
  const authorId = userInfo?._id;

  const [likeBlog] = useLikeBlogMutation();
  const isLiked = useSelector(selectIsLiked);
  const dispatch = useDispatch();
  const commentsWrapper = useSelector(selectCommentsWrapper);

  // need to handle this from backend
  useEffect(() => {
    console.log("current", currentBlog);
    if (currentBlog) {
      const userHasLiked = currentBlog.likedBy?.includes(userInfo?._id);
      console.log("userHasLiked", userHasLiked);
      dispatch(setIsLiked(userHasLiked));
    }
  }, [currentBlog]);

  console.log("isLiked", isLiked);

  const handleLike = async () => {
    if (!userInfo) {
      alert("Please login to like this blog");
      return;
    }
    try {
      const res = await likeBlog(currentBlog?.slug).unwrap();
      dispatch(setIsLiked(!isLiked));

      console.log(res);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleCommentsWrapper = () => {
    dispatch(setCommentsWrapper(!commentsWrapper));
    console.log("commentsWrapper", commentsWrapper);
  };

  return (
    <Box sx={{ my: 2, display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={handleLike}>
            <FavoriteIcon color={isLiked ? "error" : "inherit"} />
          </IconButton>
          <Typography variant="body1">{likes}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton>
            <CommentIcon onClick={handleCommentsWrapper} />
          </IconButton>
          <Typography variant="body1">{comments}</Typography>
        </Box>
      </Box>
      <Box>
        {blogAuthorId === authorId ? (
          <>
            <IconButton component={Link} to={`/editor/${currentBlog?.slug}`}>
              <EditIcon />
            </IconButton>
          </>
        ) : null}
        <IconButton>
          <BookmarkAddIcon />
        </IconButton>
        <IconButton>
          <MoreHorizIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

BlogInteraction.propTypes = {
  isLiked: PropTypes.bool.isRequired,
  setIsLiked: PropTypes.func.isRequired,
};

export default BlogInteraction;
