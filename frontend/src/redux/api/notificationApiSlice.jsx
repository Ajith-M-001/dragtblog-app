import { apiSlice } from "./apiSlice";

const NOTIFICATION_URL = "/notification";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNewNotification: builder.query({
      query: () => `${NOTIFICATION_URL}/new-notification`,
    }),
  }),
});

export const { useGetNewNotificationQuery } = notificationApiSlice;
