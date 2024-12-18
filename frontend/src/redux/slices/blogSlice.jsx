import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    currentBlog: null,
    isLiked: false,
    commentsWrapper: false,
    isBookMarked: false,
    isFollowing:false
  },
  reducers: {
    setCurrentBlog: (state, action) => {
      state.currentBlog = action.payload;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    setIsLiked: (state, action) => {
      state.isLiked = action.payload;
    },
    setCommentsWrapper: (state, action) => {
      state.commentsWrapper = action.payload;
    },
    setIsBookmarked: (state, action) => {
      state.isBookMarked = action.payload;
    },
    setIsFollowing: (state, action) => {
      state.isFollowing = action.payload;
    },
  },
});

export const selectCurrentBlog = (state) => state.blog.currentBlog;
export const selectIsLiked = (state) => state.blog.isLiked;
export const selectIsBookmarked = (state) => state.blog.isBookMarked;
export const selectIsFollowing = (state) => state.blog.isFollowing;
export const selectCommentsWrapper = (state) => state.blog.commentsWrapper;

export const {
  setCurrentBlog,
  clearCurrentBlog,
  setIsLiked,
  setCommentsWrapper,
  setIsBookmarked,
  setIsFollowing,
} = blogSlice.actions;
export default blogSlice.reducer;
