import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetUserByUsernameQuery } from "../redux/api/userApiSlice";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import BlogPost from "../components/BlogPost";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { username } = useParams();
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const maxLimit = 5;

  const { data, isLoading } = useGetUserByUsernameQuery({
    username,
    page,
    maxLimit,
  });
  const { userInfo } = useSelector((state) => state.user);
  console.log(data);

  useEffect(() => {
    setBlogs([]);
    setPage(1);
  }, [username]);

  useEffect(() => {
    if (data) {
      setBlogs((prevBlogs) => {
        const newBlogs = data.data.blogs.filter(
          (blog) => !prevBlogs.some((prevBlog) => prevBlog._id === blog._id)
        );
        return [...prevBlogs, ...newBlogs];
      });
      setHasMore(data.data.pagination.hasNextPage);
    }
  }, [data]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading]);

  console.log("dfdsafasdfasdf", blogs, hasMore, page);

  const {
    fullName,
    profilePicture,
    username: uniqueUsername,
    followersCount,
    followingCount,
  } = data?.data || {};

  return (
    <Container maxWidth="xl" className="min-height">
      <Grid container>
        <Grid
          item
          xs={12}
          md={8}
          // sx={{
          //   borderRight: "1px solid #2a2a2a",
          //   height: "90vh",
          //   overflowY: "auto",
          //   scrollbarWidth: "none",
          //   msOverflowStyle: "none",
          //   "&::-webkit-scrollbar": {
          //     display: "none",
          //   },
          // }}
        >
          <Box sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="h2" gutterBottom>
                {fullName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                ( total blogs : {data?.data?.pagination?.totalBlogs} )
              </Typography>
            </Box>
            <Box>
              {isLoading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : (
                <Box>
                  {blogs.map((blog) => (
                    <BlogPost key={blog._id} blog={blog} />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, mt: 2 }}>
            {isLoading ? (
              <Skeleton variant="rectangular" height={200} />
            ) : (
              <>
                <Avatar
                  alt={fullName}
                  src={profilePicture}
                  sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
                />
                <Typography
                  sx={{ textAlign: "center" }}
                  variant="subtitle1"
                  color="textSecondary"
                >
                  @{uniqueUsername}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "50%",
                    mx: "auto",
                  }}
                >
                  <Typography variant="body1" gutterBottom>
                    {followersCount} Followers
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {followingCount} Following
                  </Typography>
                </Box>
                {uniqueUsername === userInfo?.username && (
                  <Button
                    variant="text"
                    sx={{
                      mt: 2,
                      mx: "auto",
                      color: "#3391d4",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    startIcon={<EditIcon />}
                  >
                    Edit Profile
                  </Button>
                )}
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
