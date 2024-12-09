import { Box, IconButton, Skeleton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCommentsWrapper,
  selectCurrentBlog,
  setCommentsWrapper,
} from "../redux/slices/blogSlice";
import CommentField from "./CommentField";
import { useState } from "react";
import { useGetCommentsQuery } from "../redux/api/commentApiSlice";
import CommentCard from "./CommentCard";

const CommentsContainer = () => {
  const dispatch = useDispatch();
  const commentsWrapper = useSelector(selectCommentsWrapper);
  const currentBlog = useSelector(selectCurrentBlog);
  const [page, setPage] = useState(1);

  const comments = currentBlog?.blogActivity?.total_comments;
  const slug = currentBlog?.slug;

  const { data: commentsData, isLoading } = useGetCommentsQuery({
    blogId: slug,
    maxLimit: 5,
    page: page,
    sort: "desc",
  });

  console.log(commentsData);

  return (
    <Box
      sx={{
        width: "100%", // Make the width take up 100% of the parent
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Comments ({comments})
        </Typography>
        <IconButton
          size="small"
          onClick={() => dispatch(setCommentsWrapper(!commentsWrapper))}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {/* Add the actual comments content here */}
      <Box sx={{ p: 2 }}>
        <CommentField action="comment" slug={slug} />
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="body1">most recent</Typography>
        {isLoading ? (
          <Skeleton variant="rectangular" height={100} />
        ) : (
          <Box>
            {commentsData?.data?.comments &&
            commentsData?.data?.comments?.length > 0 ? (
              commentsData?.data?.comments?.map((comment) => (
                <>
                  <CommentCard key={comment._id} comment={comment} />
                </>
              ))
            ) : (
              <Typography variant="body1">No comments yet</Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CommentsContainer;
