import { Box, Button, Typography, useTheme } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import MuiTextField from "./MuiTextField";
import { useChangePasswordMutation } from "../redux/api/userApiSlice";
import { logout } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../redux/slices/notificationSlice";

// Extracted validation schema
const passwordValidationSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[0-9]/, "Password requires at least one number")
    .matches(/[a-z]/, "Password requires at least one lowercase letter")
    .matches(/[A-Z]/, "Password requires at least one uppercase letter")
    .matches(/[^\w]/, "Password requires at least one symbol")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const initialValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePassword = () => {
  const theme = useTheme();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      // TODO: Implement API call
      const response = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      console.log(response);
      dispatch(
        showNotification({
          open: true,
          message: response.message,
          type: response.status,
        })
      );
      dispatch(logout());
      navigate("/signin");
    } catch (error) {
      console.log(error);
      setStatus({ error: "Failed to change password" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "500px",
        mx: "auto",
        p: 3,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{ color: theme.palette.text.secondary, mb: 2, textAlign: "center" }}
      >
        Change Password
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={passwordValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, errors, status, touched }) => (
          <Form>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {status?.error && (
                <Typography color="error" variant="body2">
                  {status.error}
                </Typography>
              )}

              <MuiTextField
                id="currentPassword"
                name="currentPassword"
                label="Current Password"
                isPassword
                value={values.currentPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.currentPassword && touched.currentPassword}
                helperText={
                  errors.currentPassword && touched.currentPassword
                    ? errors.currentPassword
                    : ""
                }
              />
              <MuiTextField
                id="newPassword"
                name="newPassword"
                label="New Password"
                isPassword
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.newPassword && touched.newPassword}
                helperText={
                  errors.newPassword && touched.newPassword
                    ? errors.newPassword
                    : ""
                }
              />
              <MuiTextField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                isPassword
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.confirmPassword && touched.confirmPassword}
                helperText={
                  errors.confirmPassword && touched.confirmPassword
                    ? errors.confirmPassword
                    : ""
                }
              />

              <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? "Changing Password..." : "Change Password"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

ChangePassword.propTypes = {};

export default ChangePassword;
