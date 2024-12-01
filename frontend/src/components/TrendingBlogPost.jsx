/* eslint-disable react/prop-types */
import { Avatar, Box, Typography } from "@mui/material";
import { formatDate } from "../utils/formatDate";

const TrendingBlogPost = ({ blog }) => {
  return (
    <Box sx={{ px: 3, py: 5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Avatar
          sx={{ width: 30, height: 30 }}
          alt={blog.author.fullName}
          src={blog?.author?.profilePicture}
        />
        <Typography variant="subtitle2">{blog.author.username}</Typography>
      </Box>

      <Typography variant="body1">{blog.title}</Typography>

      <Typography variant="caption">{formatDate(blog.createdAt)}</Typography>
    </Box>
  );
};

export default TrendingBlogPost;
