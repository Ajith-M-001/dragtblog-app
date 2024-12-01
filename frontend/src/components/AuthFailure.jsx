import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationSnackbar from "./NotificationSnackbar";

const AuthFailure = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <NotificationSnackbar
        open={open}
        onClose={handleClose}
        message="Authentication failed. Please try again."
        severity="error"
      />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2>Authentication Failed</h2>
          <p>Redirecting to login...</p>
        </div>
      </div>
    </>
  );
};

export default AuthFailure;
