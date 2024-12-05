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
  }),
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useGetByCategoryQuery,
} = categoryApiSlice;
