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
  }),
});

export const { useCreateCommentMutation, useGetCommentsQuery } =
  commentApiSlice;
