/* eslint-disable react/prop-types */
import { Avatar, Box, Divider, Typography } from "@mui/material";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";

const TrendingBlogPost = ({ blog }) => {
  return (
    <Box
      component={Link}
      to={`/blog/${blog.slug}`}
      sx={{
        px: 3,
        py: 5,
        textDecoration: "none",
        color: "inherit",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.05)",
        },
      }}
    >
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
      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default TrendingBlogPost;
