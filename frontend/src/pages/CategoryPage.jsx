import {
  Box,
  Button,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetBlogsByCategoryQuery } from "../redux/api/blogApiSlice";
import BlogCard from "../components/BlogCard";
import NoDataFound from "../components/NoDataFound";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  useFollowCategoryMutation,
  useUnfollowCategoryMutation,
} from "../redux/api/categoryApiSlice";
import { showNotification } from "../redux/slices/notificationSlice";

const CategoryPage = () => {
  const { categoryName } = useParams();
  // Fetch blogs based on the selected category
  const { data, isLoading } = useGetBlogsByCategoryQuery(categoryName);
  const category = data?.data?.categoryDetails;
  const blogs = data?.data?.blogs;
  const [followCategory, setFollowCategory] = useState(false);
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const [followCategorybyid] = useFollowCategoryMutation();
  const [unfollowCategory] = useUnfollowCategoryMutation();

  console.log("category_podfl", userInfo);

  useEffect(() => {
    if (userInfo?.followingCategories.includes(category?._id)) {
      setFollowCategory(true);
    } else {
      setFollowCategory(false);
    }
  }, [userInfo, category, blogs]);

  console.log("followCategory", followCategory);

  const handleFollowCategory = async (id) => {
    try {
      const response = await followCategorybyid(id).unwrap();
      if (response.status === "success") {
        setFollowCategory(true);
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

  const handleunfollowCategory = async (id) => {
    try {
      // alert(`unfollow ${id}`);
      const response = await unfollowCategory(id).unwrap();
      if (response.status === "success") {
        setFollowCategory(false);
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

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          p: 4,
          py: 15,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Typography variant="h4">{category?.category.toUpperCase()}</Typography>
        <Box sx={{ display: "flex", gap: 4 }}>
          <Typography variant="body1">
            {category?.meta.total_followers} Followers
          </Typography>
          {"-"}

          <Typography variant="body1">
            {category?.meta.total_blogs} Blogs
          </Typography>
        </Box>
        {followCategory ? (
          <Button
            onClick={() => handleunfollowCategory(category._id)}
            variant="contained"
            size="small"
          >
            Following
          </Button>
        ) : (
          <Button
            onClick={() => handleFollowCategory(category._id)}
            variant="contained"
            size="small"
          >
            Follow
          </Button>
        )}
      </Box>

      {isLoading ? (
        <Skeleton variant="rectangular" width="100%" height={300} />
      ) : blogs && blogs.length > 0 ? (
        <Grid container spacing={4}>
          {blogs.map((blog) => {
            return (
              <Grid item key={blog._id} xs={12} sm={6} md={4}>
                <BlogCard blog={blog} />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <NoDataFound message="No blogs found" />
      )}
    </Container>
  );
};

export default CategoryPage;
