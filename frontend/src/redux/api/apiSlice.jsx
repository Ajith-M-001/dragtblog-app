import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../slices/userSlice";
import { showNotification } from "../slices/notificationSlice";

const baseQuery = fetchBaseQuery({
  baseUrl:
    import.meta.env.VITE_CURRENT_ENVIRONMENT === "production"
      ? import.meta.env.VITE_API_BASE_URL_PRODUCTION
      : import.meta.env.VITE_API_BASE_URL_DEVELOP,
  credentials: "include",
});

console.log("asdf", import.meta.env.VITE_API_BASE_URL_DEVELOP);

// Create a custom navigation event
const customNavigate = new CustomEvent("tokenExpired");

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Dispatch logout action
    api.dispatch(logout());

    // Show notification
    api.dispatch(
      showNotification({
        message: "Session expired. Please sign in again.",
        severity: "info",
      })
    );

    // Dispatch custom event for navigation
    window.dispatchEvent(customNavigate);
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Blog", "Category"],
  endpoints: (builder) => ({}),
});

export default apiSlice;
