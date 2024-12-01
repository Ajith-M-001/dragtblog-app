import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NotificationSnackbar from "./NotificationSnackbar";
import { useGetUserProfileQuery } from "../redux/api/userApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/userSlice";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [snackbar, setSnackbar] = useState({
    open: true,
    message: "Successfully logged in with Google!",
    severity: "success",
  });
  const redirectPath = searchParams.get("redirect") || "/";

  const { data: userProfile, error } = useGetUserProfileQuery();
  useEffect(() => {
    if (userProfile && userProfile.data) {
      // Store user data in Redux
      dispatch(setCredentials(userProfile.data));
    }

    if (error) {
      setSnackbar({
        open: true,
        message: error.data?.message || "Failed to fetch user profile",
        severity: error.data?.status || "error",
      });
    }
  }, [userProfile, error, dispatch]);

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    // Only redirect after successful profile fetch and storage
    if (userProfile && userProfile.data) {
      const timer = setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [navigate, redirectPath, userProfile]);

  return (
    <>
      <NotificationSnackbar
        open={snackbar.open}
        onClose={handleClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
      <div className="flex items-center justify-center min-height">
        <div className="text-center">
          <h2>Login Successful!</h2>
          <p>Redirecting...</p>
        </div>
      </div>
    </>
  );
};

export default AuthSuccess;
