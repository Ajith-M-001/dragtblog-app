import { apiSlice } from "./apiSlice";

const NOTIFICATION_URL = "/notification";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNewNotification: builder.query({
      query: () => `${NOTIFICATION_URL}/new-notification`,
      providesTags: ["Notification"],
    }),
    getNotification: builder.query({
      query: ({ page, maxLimit, filter }) => {
        return {
          url: `${NOTIFICATION_URL}/get-notification`,
          method: "GET",
          params: {
            page,
            maxLimit,
            filter,
          },
        };
      },
      providesTags: ["Notification"],
    }),
    markAsRead: builder.mutation({
      query: ({ notificationId }) => {
        console.log("notificationId_456", notificationId);
        return {
          url: `${NOTIFICATION_URL}/mark-as-read/${notificationId}`,
          method: "PUT",
        };
      },
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNewNotificationQuery,
  useGetNotificationQuery,
  useMarkAsReadMutation,
} = notificationApiSlice;
