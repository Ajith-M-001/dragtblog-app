import { motion } from "framer-motion";
import { AnimatedPage } from "../common/AnimatedPage";
import {
  Box,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import {
  useGetLatestBlogsQuery,
  useGetTrendingBlogsQuery,
  useGetUniqueCategoriesQuery,
} from "../redux/api/blogApiSlice";
import BlogPost from "../components/BlogPost";
import TrendingBlogPost from "../components/TrendingBlogPost";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Homepage = () => {
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const maxLimit = 5;
  const theme = useTheme();

  const navigate = useNavigate();
  const {
    data: latestBlogs,
    isLoading: latestBlogsLoading,
    isFetching: latestBlogsFetching,
  } = useGetLatestBlogsQuery({ page, maxLimit });
  const { data: trendingBlogs, isLoading: trendingBlogsLoading } =
    useGetTrendingBlogsQuery();
  const { data: uniqueCategories, isLoading: uniqueCategoriesLoading } =
    useGetUniqueCategoriesQuery();

  const skeletonArray = new Array(maxLimit).fill(null);

  useEffect(() => {
    if (latestBlogs) {
      setBlogs((prevBlogs) => {
        const newBlogs = latestBlogs.data.blogs.filter(
          (blog) => !prevBlogs.some((prevBlog) => prevBlog._id === blog._id)
        );
        return [...prevBlogs, ...newBlogs];
      });
      setHasMore(latestBlogs.data.hasNextPage);
    }
  }, [latestBlogs]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50 &&
      hasMore &&
      !latestBlogsFetching
    ) {
      setPage((prevPage) => prevPage + 1); // Increment page number to fetch the next set of blogs
    }
  };


  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, latestBlogsFetching]);

  return (
    <AnimatedPage>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Container maxWidth="xl" className="min-height">
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography>Latest Blogs</Typography>
              {latestBlogsLoading
                ? skeletonArray.map((_, index) => (
                    <Box key={index} sx={{ px: 3, py: 5 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 3 }}
                      >
                        {/* Left column with author info, title, meta description, category, and likes */}
                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          {/* Skeleton for avatar, username, and date */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                              width: "100%",
                            }}
                          >
                            <Skeleton
                              variant="circular"
                              width={30}
                              height={30}
                            />
                            <Skeleton variant="text" width={100} height={20} />
                            <Skeleton variant="text" width={60} height={20} />
                          </Box>

                          {/* Skeleton for blog title */}
                          <Skeleton variant="text" width="100%" height={30} />

                          {/* Skeleton for meta description */}
                          <Skeleton variant="text" width="100%" height={20} />

                          {/* Skeleton for category and likes */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Skeleton
                              variant="rounded"
                              width={80}
                              height={24}
                            />
                            <Skeleton variant="text" width={40} height={20} />
                          </Box>
                        </Box>

                        {/* Skeleton for blog banner */}
                        <Box
                          sx={{
                            width: "200px",
                            height: "104px",
                            flexShrink: 0,
                          }}
                        >
                          <Skeleton
                            variant="rectangular"
                            width={200}
                            height={104}
                          />
                        </Box>
                      </Box>
                    </Box>
                  ))
                : blogs?.map((blog) => <BlogPost key={blog._id} blog={blog} />)}
              {latestBlogsFetching && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <CircularProgress
                    sx={{ color: theme.palette.text.primary }}
                  />
                </Box>
              )}
              {!hasMore && !latestBlogsFetching && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    You have reached the end of the list.
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={4} sx={{ borderLeft: "1px solid #b6bab7" }}>
              <Box sx={{ py: 5 }}>
                <Typography variant="body2">Categories</Typography>
                {uniqueCategoriesLoading
                  ? skeletonArray.map((_, index) => (
                      <Box key={index} sx={{ px: 3, py: 5 }}>
                        <Skeleton variant="text" width="100%" height={30} />
                      </Box>
                    ))
                  : uniqueCategories?.data?.map((category) => (
                      <Chip
                        onClick={() =>
                          navigate(`/category/${category.category}`)
                        }
                        key={category._id}
                        label={category.category}
                        sx={{
                          my: 4,
                          mx: 1,
                        }}
                      />
                    ))}
              </Box>
              <Typography>Trending Blogs</Typography>
              {trendingBlogsLoading
                ? skeletonArray.map((_, index) => (
                    <Box key={index} sx={{ px: 3, py: 5 }}>
                      <Skeleton variant="text" width="100%" height={30} />
                    </Box>
                  ))
                : trendingBlogs?.data?.map((blog) => (
                    <TrendingBlogPost key={blog._id} blog={blog} />
                  ))}
            </Grid>
          </Grid>
        </Container>
      </motion.div>
    </AnimatedPage>
  );
};

export default Homepage;
