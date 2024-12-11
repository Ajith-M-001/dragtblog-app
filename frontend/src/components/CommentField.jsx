/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Button,
  TextareaAutosize,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateCommentMutation,
  useEditCommentMutation,
} from "../redux/api/commentApiSlice";
import { showNotification } from "../redux/slices/notificationSlice";

const CommentField = ({
  action,
  slug,
  comment: replyComment,
  setOpenReply,
  initialText,
}) => {
  console.log("setOpenReply", setOpenReply);
  const theme = useTheme();
  const [comment, setComment] = useState(initialText || "");
  const { userInfo } = useSelector((state) => state.user);
  const MAX_CHARACTERS = 200;
  const dispatch = useDispatch();
  const [createComment, { isLoading }] = useCreateCommentMutation();
  const [editComment, { isLoading: isEditing }] = useEditCommentMutation();

  const handleCommentChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARACTERS) {
      setComment(text);
    }
  };

  const handleAddComment = async (e, replyComment) => {
    e.preventDefault();
    if (!userInfo) {
      alert("Please login to add a comment");
      return;
    }
    try {
      let res;
      if (action === "edit") {
        res = await editComment({
          commentId: replyComment._id,
          comment,
        }).unwrap();
      } else {
        res = await createComment({
          blogId: slug,
          comment,
          parentCommentId: replyComment ? replyComment._id : null,
        }).unwrap();
      }
      console.log("res", res);
      setComment("");
      dispatch(
        showNotification({
          open: true,
          message: res.message,
          severity: res.status,
        })
      );
      if (action !== "comment") {
        setOpenReply((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
      dispatch(
        showNotification({
          open: true,
          message: error?.data?.message || "Something went wrong",
          severity: "error",
        })
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        position: "relative",
        padding: 2,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      {action === "comment" && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
          }}
        >
          <Avatar
            alt="User Profile"
            src={userInfo?.profilePicture}
            sx={{ width: 40, height: 40 }}
          />
          <Typography variant="body1" sx={{ fontWeight: 550 }}>
            {userInfo?.username}
          </Typography>
        </Box>
      )}
      <Box sx={{ width: "100%", p: 2 }}>
        <TextareaAutosize
          value={comment}
          onChange={handleCommentChange}
          minRows={3}
          maxRows={4}
          placeholder="what are your thoughts?"
          style={{
            width: "100%",
            resize: "none",
            border: `1px solid ${theme.palette.divider}`,
            outline: "none",
            backgroundColor: "transparent",
            fontSize: "1rem",
            lineHeight: 1.4,
            padding: "12px 8px 12px",
            fontFamily: "inherit",
            color: theme.palette.text.primary,
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.8rem",
            transition: "opacity 0.3s ease",
          }}
        >
          {MAX_CHARACTERS - comment.length} characters left
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <Button
          onClick={(e) => handleAddComment(e, replyComment)}
          size="small"
          disabled={isLoading || isEditing || comment.trim() === ""}
          variant="contained"
          color="primary"
        >
          {action === "edit" ? `Save changes` : `Add ${action}`}
        </Button>
      </Box>
    </Box>
  );
};

export default CommentField;
