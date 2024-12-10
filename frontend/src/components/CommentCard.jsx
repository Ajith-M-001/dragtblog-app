import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ReplyIcon from "@mui/icons-material/Reply";
import CommentField from "./CommentField";
import { useState } from "react";

/* eslint-disable react/prop-types */
const CommentCard = ({ comment, slug }) => {
  const level = comment?.level;
  const theme = useTheme();
  const [openReply, setOpenReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  console.log("dsfasdfsdaf", comment);

  const handleReply = () => {
    setOpenReply((prev) => !prev);
  };

  const handleShowReplies = () => {
    setShowReplies((prev) => !prev);
  };

  return (
    <Box sx={{ p: 2, ml: level * 5 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 4 }}>
        <Avatar
          src={comment?.author?.profilePicture}
          sx={{ width: 25, height: 25, mr: 3, mt: 1 }}
          alt={comment?.author?.username}
        />
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
            component="span"
            sx={{ fontWeight: "bold", mr: 4 }}
          >
            {comment.author.username}
          </Typography>
          <Typography variant="body2" component="span" color="text.secondary">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
            {comment.isEdited && " (edited)"}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
            {comment.comment}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton size="small" aria-label="like">
                <ThumbUpIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2" sx={{ mr: 2 }}>
                {comment?.likes?.length}
              </Typography>
              <Button
                onClick={handleShowReplies}
                variant="text"
                size="small"
                sx={{ color: theme.palette.text.secondary }}
                disabled={comment?.replies?.length === 0}
              >
                {showReplies
                  ? "Hide replies"
                  : `Show replies (${comment?.replies.length})`}
              </Button>
            </Box>

            <IconButton
              onClick={() => handleReply(comment)}
              size="small"
              aria-label="reply"
            >
              <ReplyIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      {openReply && (
        <CommentField
          comment={comment}
          action={"reply"}
          slug={slug}
          setOpenReply={setOpenReply}
        />
      )}

      {showReplies && comment.replies && comment.replies.length > 0 && (
        <Box>
          {comment.replies.map((reply) => (
            <CommentCard key={reply._id} comment={reply} slug={slug} />
          ))}
        </Box>
      )}
      {!showReplies && <Divider />}
      
    </Box>
  );
};

export default CommentCard;
