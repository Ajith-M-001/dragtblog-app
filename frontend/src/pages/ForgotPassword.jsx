import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MuiTextField from "../components/MUITextField";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { Email, ArrowBack, Lock } from "@mui/icons-material";
import OtpInput from "react-otp-input";
import {
  useForgotPasswordMutation,
  useResendOTPMutation,
  useResetPasswordMutation,
  useVerifyResetOTPMutation,
} from "../redux/api/userApiSlice";
import { useDispatch } from "react-redux";
import { showNotification } from "../redux/slices/notificationSlice";

const validationSchema = {
  email: yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
  }),
  otp: yup.object({
    otp: yup
      .string()
      .required("OTP is required")
      .length(6, "OTP must be 6 digits")
      .matches(/^\d+$/, "OTP must contain only digits"),
  }),
  password: yup.object({
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
      ),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password")], "Passwords must match"),
  }),
};

// Animation variants for smooth transition between steps
const formControlVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1 },
  }),
};

const ForgotPassword = () => {
  const theme = useTheme();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const [forgotPassword, { isLoading: forgotPasswordLoading }] =
    useForgotPasswordMutation();
  const [verifyOTP, { isLoading: verifyOTPLoading }] =
    useVerifyResetOTPMutation();
  const [resetPassword, { isLoading: resetPasswordLoading }] =
    useResetPasswordMutation();
  const [resendOTP, { isLoading: resendOTPLoading }] = useResendOTPMutation();

  const handleResendOTP = async () => {
    try {
      const response = await resendOTP({ email, isPasswordReset: true });
      if (response.error) {
        dispatch(
          showNotification({
            message: response?.error?.data?.message,
            severity: response?.error?.data?.status,
          })
        );
      } else {
        dispatch(
          showNotification({
            message: response?.data?.message,
            severity: response?.data?.status,
          })
        );
      }

      setCountdown(30);
      setCanResend(false);
      console.log(response);
    } catch (error) {
      dispatch(
        showNotification({
          message: error?.data?.message,
          severity: error?.data?.status,
        })
      );
    }
  };

  const handleSubmit = async (values) => {
    try {
      switch (step) {
        case 1: {
          const response = await forgotPassword(values);

          console.log(response);
          if (response.error) {
            dispatch(
              showNotification({
                message: response?.error?.data?.message,
                severity: response?.error?.data?.status,
              })
            );
          } else {
            dispatch(
              showNotification({
                message: response.data.message,
                severity: response.data.status,
              })
            );
            setEmail(values.email);
            setStep(2);
          }
          break;
        }
        case 2:
          {
            const response = await verifyOTP(values);
            if (response.error) {
              dispatch(
                showNotification({
                  message: response?.error?.data?.message,
                  severity: response?.error?.data?.status,
                })
              );
            } else {
              dispatch(
                showNotification({
                  message: response.data.message,
                  severity: response.data.status,
                })
              );
              setStep(3);
            }
          }
          break;
        case 3:
          {
            const response = await resetPassword({
              email: values.email,
              password: values.password,
            });
            if (response.error) {
              dispatch(
                showNotification({
                  message: response?.error?.data?.message,
                  severity: response?.error?.data?.status,
                })
              );
            } else {
              dispatch(
                showNotification({
                  message: response.data.message,
                  severity: response.data.status,
                })
              );
              navigate("/signin");
            }
          }
          // Handle password reset
          break;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getInitialValues = () => {
    switch (step) {
      case 1:
        return { email: "" };
      case 2:
        return { otp: "" };
      case 3:
        return { password: "", confirmPassword: "" };
      default:
        return {};
    }
  };

  const getCurrentValidationSchema = () => {
    switch (step) {
      case 1:
        return validationSchema.email;
      case 2:
        return validationSchema.otp;
      case 3:
        return validationSchema.password;
      default:
        return {};
    }
  };

  const renderStep = () => {
    return (
      <Formik
        initialValues={getInitialValues()}
        validationSchema={getCurrentValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          setFieldValue,
        }) => (
          <Form>
            <Typography variant="h5" component="h1" gutterBottom>
              {step === 1 && "Forgot Password"}
              {step === 2 && "Enter OTP"}
              {step === 3 && "Create New Password"}
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: theme.spacing(3) }}
            >
              <Typography
                variant="body2"
                sx={{
                  //
                  color: theme.palette.text.secondary,
                }}
              >
                {step === 1 && "Enter your email address to receive an OTP"}
                {step === 2 && `Please enter the OTP sent to ${email}`}
                {step === 3 && "Please enter your new password"}
              </Typography>
            </Box>

            <motion.div custom={1} variants={formControlVariants}>
              {step === 1 && (
                <MuiTextField
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ mb: theme.spacing(2) }}
                  startIcon={<Email />}
                />
              )}

              {step === 2 && (
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    // justifyContent: "flex-start",
                  }}
                >
                  <OtpInput
                    value={values.otp}
                    onChange={(otp) => setFieldValue("otp", otp)}
                    numInputs={6}
                    isInputNum
                    shouldAutoFocus
                    separator={<span style={{ width: 20 }} />}
                    renderSeparator={
                      <span style={{ width: theme.spacing(2) }}></span>
                    }
                    containerStyle={{
                      gap: theme.spacing(1),
                      justifyContent: "center",
                    }}
                    renderInput={(props) => (
                      <input
                        {...props}
                        style={{
                          width: "3.3rem",
                          height: "3.5rem",
                          margin: theme.spacing(1),
                          borderRadius: theme.spacing(1),
                          border: `1px solid ${
                            touched.otp && errors.otp
                              ? "red"
                              : theme.palette.text.primary
                          }`,
                          textAlign: "center",
                          fontSize: theme.typography.fontSizes.xl, // font size from theme
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? theme.palette.background.input
                              : theme.palette.background.default,
                          color: theme.palette.text.primary,
                          "&:focus": {
                            outline: "none",
                            borderColor: theme.palette.primary.main,
                            boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,
                          },
                        }}
                      />
                    )}
                  />
                  {touched.otp && errors.otp && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ mt: 1, display: "block" }}
                    >
                      {errors.otp}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      mt: theme.spacing(5),
                    }}
                  >
                    {canResend ? (
                      <>
                        <Button
                          onClick={handleResendOTP}
                          disabled={resendOTPLoading}
                          sx={{ textTransform: "none" }}
                        >
                          {resendOTPLoading ? "Resending..." : "Resend OTP"}
                        </Button>
                      </>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        Resend OTP in {countdown}s
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}

              {step === 3 && (
                <>
                  <MuiTextField
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    sx={{ mb: 2 }}
                    startIcon={<Lock />}
                    isPassword
                  />
                  <MuiTextField
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.confirmPassword && Boolean(errors.confirmPassword)
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    sx={{ mb: 2 }}
                    startIcon={<Lock />}
                    isPassword
                  />
                </>
              )}
            </motion.div>

            <motion.div custom={2} variants={formControlVariants}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: theme.spacing(5),
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    forgotPasswordLoading ||
                    verifyOTPLoading ||
                    resetPasswordLoading
                  }
                  sx={{ mb: theme.spacing(2) }}
                >
                  {step === 1 &&
                    (forgotPasswordLoading ? "Sending OTP..." : "Send OTP")}
                  {step === 2 &&
                    (verifyOTPLoading ? "Verifying OTP..." : "Verify OTP")}
                  {step === 3 &&
                    (resetPasswordLoading
                      ? "Resetting Password..."
                      : "Reset Password")}
                </Button>
              </Box>
            </motion.div>
          </Form>
        )}
      </Formik>
    );
  };

  return (
    <Container maxWidth="sm">
      <Box
        className="min-height"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 2,
            paddingX: theme.spacing(13),
            paddingY: theme.spacing(10),
            minHeight: "350px",
          }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={formControlVariants}
          >
            {renderStep()}
            <motion.div
              custom={4}
              variants={formControlVariants}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                component={Link}
                to="/signin"
                startIcon={<ArrowBack />}
                sx={{
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                Back to Sign In
              </Button>
            </motion.div>
          </motion.div>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
