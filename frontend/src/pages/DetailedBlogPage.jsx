import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import {
  useGetBlogBySlugQuery,
  useGetSimilarBlogsQuery,
} from "../redux/api/blogApiSlice";
import BlogComponent from "../components/BlogComponent";
import { formatDate } from "../utils/formatDate";
import BlogInteraction from "../components/BlogInteraction";
import BlogCard from "../components/BlogCard";
import NoDataFound from "../components/NoDataFound";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  selectCommentsWrapper,
  setCommentsWrapper,
  setCurrentBlog,
} from "../redux/slices/blogSlice";
import CommentsContainer from "../components/CommentsContainer";
import { Drawer } from "@mui/material"; // Import Drawer

const DetailedBlogPage = () => {
  const { slug } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(false);

  const { data, isLoading } = useGetBlogBySlugQuery(slug);

  useEffect(() => {
    dispatch(setCurrentBlog(data?.data));
    dispatch(setCommentsWrapper(false));
  }, [data, dispatch]);

  const { data: similarBlogs, isLoading: similarBlogsLoading } =
    useGetSimilarBlogsQuery({
      slug,
      maxLimit: 3,
    });

  const commentsWrapper = useSelector(selectCommentsWrapper);

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
            <Box sx={{ mt: theme.spacing(4) }}>
              <img
                src={data?.data?.banner?.url}
                alt={data?.data?.title || "Blog Banner"}
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
              />
            </Box>
            <Typography variant="h4" sx={{ fontSize: "2rem", fontWeight: 600 }}>
              {data?.data?.title}
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 500 }}>
              <Link
                to={`/category/${data?.data?.categories}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Category: {data?.data?.categories}
              </Link>
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
                my: 4, // margin top with theme spacing
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
            <Divider />

            <BlogInteraction isLiked={isLiked} setIsLiked={setIsLiked} />
            <Divider />

            <BlogComponent />

            <Box sx={{ mt: 2 }}>
              {data?.data?.tags?.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  component={Link} // Make the Chip a link
                  to={`/tag/${tag}`} // Adjust the path as necessary
                  sx={{ mr: 1, cursor: "pointer" }} // Add some margin to the right
                />
              ))}
            </Box>

            <Divider />

            <BlogInteraction isLiked={isLiked} setIsLiked={setIsLiked} />

                <Drawer
                  anchor="right"
                  open={commentsWrapper}
                  onClose={() => dispatch(setCommentsWrapper(!commentsWrapper))} // Close drawer
                >
                  <Box
                    sx={{ width: 450, padding: 2, maxWidth: "100%" }} // Set width and padding
                    role="presentation"
                  >
                    <CommentsContainer />
                  </Box>
                </Drawer>

            <Divider />

            <Box sx={{ my: theme.spacing(4) }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Similar Blogs
              </Typography>
              {similarBlogsLoading ? (
                <Skeleton variant="text" width="60%" height={40} />
              ) : similarBlogs?.data && similarBlogs?.data?.length > 0 ? (
                <Grid container spacing={2} sx={{ mt: theme.spacing(2) }}>
                  {similarBlogs?.data?.map((blog) => (
                    <Grid item xs={12} sm={6} key={blog?._id}>
                      <BlogCard blog={blog} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <NoDataFound message="No blogs found" />
              )}
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default DetailedBlogPage;
