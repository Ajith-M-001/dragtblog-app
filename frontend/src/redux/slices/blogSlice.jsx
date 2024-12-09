import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    currentBlog: null,
    isLiked: false,
    commentsWrapper: false,
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
  },
});

export const selectCurrentBlog = (state) => state.blog.currentBlog;
export const selectIsLiked = (state) => state.blog.isLiked;
export const selectCommentsWrapper = (state) => state.blog.commentsWrapper;

export const {
  setCurrentBlog,
  clearCurrentBlog,
  setIsLiked,
  setCommentsWrapper,
} = blogSlice.actions;
export default blogSlice.reducer;
