/* eslint-disable no-unsafe-optional-chaining */
import {
  Avatar,
  Box,
  Button,
  Container,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetBlogBySlugQuery } from "../redux/api/blogApiSlice";
import BlogComponent from "../components/BlogComponent";
import { formatDate } from "../utils/formatDate";

const DetailedBlogPage = () => {
  const { slug } = useParams();
  const theme = useTheme();

  const { data, isLoading } = useGetBlogBySlugQuery(slug);

  console.log("data", data);

  return (
    <Container maxWidth="md" className="min-height">
      <Box sx={{ mt: theme.spacing(8) }}>
        {isLoading ? ( // Check if loading
          <>
            <Skeleton variant="text" width="60%" height={40} />{" "}
            {/* Skeleton for title */}
            <Skeleton
              variant="text"
              width="80%"
              height={30}
              sx={{ mt: 2 }}
            />{" "}
            {/* Skeleton for meta description */}
            <Skeleton variant="rectangular" height={200} sx={{ mt: 4 }} />{" "}
            {/* Skeleton for image */}
            <Skeleton
              variant="text"
              width="40%"
              height={30}
              sx={{ mt: 2 }}
            />{" "}
            {/* Skeleton for author name */}
            <Skeleton
              variant="text"
              width="20%"
              height={20}
              sx={{ mt: 1 }}
            />{" "}
            {/* Skeleton for reading time */}
            <Skeleton
              variant="text"
              width="20%"
              height={20}
              sx={{ mt: 1 }}
            />{" "}
            {/* Skeleton for created date */}
          </>
        ) : (
          <>
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontSize: "0.875rem" }}>
                    {data?.data?.readingTime?.minutes} min read
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontSize: "0.875rem" }}>
                    {data?.data?.createdAt && formatDate(data.data.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: theme.spacing(4) }}>
              <img
                src={data?.data?.banner?.url}
                alt={data?.data?.title || "Blog Banner"}
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
              />
            </Box>

            <BlogComponent
              key={data?.data?._id}
              content={data?.data?.content}
            />
          </>
        )}
      </Box>
    </Container>
  );
};

export default DetailedBlogPage;
