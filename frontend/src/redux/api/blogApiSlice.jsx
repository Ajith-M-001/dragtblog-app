import apiSlice from "./apiSlice";

const BLOG_URL = "/blog";

const blogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadBanner: builder.mutation({
      query: (bannerData) => ({
        url: `${BLOG_URL}/upload-image`,
        method: "POST",
        body: bannerData,
        // formData: true, // Important for file uploads
      }),
      invalidatesTags: ["Blog"],
    }),
    publishBlog: builder.mutation({
      query: (blogData) => ({
        url: `${BLOG_URL}/publish-blog`,
        method: "POST",
        body: blogData,
      }),
      invalidatesTags: ["Blog"],
    }),
    getLatestBlogs: builder.query({
      query: ({ page, maxLimit }) => {
        console.log("dafasdf", page, maxLimit);
        return {
          url: `${BLOG_URL}/get-latest-blogs`,
          method: "GET",
          params: {
            page,
            maxLimit,
          },
        };
      },
      providesTags: ["Blog"],
    }),
    getTrendingBlogs: builder.query({
      query: () => ({
        url: `${BLOG_URL}/get-trending-blogs`,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),
    getUniqueCategories: builder.query({
      query: () => ({
        url: `${BLOG_URL}/get-unique-categories`,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),
    getBlogsByCategory: builder.query({
      query: (category) => ({
        url: `${BLOG_URL}/getBlogs`,
        method: "GET",
        params: {
          category, // Pass the category as a query parameter
        },
      }),
      providesTags: ["Blog"],
    }),
    getSearchResults: builder.query({
      query: ({ query, maxLimit, page }) => ({
        url: `${BLOG_URL}/search-blogs`,
        method: "GET",
        params: { query, maxLimit, page },
      }),
      providesTags: ["Blog"],
    }),
  }),
});

export const {
  useUploadBannerMutation,
  usePublishBlogMutation,
  useGetLatestBlogsQuery,
  useGetTrendingBlogsQuery,
  useGetUniqueCategoriesQuery,
  useGetBlogsByCategoryQuery,
  useGetSearchResultsQuery,
} = blogApiSlice;
