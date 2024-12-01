import { Box, Chip, Typography } from "@mui/material";
import { formatDate } from "../utils/formatDate";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
const BlogPost = ({ blog }) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ px: 3, py: 5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <Box
            sx={{
              width: "30px",
              height: "30px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <img
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              src={blog?.author?.profilePicture}
              alt="avatar"
            />
            <Typography>{blog?.author?.username}</Typography>
            <Typography sx={{ whiteSpace: "nowrap" }}>
              {formatDate(blog.createdAt)}
            </Typography>
          </Box>
          <Typography sx={{ flex: 1 }}>{blog?.title}</Typography>
          <Typography sx={{ flex: 1 }} variant="body2" color="text.secondary">
            {blog?.metaDescription}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              variant="filled"
              sx={{ marginRight: 4, marginBottom: 1 }}
              label={blog.categories}
              onClick={() => navigate(`/category/${blog.categories}`)}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FavoriteIcon sx={{ marginRight: 1, fontSize: 22 }} />
              <Typography variant="body2" color="text.secondary">
                {blog.blogActivity.total_likes}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ width: "200px", height: "104px", flexShrink: 0 }}>
          <img
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            src={blog?.banner?.url}
            alt="banner"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BlogPost;
