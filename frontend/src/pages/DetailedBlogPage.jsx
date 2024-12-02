/* eslint-disable no-unsafe-optional-chaining */
import {
  Avatar,
  Box,
  Button,
  Container,
  Typography,
  useTheme,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetBlogBySlugQuery } from "../redux/api/blogApiSlice";
import { formatDate } from "../utils/formatDate";
import BlogComponent from "../components/BlogComponent";

const DetailedBlogPage = () => {
  const { slug } = useParams();
  const theme = useTheme();

  const { data, isLoading } = useGetBlogBySlugQuery(slug);

  console.log("dsfas", data?.data?.createdAt);

  return (
    <Container maxWidth="md" className="min-height">
      <Box sx={{ mt: theme.spacing(8) }}>
        <Typography variant="h4" sx={{ fontSize: "2rem", fontWeight: 600 }}>
          {data?.data?.title}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            mt: theme.spacing(4),
            fontSize: "1rem",
            fontWeight: 400,
            color: "text.secondary",
          }}
        >
          {data?.data?.metaDescription}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 4, // margin top with theme spacing
          }}
        >
          <Avatar
            src={data?.data?.author?.profilePicture}
            alt={data?.data?.author?.name}
            sx={{ width: 56, height: 56 }} // Set avatar size
          />

          <Box sx={{ ml: 6 }}>
            {" "}
            {/* Reduced margin for better compactness */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  mr: 1, // Add right margin for spacing before the button
                }}
              >
                {data?.data?.author?.fullName}
              </Typography>

              <Button
                variant="text"
                color="primary"
                size="small"
                sx={{ textTransform: "none", fontSize: "0.875rem" }} // Remove uppercase and adjust size
              >
                Follow
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {data?.data?.readingTime?.minutes} min &bull;{" "}
              {formatDate(data?.data?.createdAt)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: theme.spacing(4) }}>
          <img
            src={data?.data?.banner?.url}
            alt={data?.data?.title || "Blog Banner"}
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        </Box>

        <BlogComponent content={data?.data?.content} />
      </Box>
    </Container>
  );
};

export default DetailedBlogPage;
