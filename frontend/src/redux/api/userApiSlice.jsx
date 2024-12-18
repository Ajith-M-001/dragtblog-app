import apiSlice from "./apiSlice";

const USER_URL = "/auth";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (userData) => ({
        url: `${USER_URL}/signup`,
        method: "POST",
        body: userData,
      }),
    }),
    signin: builder.mutation({
      query: (credentials) => ({
        url: `${USER_URL}/signin`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    verifyOTP: builder.mutation({
      query: (otpData) => ({
        url: `${USER_URL}/verify-otp`,
        method: "PUT",
        body: otpData,
      }),
    }),
    resendOTP: builder.mutation({
      query: (emailData) => ({
        url: `${USER_URL}/resend-otp`,
        method: "POST",
        body: emailData,
      }),
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: `${USER_URL}/user/profile`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query: (emailData) => ({
        url: `${USER_URL}/forgot-password`,
        method: "POST",
        body: emailData,
      }),
    }),
    resetPassword: builder.mutation({
      query: (resetData) => ({
        url: `${USER_URL}/reset-password`,
        method: "PUT",
        body: resetData,
      }),
    }),
    verifyResetOTP: builder.mutation({
      query: (otpData) => ({
        url: `${USER_URL}/verify-reset-otp`,
        method: "POST",
        body: otpData,
      }),
    }),
    searchUser: builder.query({
      query: (query) => ({
        url: `${USER_URL}/search-user?query=${query}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getUserByUsername: builder.query({
      query: ({ username, page = 1, maxLimit = 5 }) => ({
        url: `${USER_URL}/getUser/${username}`,
        method: "GET",
        params: {
          page, // add page as a query parameter
          maxLimit, // add maxLimit as a query parameter
        },
      }),
      providesTags: ["User"],
    }),
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: `${USER_URL}/change-password`,
        method: "PUT",
        body: passwordData,
      }),
      invalidatesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: `${USER_URL}/update-profile`,
        method: "PUT",
        body: profileData,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    followUser: builder.mutation({
      query: (userId) => ({
        url: `${USER_URL}/follow/${userId}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    unfollowUser: builder.mutation({
      query: (userId) => ({
        url: `${USER_URL}/unfollow/${userId}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLogoutMutation,
  useSigninMutation,
  useSignupMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useGetUserProfileQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyResetOTPMutation,
  useSearchUserQuery,
  useGetUserByUsernameQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
} = userApiSlice;
