import { Box, IconButton, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useSelector } from "react-redux";
import { selectCurrentBlog } from "../redux/slices/blogSlice";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";

const BlogInteraction = () => {
  const currentBlog = useSelector(selectCurrentBlog);
  const { userInfo } = useSelector((state) => state.user);
  const likes = currentBlog?.blogActivity?.total_likes;
  const comments = currentBlog?.blogActivity?.total_comments;

  const blogAuthorId = currentBlog?.author?._id;
  const authorId = userInfo?._id;

  return (
    <Box sx={{ my: 2, display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton>
            <FavoriteIcon />
          </IconButton>
          <Typography variant="body1">{likes}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton>
            <CommentIcon />
          </IconButton>
          <Typography variant="body1">{comments}</Typography>
        </Box>
      </Box>
      <Box>
        {blogAuthorId === authorId ? (
          <>
            <IconButton component={Link} to={`/edit-blog/${currentBlog?.slug}`}>
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

export default BlogInteraction;
