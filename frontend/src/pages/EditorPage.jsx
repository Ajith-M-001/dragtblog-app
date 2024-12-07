// components/BlogEditor/EditorPage.js
import { useEffect, useState } from "react";
import BlogEditorComponent from "../components/BlogEditorComponent";
import PublishBlogComponent from "../components/PublishBlogComponent";
import { Box } from "@mui/material";
import { AnimatedPage } from "../common/AnimatedPage";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useGetBlogBySlugQuery } from "../redux/api/blogApiSlice";

const EditorPage = () => {
  const { slug } = useParams();

  // Use the refetch option to ensure fresh data is fetched
  const { data, isLoading, refetch } = useGetBlogBySlugQuery(slug, {
    refetchOnMountOrArgChange: true, // This will refetch data when the component mounts or the slug changes
  });

  useEffect(() => {
    refetch();
  }, [slug]);

  const editorBlogData = data?.data;
  console.log("editorBlogData after fetching", editorBlogData);

  const [editorState, setEditorState] = useState("editor");
  const [blogData, setBlogData] = useState({
    title: "",
    banner: null,
    content: null,
    tags: [],
    categories: "",
    metaDescription: "",
    status: "draft",
    scheduledDate: null,
    lastSaved: null,
    isDirty: false,
    slug: "",
  });

  useEffect(() => {
    if (editorBlogData) {
      setBlogData({
        title: editorBlogData?.title,
        banner: editorBlogData?.banner?.url,
        content: editorBlogData?.content,
        tags: editorBlogData?.tags,
        categories: editorBlogData?.categories,
        metaDescription: editorBlogData?.metaDescription,
        status: editorBlogData?.status,
        scheduledDate: editorBlogData?.scheduledDate,
        lastSaved: editorBlogData?.lastSaved,
        isDirty: false,
        slug: editorBlogData?.slug,
      });
    }
  }, [editorBlogData, slug]);

  console.log("dafds", blogData);

  useEffect(() => {
    localStorage.setItem("blogDraft", JSON.stringify(blogData));
  }, [blogData]);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  const contentVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <AnimatedPage>
      <Box sx={{ minHeight: "min-height", bgcolor: "background.default" }}>
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={contentVariants}
        >
          {editorState === "editor" ? (
            <BlogEditorComponent
              blogData={blogData}
              setBlogData={setBlogData}
              setEditorState={setEditorState}
            />
          ) : (
            <PublishBlogComponent
              blogData={blogData}
              setBlogData={setBlogData}
              setEditorState={setEditorState}
            />
          )}
        </motion.div>
      </Box>
    </AnimatedPage>
  );
};

export default EditorPage;
