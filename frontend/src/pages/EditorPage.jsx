// components/BlogEditor/EditorPage.js
import { useEffect, useState } from "react";
import BlogEditorComponent from "../components/BlogEditorComponent";
import PublishBlogComponent from "../components/PublishBlogComponent";
import { Box } from "@mui/material";
import { AnimatedPage } from "../common/AnimatedPage";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useGetBlogBySlugQuery } from "../redux/api/blogApiSlice";
import axios from "axios";

const EditorPage = () => {
  const { slug } = useParams();
  console.log("adsfdas", slug);

  // Use the refetch option to ensure fresh data is fetched

  // useEffect(() => {
  //   refetch();
  // }, [slug]);

  // const editorBlogData = data?.data;
  // console.log("editorBlogData after fetching", editorBlogData);

  const [editorState, setEditorState] = useState("editor");
  const [isLoading, setIsLoading] = useState(false);
  // const [textEditor, setTextEditor] = useState({ isReady: false });
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

  console.log("dafds", blogData);

  useEffect(() => {
    const fetchBlogData = async () => {
      setIsLoading(true);
      if (!slug) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL_DEVELOP
          }/blog/get-blog-by-slug/${slug}?draft=true&mode='edit'`
        );
        console.log("datasdafads", data);
        setBlogData(data?.data);
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, [slug]);

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
