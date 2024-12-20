import { useState, useEffect, useCallback } from "react";
import "./App.css";
import PrimarySearchAppBar from "./components/NavBar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme, lightTheme } from "./common/theme";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import UserAuthForm from "./pages/UserAuthForm";
import Homepage from "./pages/Homepage";
import VerifyOTPForm from "./components/VerifyOTPForm";
import AuthSuccess from "./components/AuthSuccess";
import AuthFailure from "./components/AuthFailure";
import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "./redux/slices/notificationSlice";
import NotificationSnackbar from "./components/NotificationSnackbar";
import ForgotPassword from "./pages/ForgotPassword";
import EditorPage from "./pages/EditorPage";
import CategoryPage from "./pages/CategoryPage";
// import SearchPage from "./pages/SearchPage";
import NotFoundPage from "./components/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import Search from "./pages/Search";
import DetailedBlogPage from "./pages/DetailedBlogPage";
import SideNavBar from "./components/SideNavBar";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import NotificationPage from "./pages/NotificationPage";
import DashboardBlogsPage from "./pages/DashboardBlogsPage";

const useThemeMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prevMode) => !prevMode);
    // Optional: You can add localStorage to persist theme preference
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  return { isDarkMode, toggleTheme };
};

const App = () => {
  const { isDarkMode, toggleTheme } = useThemeMode();
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.Notification);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle token expiration navigation
    const handleTokenExpired = () => {
      navigate("/signin", { replace: true });
    };

    window.addEventListener("tokenExpired", handleTokenExpired);

    return () => {
      window.removeEventListener("tokenExpired", handleTokenExpired);
    };
  }, [navigate]);

  const handleCloseSnackbar = () => {
    dispatch(hideNotification());
  };

  return (
    <>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />

        <Routes>
          <Route
            path="/"
            element={
              <PrimarySearchAppBar
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
              />
            }
          >
            <Route index element={<Homepage />} />
            <Route path="signin" element={<UserAuthForm type="signin" />} />
            <Route path="signup" element={<UserAuthForm type="signup" />} />
            <Route path="verify-otp" element={<VerifyOTPForm />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="auth/success" element={<AuthSuccess />} />
            <Route path="auth/failure" element={<AuthFailure />} />
            <Route path="category/:categoryName" element={<CategoryPage />} />
            <Route path="search" element={<Search />} />
            <Route path="profile/:username" element={<ProfilePage />} />
            <Route path="blog/:slug" element={<DetailedBlogPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="setting" element={<SideNavBar />}>
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route index element={<Navigate to="edit-profile" />} />
            </Route>
            <Route path="dashboard" element={<SideNavBar />}>
              <Route path="notification" element={<NotificationPage />} />
              <Route path="blogs" element={<DashboardBlogsPage />} />
              <Route index element={<Navigate to="blogs" />} />
            </Route>
          </Route>
          <Route path="editor" element={<EditorPage />} />
          <Route path="editor/:slug" element={<EditorPage />} />
        </Routes>
      </ThemeProvider>

      <NotificationSnackbar
        open={notification.open}
        onClose={handleCloseSnackbar}
        message={notification.message}
        severity={notification.severity}
      />
    </>
  );
};

export default App;
