/* eslint-disable react/prop-types */
import { Box, Button, Divider, Typography } from "@mui/material";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";

const ManageBlogCard = ({ blog }) => {
  console.log("blog_manage", blog);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: "15px",
        my: 4,
      }}
    >
      <Box>
        <Box sx={{ width: "240px", height: "125px" }}>
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "5px",
            }}
            src={blog?.banner?.url}
            alt={blog?.title}
          />{" "}
          {/* Displaying the banner image */}
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body1" gutterBottom>
          {blog?.title}
        </Typography>
        <Typography
          sx={{ color: "text.secondary" }}
          variant="subtitle"
          gutterBottom
        >
          published on: {formatDate(blog?.createdAt)}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <Button component={Link} to={`/editor/${blog?.slug}`} color="primary">
            Edit
          </Button>
          <Button color="error">Delete</Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h5">
            {blog?.blogActivity?.total_likes}
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>Links</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h5">
            {blog?.blogActivity?.total_comments}
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>comments</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Typography variant="h5">
            {blog?.blogActivity?.total_views}
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>views</Typography>
        </Box>
        <Divider />
      </Box>
      <Divider />
    </Box>
  );
};

export default ManageBlogCard;
