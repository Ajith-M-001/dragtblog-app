import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ReplyIcon from "@mui/icons-material/Reply";
import CommentField from "./CommentField";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteCommentMutation } from "../redux/api/commentApiSlice";
import { showNotification } from "../redux/slices/notificationSlice";

/* eslint-disable react/prop-types */
const CommentCard = ({ comment, slug }) => {
  const level = comment?.level;
  const theme = useTheme();
  const [openReply, setOpenReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [deleteComment] = useDeleteCommentMutation();

  console.log("dsfasdfsdaf", comment?.blog?.author);

  const isCommentAuthor = comment?.author?._id === userInfo?._id;
  const isBlogAuthor = comment?.blog?.author === userInfo?._id;
  const isAdmin = userInfo.role === "admin" ? true : false;

  const handleReply = () => {
    setOpenReply((prev) => !prev);
  };

  const handleShowReplies = () => {
    setShowReplies((prev) => !prev);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    setIsEditing(true);
    handleMenuClose();
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    handleMenuClose();
  };

  const handleDelete = async () => {
    // TODO: Implement delete functionality
    console.log("commentId", comment._id);
    try {
      const response = await deleteComment({ commentId: comment._id });
      console.log("response", response);
      dispatch(
        showNotification({
          open: true,
          message: response?.data?.message || "Comment deleted successfully",
          severity: "success",
        })
      );
    } catch (error) {
      console.log("error", error);
    }
    handleMenuClose();
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                component="span"
                sx={{ fontWeight: "bold", mr: 4 }}
              >
                {comment.author.username}
              </Typography>
              <Typography
                variant="body2"
                component="span"
                color="text.secondary"
              >
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
                {comment.isEdited && " (edited)"}
              </Typography>
            </Box>
            {isCommentAuthor || isBlogAuthor || isAdmin ? (
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            ) : null}
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {isCommentAuthor && <MenuItem onClick={handleEdit}>Edit</MenuItem>}
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
          {isEditing ? (
            <CommentField
              comment={comment}
              action="edit"
              slug={slug}
              setOpenReply={handleEditComplete}
              initialText={comment.comment}
            />
          ) : (
            <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
              {comment.comment}
            </Typography>
          )}
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
