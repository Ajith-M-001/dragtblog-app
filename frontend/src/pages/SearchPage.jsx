import { Link, useSearchParams } from "react-router-dom";
import { useGetSearchResultsQuery } from "../redux/api/blogApiSlice";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import BlogPost from "../components/BlogPost";
import { useNavigate } from "react-router-dom";
import { useSearchUserQuery } from "../redux/api/userApiSlice";
const SearchPage = () => {
  const [searchParams] = useSearchParams(); // Hook to access URL parameters
  const query = searchParams.get("query");
  const theme = useTheme();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSearchResultsQuery(query);
  const { data: userData, isLoading: userIsLoading } =
    useSearchUserQuery(query);
  return (
    <Container className="min-height" maxWidth="xl">
      <Grid container>
        <Grid item xs={12} md={7}>
          <Box
            className="flex items-center gap-2 "
            sx={{ marginTop: theme.spacing(4) }}
          >
            <Typography
              variant="h4"
              color="textSecondary"
              sx={{ display: "inline-block" }}
            >
              Results for
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
                {data?.data?.blogs.map((blog) => (
                  <BlogPost blog={blog} key={blog._id} />
                ))}
              </>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={5} sx={{ marginTop: theme.spacing(4) }}>
          <Box component="section" sx={{ marginBottom: theme.spacing(4) }}>
            <Typography variant="h5" sx={{ marginBottom: theme.spacing(2) }}>
              Categories matching {query}
            </Typography>
            <Box
              sx={{ display: "flex", flexWrap: "wrap", gap: theme.spacing(1) }}
            >
              {data?.data?.matchingCategory?.length > 0 ? (
                data.data.matchingCategory.map((category) => (
                  <Chip
                    sx={{ marginRight: theme.spacing(2), boxShadow: 1 }}
                    onClick={() => navigate(`/category/${category.category}`)}
                    label={category.category}
                    key={category._id}
                  />
                ))
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No categories matching your search
                </Typography>
              )}
            </Box>
          </Box>

          <Box component="section" sx={{ marginBottom: theme.spacing(4) }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", marginBottom: theme.spacing(2) }}
            >
              Tags matching {query}
            </Typography>
            <Box
              sx={{ display: "flex", flexWrap: "wrap", gap: theme.spacing(1) }}
            >
              {data?.data?.tags?.length > 0 ? (
                data.data.tags.map((tagObj) => (
                  <Chip
                    sx={{ marginRight: theme.spacing(2), boxShadow: 1 }}
                    label={tagObj.tag}
                    key={tagObj._id}
                  />
                ))
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No tags matching your search
                </Typography>
              )}
            </Box>
          </Box>

          <Box component="section">
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", marginBottom: theme.spacing(2) }}
            >
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

export default SearchPage;
