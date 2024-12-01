// components/BlogEditor/EditorPage.js
import { useEffect, useState } from "react";
import BlogEditorComponent from "../components/BlogEditorComponent";
import PublishBlogComponent from "../components/PublishBlogComponent";
import { Box } from "@mui/material";
import { AnimatedPage } from "../common/AnimatedPage";
import { motion } from "framer-motion";

const EditorPage = () => {
  const [editorState, setEditorState] = useState("editor");
  const [blogData, setBlogData] = useState(() => {
    const blogDraft = localStorage.getItem("blogDraft");
    return blogDraft
      ? JSON.parse(blogDraft)
      : {
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
        };
  });

  useEffect(() => {
    localStorage.setItem("blogDraft", JSON.stringify(blogData));
  }, [blogData]);

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
