/* eslint-disable react/prop-types */
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useUploadBannerMutation } from "../redux/api/blogApiSlice";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Underline from "@editorjs/underline";
import LinkTool from "@editorjs/link";
import InlineCode from "@editorjs/inline-code";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";
// import Warning from "@editorjs/warning";
import Delimiter from "@editorjs/delimiter";
import useAutoSave from "../hooks/useAutoSave";

// eslint-disable-next-line react/prop-types
const BlogEditorComponent = ({ blogData, setBlogData, setEditorState }) => {
  const theme = useTheme();
  const imageRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const editorRef = useRef(null);
  const dispatch = useDispatch();

  const { saveStatus, handleAutoSave } = useAutoSave(blogData);
  const [uploadBanner, { isLoading: isUploading }] = useUploadBannerMutation();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (blogData.isDirty) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Save current state when component unmounts
      localStorage.setItem("blogDraft", JSON.stringify(blogData));
    };
  }, [blogData]);

  useEffect(() => {
    if (editorRef.current) {
      return;
    }

    const editor = new EditorJS({
      holder: "editorjs",
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3, 4],
            defaultLevel: 1,
          },
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },

        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: async (file) => {
                try {
                  const formData = new FormData();
                  formData.append("image", file);

                  const response = await fetch(
                    "http://localhost:3000/api/v1/blog/upload-image",
                    {
                      method: "POST",
                      body: formData,
                    }
                  );

                  console.log("resonseaa", response);

                  if (!response.ok) {
                    throw new Error(response.error || "Upload failed");
                  }

                  const result = await response.json();
                  console.log("resultaa", result);

                  return {
                    success: 1,
                    file: {
                      url: result.data.secure_url,
                    },
                  };
                } catch (error) {
                  console.error("Upload error:", error);
                  return {
                    success: 0,
                    error: "Upload failed",
                  };
                }
              },
            },
          },
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              coub: true,
              codepen: true,
              twitter: true,
              instagram: true,
            },
          },
        },
        underline: {
          class: Underline,
        },
        linkTool: {
          class: LinkTool,
          inlineToolbar: true,
          config: {
            // Provide a dummy endpoint if you don't have backend link fetching
            endpoint: "https://example.com/link-fetch",
          },
        },
        inlineCode: {
          class: InlineCode,
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote's author",
          },
        },
        marker: {
          class: Marker,
        },
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          },
        },
        code: {
          class: CodeTool,
          config: {
            placeholder: "Enter code here...",
          },
        },
        // warning: {
        //   class: Warning,
        //   inlineToolbar: true,
        //   config: {
        //     titlePlaceholder: "Title",
        //     messagePlaceholder: "Message",
        //   },
        // },
        delimiter: {
          class: Delimiter,
        },
      },
      data: blogData.content || {
        blocks: [],
      },
      onChange: async () => {
        const data = await editor.save();
        setBlogData((prevState) => ({
          ...prevState,
          content: data,
          isDirty: true,
          lastSaved: new Date().toISOString(),
        }));
        handleAutoSave({ content: data });
      },
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      console.log(formData);
      const { data } = await uploadBanner(formData).unwrap();
      setBlogData({ ...blogData, banner: data.secure_url });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setBlogData({ ...blogData, title });
    handleAutoSave({ title });
  };

  const handlePreviewClick = () => {
    dispatch(setEditorState("preview"));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="inherit" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontSize: {
                  xs: theme.typography.fontSizes.sm,
                  sm: theme.typography.fontSizes.xl,
                },
                fontFamily: "'Pacifico', cursive",
                color: "inherit",
              }}
            >
              Blogify
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontStyle: "italic",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {saveStatus} in drafts
              </Typography>
              <Button onClick={handlePreviewClick} variant="containedPrimary">
                Publish
              </Button>
              <Avatar
                sx={{
                  width: 35,
                  height: 35,
                  cursor: "pointer",
                }}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container className="min-height" maxWidth="md">
        <Box
          onClick={() => !blogData?.banner && imageRef.current.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            py: theme.spacing(3),
            border: blogData.banner
              ? "none"
              : `2px dashed ${isDragging ? "white" : "grey"}`,
            borderRadius: theme.spacing(2),
            my: theme.spacing(5),
            aspectRatio: "16/9",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: blogData.banner ? "default" : "pointer",
            transition: "all 0.2s ease-in-out",
            backgroundColor: blogData.banner
              ? "none"
              : theme.palette.background.input,
          }}
        >
          <input
            ref={imageRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileUpload}
          />
          {isUploading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <CircularProgress sx={{ color: theme.palette.text.primary }} />
              <Typography variant="body2" color="textSecondary">
                Uploading image...
              </Typography>
            </Box>
          ) : (
            <>
              {blogData.banner ? (
                <Box
                  sx={{ position: "relative", width: "100%", height: "100%" }}
                >
                  <img
                    src={blogData.banner}
                    alt="Blog banner"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: theme.spacing(3),
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      p: 1,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      borderBottomLeftRadius: 1, // theme.shape.borderRadius
                    }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBlogData({ ...blogData, banner: null });
                      }}
                    >
                      Change Image
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: "center" }}>
                  <CloudUploadIcon
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="textPrimary" gutterBottom>
                    Select a banner image for your blog
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Drag and drop an image here, or click to select a file
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ display: "block", mt: 1 }}
                  >
                    Recommended: 1200 x 600px or larger
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter your blog title"
          value={blogData.title || ""}
          onChange={handleTitleChange}
          sx={{
            mt: theme.spacing(3),
            "& .MuiOutlinedInput-input": {
              fontSize: theme.typography.h6.fontSize,
              fontWeight: theme.typography.h6.fontWeight,
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.text.primary,
              },
            },
          }}
        />

        <Box
          id="editorjs"
          sx={{
            width: "100%",
            mt: theme.spacing(3),
            backgroundColor: theme.palette.background.input,
            borderRadius: theme.spacing(1),
            padding: theme.spacing(2),
            marginBottom: theme.spacing(10),
            border: `1px solid ${theme.palette.divider}`,
            "& .codex-editor": {
              minHeight: "100px",
            },
            "& .ce-block__content": {
              maxWidth: "100%",
              margin: 0,
            },
            "& .ce-toolbar__content": {
              maxWidth: "100%",
              margin: 0,
            },
            "& .cdx-block": {
              maxWidth: "100%",
            },
            "& .ce-paragraph": {
              fontSize: theme.typography.body1.fontSize,
              color: theme.palette.text.primary,
            },
            "& .ce-header": {
              color: theme.palette.text.primary,
            },
            "& .cdx-input": {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
              padding: theme.spacing(1),
            },
            "& .ce-toolbar__plus": {
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            },
            "& .ce-toolbar__settings-btn": {
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            },
            "& .cdx-settings-button": {
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            },
            "& .ce-inline-toolbar": {
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
              "& .ce-inline-tool": {
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              },
            },
            "& .ce-conversion-toolbar": {
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
              "& .ce-conversion-tool": {
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              },
            },
          }}
        />
      </Container>
    </Box>
  );
};

export default BlogEditorComponent;
