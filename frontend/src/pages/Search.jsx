import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useSearchUserQuery } from "../redux/api/userApiSlice";
import { useGetSearchResultsQuery } from "../redux/api/blogApiSlice";
import BlogPost from "../components/BlogPost";
import { useEffect, useState } from "react";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const theme = useTheme();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const maxLimit = 5;

  const { data, isLoading } = useGetSearchResultsQuery({
    query,
    maxLimit,
    page,
  });

  // Reset blogs state when query changes
  useEffect(() => {
    setBlogs([]);
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (data) {
      setBlogs((prevBlogs) => {
        const newBlogs = data.data.blogs.filter(
          (blog) => !prevBlogs.some((prevBlog) => prevBlog._id === blog._id)
        );
        return [...prevBlogs, ...newBlogs];
      });
      setHasMore(data?.data?.pagination?.hasNextPage);
    }
  }, [data]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      hasMore &&
      !isLoading
    ) {
      setPage((prevPage) => prevPage + 1); // Increment page number to fetch the next set of blogs
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading]);

  const { data: userData, isLoading: userIsLoading } =
    useSearchUserQuery(query);
  console.log(page, hasMore, blogs);

  return (
    <Container maxWidth="xl" className="min-height">
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box
            className="flex items-center gap-2 "
            sx={{ marginTop: theme.spacing(4) }}
          >
            <Typography
              variant="h4"
              color="textSecondary"
              sx={{ display: "inline-block" }}
            >
              {data?.data?.totalBlogs} Results for
            </Typography>
            <Typography
              variant="h4"
              color="textPrimary"
              sx={{ display: "inline-block", paddingLeft: theme.spacing(2) }}
            >
              {query}
            </Typography>
          </Box>
          <Box>
            {isLoading ? (
              <Box className="flex justify-center items-center">
                <CircularProgress sx={{ color: theme.palette.primary.main }} />
              </Box>
            ) : (
              <>
                {blogs.map((blog) => (
                  <BlogPost blog={blog} key={blog._id} />
                ))}
              </>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={4} sx={{ marginTop: theme.spacing(4) }}>
          <Box component="section" sx={{ marginBottom: theme.spacing(4) }}>
            <Typography variant="h5" sx={{ marginBottom: theme.spacing(2) }}>
              Categories matching {query}
            </Typography>
            <Box
              sx={{ display: "flex", flexWrap: "wrap", gap: theme.spacing(1) }}
            >
              {isLoading ? (
                <Skeleton variant="text" height={300} />
              ) : data?.data?.categories?.length > 0 ? (
                data?.data?.categories?.map((category) => (
                  <Chip
                    sx={{ marginRight: theme.spacing(2), boxShadow: 1 }}
                    onClick={() => navigate(`/category/${category.category}`)}
                    key={category._id}
                    label={category.category}
                  />
                ))
              ) : (
                <Typography variant="body1">
                  No categories found matching {query}
                </Typography>
              )}
            </Box>
          </Box>
          <Box component="section" sx={{ marginBottom: theme.spacing(4) }}>
            <Typography variant="h5" sx={{ marginBottom: theme.spacing(2) }}>
              Tags matching {query}
            </Typography>
            <Box
              sx={{ display: "flex", flexWrap: "wrap", gap: theme.spacing(1) }}
            >
              {isLoading ? (
                <Skeleton variant="text" height={300} />
              ) : data?.data?.tags?.length > 0 ? (
                data?.data?.tags?.map((tag) => (
                  <Chip
                    key={tag._id}
                    onClick={() => navigate(`/tag/${tag.tag}`)}
                    label={tag.tag}
                  />
                ))
              ) : (
                <Typography variant="body1">
                  No tags found matching {query}
                </Typography>
              )}
            </Box>
          </Box>
          <Box component="section">
            <Typography variant="h5" sx={{ marginBottom: theme.spacing(2) }}>
              Users matching {query}
            </Typography>
            <Box>
              {userIsLoading ? (
                <Box className="flex justify-center items-center">
                  <CircularProgress
                    sx={{ color: theme.palette.primary.main }}
                  />
                </Box>
              ) : userData?.data?.length > 0 ? (
                userData?.data?.map((user) => (
                  <Box
                    component={Link}
                    to={`/profile/${user.username}`}
                    key={user._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: theme.spacing(2),
                      padding: theme.spacing(2),
                      boxShadow: 1,
                      borderRadius: 1,
                      textDecoration: "none",
                      color: "inherit",
                      width: "70%",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar src={user.profilePicture} alt={user.fullName} />
                      <Typography
                        variant="body1"
                        sx={{ marginLeft: 2, fontWeight: "medium" }}
                      >
                        {user.fullName}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginLeft: 2 }}
                      onClick={() => alert("Follow")}
                    >
                      Follow
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No users matching your search
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search;
