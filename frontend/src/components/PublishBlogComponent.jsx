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
import { useEditBlogMutation, usePublishBlogMutation } from "../redux/api/blogApiSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useGetByCategoryQuery,
} from "../redux/api/categoryApiSlice";
import {
  useCreateTagMutation,
  useGetAllTagsQuery,
  useGetByTagQuery,
} from "../redux/api/tagApiSlice";
import MUIAutocomplete1 from "./MUIAutocomplete1";
import { showNotification } from "../redux/slices/notificationSlice";
import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const PublishBlogComponent = ({ blogData, setBlogData, setEditorState }) => {
  const { data: allCategories } = useGetAllCategoriesQuery();

  const { data: allTags } = useGetAllTagsQuery();
  const [tagData, setTagData] = useState([]);

  const [createCategory] = useCreateCategoryMutation();
  const [createTag] = useCreateTagMutation();

  console.log("Dfasdfasd", allTags);

  console.log("dasfdsfdas", blogData?.tags);

  const filteredTags = allTags?.data?.filter(
    (tag) => blogData.tags && blogData?.tags.includes(tag.tag)
  );
  console.log("filteredTags", filteredTags);

  if (filteredTags?.length > 0) {
    blogData.tags = filteredTags;
  }

  console.log("blogDatafdfds", blogData);

  // i want like
  // [
  //   "agatha all along",
  //   "marvel",
  //   {
  //     meta: {
  //       total_views: 0,
  //       total_followers: 0,
  //     },
  //     _id: "67467a0a448dfc4546c143a5",
  //     tag: "eternals",
  //     slug: "eternals",
  //     description: "",
  //     blogs: ["67467a1c448dfc4546c143ac"],
  //     followers: [],
  //     tag_used_count: 1,
  //     created_by: "67451d7092c58605395f1869",
  //     createdAt: "2024-11-27T01:46:50.965Z",
  //     updatedAt: "2024-11-27T01:47:08.572Z",
  //     __v: 0,
  //   },
  // ];

  useEffect(() => {
    const fetchTagData = async () => {
      const promises = blogData?.tags.map((tag) =>
        dispatch(useGetByTagQuery.initiate(tag)).unwrap()
      );
      try {
        const results = await Promise.all(promises);
        console.log("results", results);
        setTagData(results);
      } catch (error) {
        console.error("Error fetching tags data", error);
      }
    };

    if (blogData?.tags && blogData?.tags.length > 0) {
      fetchTagData();
    }
  }, [blogData?.tags]);

  console.log("tagData", tagData);

  const { data: categoryData } = useGetByCategoryQuery(blogData?.categories);
  console.log("categoryData", categoryData?.data);
  if (categoryData?.data) {
    blogData.categories = categoryData?.data;
  }

  const handleCreateCategory = async (category) => {
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
      return error;
    }
  };

  const handleCreateTag = async (tag) => {
    try {
      const response = await createTag({
        tag: tag,
      });
      if (response.data.data) {
        setBlogData({
          ...blogData,
          tags: [...(blogData.tags || []), response.data.data],
        });
      }
    } catch (error) {
      return error;
    }
  };

  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [publishBlog, { isLoading: publishBlogLoading }] =
    usePublishBlogMutation();
  const [editBlog, { isLoading: editBlogLoading }] = useEditBlogMutation();

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
      case "paragraph": {
        return (
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{ __html: block.data.text }}
          />
        );
      }
      case "header": {
        const HeaderTag = `h${block.data.level}`;
        return <HeaderTag>{block.data.text}</HeaderTag>;
      }
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
      case "link":
        return <Link href={block.data.link}>{block.data.link}</Link>;
      case "quote":
        return (
          <Box
            my={theme.spacing(3)}
            key={block.id}
            sx={{
              position: "relative",
              backgroundColor: theme.palette.background.default,
              borderLeft: `6px solid ${theme.palette.primary.main}`,
              borderRadius: "4px",
              padding: theme.spacing(3),
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              fontStyle: "italic", // Italicize the quote
              color: theme.palette.text.primary,
              "&:before": {
                content: '"“"',
                position: "absolute",
                top: "-10px",
                left: "-10px",
                fontSize: "50px",
                color: theme.palette.primary.main,
                opacity: 0.1, // Slight opacity for decorative quotation mark
              },
            }}
          >
            <Typography
              variant="body1"
              component="blockquote"
              sx={{
                fontSize: "1.2rem", // Slightly larger font for quotes
                lineHeight: 1.6,
                textAlign: block.data.alignment || "left", // Default to left alignment
              }}
            >
              {block.data.text}
            </Typography>

            {block.data.caption && (
              <Typography
                sx={{
                  mt: theme.spacing(2),
                  textAlign: "right",
                  fontSize: "0.9rem",
                  fontStyle: "normal", // Normal text for caption
                  color: theme.palette.text.secondary,
                }}
                variant="caption"
                display="block"
                gutterBottom
              >
                — {block.data.caption}
              </Typography>
            )}
          </Box>
        );

      case "list": {
        const ListTag = block.data.style === "ordered" ? "ol" : "ul"; // Determine the list type
        return (
          <Box key={block.id} my={theme.spacing(2)}>
            <ListTag>
              {block.data.items.map((item, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: item }} /> // Render list items
              ))}
            </ListTag>
          </Box>
        );
      }
      case "table": {
        return (
          <Box key={block.id} my={theme.spacing(2)}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {block.data.content.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        style={{ border: "1px solid #ccc", padding: "8px" }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        );
      }
      case "code": {
        return (
          <Box key={block.id} my={theme.spacing(2)}>
            <pre
              style={{
                backgroundColor: theme.palette.background.paper, // Use theme background
                color: theme.palette.text.primary, // Use theme text color
                padding: "10px",
                borderRadius: "4px",
                overflowX: "auto", // Allow horizontal scrolling for long lines
              }}
            >
              <code>{block.data.code}</code>
            </pre>
          </Box>
        );
      }
      case "delimiter": {
        return (
          <Box key={block.id} my={theme.spacing(2)}>
            <hr
              style={{
                border: "1px solid",
                borderColor: theme.palette.divider,
              }}
            />
          </Box>
        );
      }
      default:
        return null;
    }
  };

  const handlePublishBlog = async () => {
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

  const handleEditBlog = async () => {
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
    console.log("blogDataWithStats", blogDataWithStats);
    try {
      const response = await editBlog({
        slug: blogData.slug,
        blogData: blogDataWithStats,
      });
      if (response.data.data) {
        setEditorState("editor");
        setBlogData({});
        localStorage.removeItem("blogDraft");
        navigate("/");
      }
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
            {/* Conditional Button Rendering */}
            {blogData.slug === "" ? (
              <Button
                onClick={handlePublishBlog}
                variant="contained"
                color="primary"
                disabled={publishBlogLoading}
              >
                {publishBlogLoading ? "Publishing..." : "Publish"}
              </Button>
            ) : (
              <Button
                onClick={handleEditBlog}
                variant="contained"
                color="primary"
                disabled={editBlogLoading}  
              >
                {editBlogLoading ? "Editing..." : "Edit Blog"}
              </Button>
            )}
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
                  value={blogData?.categories || null}
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
