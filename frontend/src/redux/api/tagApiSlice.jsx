import apiSlice from "./apiSlice";

const TAG_URL = "/tag";

const tagApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTag: builder.mutation({
      query: (tagData) => ({
        url: `${TAG_URL}/create`,
        method: "POST",
        body: tagData,
      }),
      invalidatesTags: ["Tag"],
    }),
    getAllTags: builder.query({
      query: () => ({
        url: `${TAG_URL}/getAll`,
      }),
      providesTags: ["Tag"],
    }),
  }),
});

export const { useCreateTagMutation, useGetAllTagsQuery } = tagApiSlice;
