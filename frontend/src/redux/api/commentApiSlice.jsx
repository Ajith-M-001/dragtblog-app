import { apiSlice } from "./apiSlice";

const COMMENTS_URL = "/comment";

export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: ({ blogId, comment, parentCommentId }) => ({
        url: `${COMMENTS_URL}/add-comment/${blogId}`,
        method: "POST",
        body: { comment, parentCommentId },
      }),
      invalidatesTags: ["Comment"],
    }),
    getComments: builder.query({
      query: ({ blogId, maxLimit, page, sort }) => ({
        url: `${COMMENTS_URL}/get-comments/${blogId}`,
        params: { maxLimit, page, sort },
      }),
      providesTags: ["Comment"],
    }),
    deleteComment: builder.mutation({
      query: ({ commentId }) => ({
        url: `${COMMENTS_URL}/delete-comment/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),
    editComment: builder.mutation({
      query: ({ commentId, comment }) => ({
        url: `${COMMENTS_URL}/edit-comment/${commentId}`,
        method: "PUT",
        body: { comment },
      }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetCommentsQuery,
  useDeleteCommentMutation,
  useEditCommentMutation,
} = commentApiSlice;
