import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { formatDate } from "../utils/formatDate";
import FavoriteIcon from "@mui/icons-material/Favorite";

/* eslint-disable react/prop-types */
const BlogCard = ({ blog }) => {
  console.log(blog);
  return (
    <Card>
      <CardMedia
        component="img"
        height="194"
        image={blog.banner.url}
        alt={blog.title}
      />
      <CardHeader title={blog.title} />
      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {blog.metaDescription}
        </Typography>
      </CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 5,
          pb: 2,
        }}
      >
        <Typography>{formatDate(blog.createdAt)}</Typography>
        <IconButton aria-label="share">
          <FavoriteIcon /> {blog.blogActivity.total_likes}
        </IconButton>
      </Box>
    </Card>
  );
};

export default BlogCard;
