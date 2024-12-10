import {
  Box,
  Button,
  IconButton,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCommentsWrapper,
  selectCurrentBlog,
  setCommentsWrapper,
} from "../redux/slices/blogSlice";
import CommentField from "./CommentField";
import { useEffect, useState } from "react";
import { useGetCommentsQuery } from "../redux/api/commentApiSlice";
import CommentCard from "./CommentCard";

const CommentsContainer = () => {
  const dispatch = useDispatch();
  const commentsWrapper = useSelector(selectCommentsWrapper);
  const currentBlog = useSelector(selectCurrentBlog);
  const [page, setPage] = useState(1);
  const [allComments, setAllComments] = useState([]);

  const theme = useTheme();

  const comments = currentBlog?.blogActivity?.total_comments;
  const slug = currentBlog?.slug;

  const { data: commentsData, isLoading } = useGetCommentsQuery({
    blogId: slug,
    maxLimit: 5,
    page: page,
    sort: "desc",
  });

  useEffect(() => {
    if (commentsData?.data?.comments) {
      if (page === 1) {
        setAllComments(commentsData.data.comments);
      } else {
        // Add only unique comments by checking IDs
        setAllComments((prev) => {
          const existingIds = new Set(prev.map((comment) => comment._id));
          const newComments = commentsData.data.comments.filter(
            (comment) => !existingIds.has(comment._id)
          );
          return [...prev, ...newComments];
        });
      }
    }
  }, [commentsData, page]);

  console.log("commentsData123", commentsData);

  const handleLoadMore = (commentsData) => {
    setPage(commentsData?.data?.nextPage);
  };

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
            {allComments && allComments?.length > 0 ? (
              allComments?.map((comment) => (
                <>
                  <CommentCard
                    key={comment._id}
                    comment={comment}
                    slug={slug}
                  />
                </>
              ))
            ) : (
              <Typography variant="body1">No comments yet</Typography>
            )}
          </Box>
        )}
      </Box>
      {commentsData?.data?.hasNextPage && (
        <Box sx={{ px: 2 }}>
          <Button
            onClick={() => handleLoadMore(commentsData)}
            variant="text"
            size="small"
            sx={{ color: theme.palette.text.secondary }}
          >
            Load more comments
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CommentsContainer;
