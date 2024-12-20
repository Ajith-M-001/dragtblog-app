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
  selectCurrentBlog,
  selectIsFollowing,
  setCommentsWrapper,
  setCurrentBlog,
  setIsFollowing,
} from "../redux/slices/blogSlice";
import CommentsContainer from "../components/CommentsContainer";
import { Drawer } from "@mui/material"; // Import Drawer
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../redux/api/userApiSlice";
import { showNotification } from "../redux/slices/notificationSlice";

const DetailedBlogPage = () => {
  const { slug } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(false);
  const [highlightedComment, setHighlightedComment] = useState(null);
  const { userInfo } = useSelector((state) => state.user);
  const currentBlog = useSelector(selectCurrentBlog);
  const isFollowing = useSelector(selectIsFollowing);
  console.log("curre099", isFollowing);

  const { data, isLoading } = useGetBlogBySlugQuery(slug);
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  useEffect(() => {
    if (data?.data?.author?.followers.includes(userInfo?._id)) {
      // Added closing parenthesis
      dispatch(setIsFollowing(true));
    } else {
      dispatch(setIsFollowing(false));
    }
  }, [data?.data, userInfo]);

  useEffect(() => {
    dispatch(setCurrentBlog(data?.data));
    dispatch(setCommentsWrapper(false));
  }, [data, dispatch, currentBlog]);

  useEffect(() => {
    const hash = window.location.hash;
    const commentId = hash.replace("#commentId-", "");
    if (commentId) {
      console.log("commentId_123", commentId);
      dispatch(setCommentsWrapper(true));
      setHighlightedComment(commentId);
    }
  }, [dispatch, highlightedComment]);

  console.log("hash_123", highlightedComment);
  const { data: similarBlogs, isLoading: similarBlogsLoading } =
    useGetSimilarBlogsQuery({
      slug,
      maxLimit: 3,
    });

  const commentsWrapper = useSelector(selectCommentsWrapper);

  const handleFollow = async (id) => {
    try {
      const response = await followUser(id).unwrap();
      if (response.status === "success") {
        dispatch(setIsFollowing(true));
      }
      dispatch(
        showNotification({
          open: true,
          message: response.message,
          severity: response.status,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleunFollow = async (id) => {
    try {
      const response = await unfollowUser(id).unwrap();
      if (response.status === "success") {
        dispatch(setIsFollowing(false));
      }
      dispatch(
        showNotification({
          open: true,
          message: response.message,
          severity: response.status,
        })
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log("data?.data?.author", data?.data);

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

                  {data?.data?.author?._id !== userInfo?._id ? (
                    !isFollowing ? ( // Use parentheses instead of curly braces
                      <Button
                        onClick={() => handleFollow(data?.data?.author?._id)}
                        variant="text"
                        color="primary"
                        size="small"
                        sx={{ textTransform: "none", fontSize: "0.875rem" }} // Remove uppercase and adjust size
                      >
                        Follow
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleunFollow(data?.data?.author?._id)}
                        variant="text"
                        color="primary"
                        size="small"
                        sx={{ textTransform: "none", fontSize: "0.875rem" }} // Remove uppercase and adjust size
                      >
                        Unfollow
                      </Button>
                    )
                  ) : (
                    ""
                  )}
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

            <BlogInteraction
              slug={slug}
              isLiked={isLiked}
              setIsLiked={setIsLiked}
            />
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

            <BlogInteraction
              slug={slug}
              isLiked={isLiked}
              setIsLiked={setIsLiked}
            />

            <Drawer
              anchor="right"
              open={commentsWrapper}
              onClose={() => dispatch(setCommentsWrapper(!commentsWrapper))} // Close drawer
            >
              <Box
                sx={{ width: 450, padding: 2, maxWidth: "100%" }} // Set width and padding
                role="presentation"
              >
                <CommentsContainer highlightedComment={highlightedComment} />
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
