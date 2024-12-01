/* eslint-disable react/prop-types */
import {
  AppBar,
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { usePublishBlogMutation } from "../redux/api/blogApiSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
} from "../redux/api/categoryApiSlice";
import {
  useCreateTagMutation,
  useGetAllTagsQuery,
} from "../redux/api/tagApiSlice";
import MUIAutocomplete1 from "./MUIAutocomplete1";
import { showNotification } from "../redux/slices/notificationSlice";

// eslint-disable-next-line react/prop-types
const PublishBlogComponent = ({ blogData, setBlogData, setEditorState }) => {
  const { data: allCategories } = useGetAllCategoriesQuery();

  const { data: allTags } = useGetAllTagsQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [createTag] = useCreateTagMutation();

  const handleCreateCategory = async (category) => {
    console.log("category12", category);
    try {
      const response = await createCategory({
        categories: category,
      });
      if (response.data.data) {
        setBlogData({
          ...blogData,
          categories: response.data.data,
        });
      }
    } catch (error) {
      console.log("error", error);
      return error;
    }
  };

  const handleCreateTag = async (tag) => {
    console.log("tag12", tag);
    try {
      const response = await createTag({
        tag: tag,
      });
      console.log("response", response.data.data);
      if (response.data.data) {
        setBlogData({
          ...blogData,
          tags: [...(blogData.tags || []), response.data.data],
        });
      }
    } catch (error) {
      console.log("error", error);
      return error;
    }
  };

  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [publishBlog, { isLoading: publishBlogLoading }] =
    usePublishBlogMutation();

  const calculateReadingStats = () => {
    if (!blogData.content || !blogData.content.blocks)
      return { words: 0, minutes: 0 };

    const wordsPerMinute = 150; // Average reading speed
    let totalWords = 0;

    blogData.content.blocks.forEach((block) => {
      switch (block.type) {
        case "paragraph":
        case "header": {
          const text = block.data.text.replace(/<[^>]*>/g, "");
          totalWords += text.trim().split(/\s+/).length;
          break;
        }
        case "image":
          // Add 10 words for images (accounting for time to process visuals)
          totalWords += 10;
          break;
        default:
          break;
      }
    });

    const minutes = Math.ceil(totalWords / wordsPerMinute);
    return { words: totalWords, minutes };
  };

  // Function to render content blocks (paragraph, header, image, etc.)
  const renderBlock = (block) => {
    switch (block.type) {
      case "header":
        return (
          <Typography
            variant={`h${block.data.level}`}
            key={block.id}
            gutterBottom
            sx={{ fontWeight: 600, mt: theme.spacing(3) }}
          >
            {block.data.text}
          </Typography>
        );

      case "paragraph":
        return (
          <Typography variant="body1" key={block.id} gutterBottom>
            <span dangerouslySetInnerHTML={{ __html: block.data.text }} />
          </Typography>
        );

      case "image":
        return (
          <Box key={block.id} my={theme.spacing(2)}>
            <img
              src={block.data.file.url}
              alt={block.data.caption || "image"}
              style={{
                maxWidth: "100%",
                borderRadius: theme.shape.borderRadius,
              }}
            />
            {block.data.caption && (
              <Typography variant="caption" display="block" gutterBottom>
                {block.data.caption}
              </Typography>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  const handlePublishBlog = async () => {
    console.log("blogData cliked", blogData);
    const stats = calculateReadingStats();
    const blogDataWithStats = {
      ...blogData,
      readingTime: {
        minutes: stats.minutes,
        words: stats.words,
      },
      categories: blogData.categories.category,
      tags: blogData.tags.map((tag) => tag.tag),
      status: "published",
    };
    try {
      const response = await publishBlog(blogDataWithStats);
      console.log("response", response.data.message);
      console.log("response", response.data.data.message);
      if (response.data.data) {
        setEditorState("editor");
        setBlogData({});
        localStorage.removeItem("blogDraft");
        navigate("/");
      }
      dispatch(
        showNotification({
          message: response.data.message,
          type: response.data.success ? "success" : "error",
        })
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  const readingStats = calculateReadingStats();

  return (
    <Box>
      {/* Top AppBar */}
      <AppBar position="static" color="inherit" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setEditorState("editor")}
              sx={{ color: theme.palette.primary.main, fontWeight: 500 }}
            >
              Back to Editor
            </Button>
            <Button
              onClick={handlePublishBlog}
              variant="contained"
              color="primary"
              disabled={publishBlogLoading}
            >
              {publishBlogLoading ? "Publishing..." : "Publish"}
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid
          container
          spacing={4}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          {/* Left Column (Blog Preview) */}
          <Grid item xs={12} md={8}>
            <Card
              elevation={3}
              sx={{
                p: theme.spacing(2),
                borderRadius: theme.shape.borderRadius,
              }}
            >
              {/* Blog Title */}
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                {blogData.title || "Untitled Blog"}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {readingStats.minutes} min read • {readingStats.words} words
              </Typography>

              {/* Meta Description */}
              {blogData.metaDescription && (
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  {blogData.metaDescription}
                </Typography>
              )}

              {/* Banner Image */}
              {blogData.banner && (
                <CardMedia
                  component="img"
                  image={blogData.banner}
                  alt="Banner image"
                  sx={{
                    width: "100%",
                    borderRadius: theme.shape.borderRadius,
                    mb: 3,
                  }}
                />
              )}

              {/* Blog Content */}
              <Box sx={{ mt: 4 }}>
                {blogData.content && blogData.content.blocks.length > 0 ? (
                  blogData.content.blocks.map((block) => renderBlock(block))
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No content available
                  </Typography>
                )}
              </Box>
            </Card>
          </Grid>

          {/* Right Column (Metadata and Tags) */}
          <Grid item xs={12} md={4}>
            <Stack spacing={4}>
              {/* Meta Description Input */}
              <Paper
                elevation={3}
                sx={{
                  p: theme.spacing(2),
                  borderRadius: theme.shape.borderRadius,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Meta Description
                </Typography>
                <TextField
                  label="Description"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={blogData.metaDescription}
                  onChange={(e) =>
                    setBlogData({
                      ...blogData,
                      metaDescription: e.target.value,
                    })
                  }
                />
              </Paper>

              {/* Category Selection */}
              <Paper
                elevation={3}
                sx={{
                  p: theme.spacing(2),
                  borderRadius: theme.shape.borderRadius,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  category
                </Typography>
                <MUIAutocomplete1
                  freeSolo={true}
                  options={allCategories?.data || []}
                  getOptionLabel={(option) => option?.category || ""}
                  label="Category"
                  value={blogData.categories || null}
                  onChange={(e, value) => {
                    return setBlogData({
                      ...blogData,
                      categories: value,
                    });
                  }}
                  handleCreate={handleCreateCategory}
                />
              </Paper>

              {/* Tags  selection*/}
              <Paper
                elevation={3}
                sx={{
                  p: theme.spacing(2),
                  borderRadius: theme.shape.borderRadius,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Tags
                </Typography>
                <MUIAutocomplete1
                  isMultiple={true} // Allow multiple tag selections
                  freeSolo={true}
                  options={allTags?.data || []}
                  getOptionLabel={(option) => option?.tag || ""}
                  label="Tags"
                  value={blogData.tags || []}
                  onChange={(e, value) => {
                    setBlogData({
                      ...blogData,
                      tags: value,
                    });
                  }}
                  handleCreate={handleCreateTag}
                />
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PublishBlogComponent;
