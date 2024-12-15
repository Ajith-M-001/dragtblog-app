import { useEffect, useState } from "react";
import { useUserWrittenBlogsQuery } from "../redux/api/blogApiSlice";
import {
  Box,
  Container,
  Skeleton,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import ManageBlogCard from "../components/ManageBlogCard.jsx";
// import { Search, Edit, Delete } from "@mui/icons-material";

const DashboardBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [draft, setDraft] = useState("published");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState(0); // State for tab selection
  const theme = useTheme();

  const [page, setPage] = useState(1);
  const maxLimit = 5;

  const { data, isLoading, refetch } = useUserWrittenBlogsQuery({
    page: parseInt(page),
    maxLimit,
    status: draft,
    title,
  });

  useEffect(() => {
    refetch();
    if (data) {
      setBlogs(data?.data?.blogs);
    }

    // setPage(data?.data?.pagination?.nextPage);
  }, [data, page, draft, title, value, refetch]);

  console.log("data_police", data);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setDraft(newValue === 0 ? "published" : "draft"); // Update draft state based on tab
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 2 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Manage Your Blogs
        </Typography>
        <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Search by title"
            fullWidth
            margin="normal"
            onChange={(e) => setTitle(e.target.value)} // Update state on change
          />
        </Box>
      </Box>
      <Tabs
        value={value}
        onChange={handleChange}
        sx={{
          mb: 3,
          "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.primary.main,
          },
        }}
      >
        <Tab label="Published Blogs" />
        <Tab label="Draft Blogs" />
      </Tabs>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {isLoading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Box key={index}>
              <Skeleton variant="rectangular" width="100%" height={200} />
            </Box>
          ))
        ) : (
          blogs.length === 0 ? (
            <Typography variant="h6" component="h3" gutterBottom>
              No blogs found
            </Typography>
          ) : (
            blogs.map((blog) => <ManageBlogCard key={blog._id} blog={blog} />)
          )
        )}
      </Box>
    </Container>
  );
};

export default DashboardBlogsPage;
