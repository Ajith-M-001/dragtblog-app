import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    currentBlog: null,
  },
  reducers: {
    setCurrentBlog: (state, action) => {
      state.currentBlog = action.payload;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
  },
});

export const selectCurrentBlog = (state) => state.blog.currentBlog;

export const { setCurrentBlog, clearCurrentBlog } = blogSlice.actions;
export default blogSlice.reducer;
