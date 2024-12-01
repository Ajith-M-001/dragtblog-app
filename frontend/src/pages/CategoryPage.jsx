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

const CategoryPage = () => {
  const { categoryName } = useParams();
  // Fetch blogs based on the selected category
  const { data, isLoading } = useGetBlogsByCategoryQuery(categoryName);
  console.log(data);
  const category = data?.data?.categoryDetails;
  const blogs = data?.data?.blogs;

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
        <Button variant="contained">Follow</Button>
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
