import apiSlice from "./apiSlice";

const CATEGORY_URL = "/category";

const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: `${CATEGORY_URL}/create`,
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Category"],
    }),
    getAllCategories: builder.query({
      query: () => ({
        url: `${CATEGORY_URL}/getall`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    getByCategory: builder.query({
      query: (category) => ({
        url: `${CATEGORY_URL}/get-By-Category/${category}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    followCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORY_URL}/followcategory/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Category"],
    }),
    unfollowCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORY_URL}/unfollowcategory/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useGetByCategoryQuery,
  useFollowCategoryMutation,
  useUnfollowCategoryMutation,
} = categoryApiSlice;
