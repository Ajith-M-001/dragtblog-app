import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import {
  useResendOTPMutation,
  useVerifyOTPMutation,
} from "../redux/api/userApiSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatedPage } from "../common/AnimatedPage";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { showNotification } from "../redux/slices/notificationSlice";

const VerifyOTPForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { email } = location.state || {};
  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };
  const inputVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        delay: 0.1,
      },
    },
  };

  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();

  const initialValues = {
    verificationOTP: "",
  };

  const validationSchema = Yup.object({
    verificationOTP: Yup.string()
      .length(6, "OTP must be exactly 6 digits")
      .matches(/^[0-9]+$/, "OTP must be numeric")
      .required("OTP is required"),
  });

  const onSubmit = async (values, { resetForm }) => {
    console.log(values);
    try {
      const response = await verifyOTP({
        email: email.email,
        verificationOTP: values.verificationOTP,
      }).unwrap();
      dispatch(
        showNotification({
          message: response.message,
          severity: response.success,
        })
      );
      resetForm();
      navigate("/signin");
    } catch ({ data }) {
      dispatch(
        showNotification({
          message: data.message,
          severity: data.status,
        })
      );
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await resendOTP({ email: email.email }).unwrap();
      dispatch(
        showNotification({
          message: response.message,
          severity: response.status,
        })
      );
    } catch ({ data }) {
      dispatch(
        showNotification({
          message: data.message,
          severity: data.status,
        })
      );
    }
  };

  return (
    <AnimatedPage>
      <Container component="main" maxWidth="sm">
        <Box
          className="min-height "
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={formVariants}
            style={{ width: "100%" }}
          >
            <Paper
              elevation={1}
              sx={{ padding: theme.spacing(10), width: "100%" }}
            >
              <motion.div variants={inputVariants}>
                <Typography
                  component="h1"
                  variant="h5"
                  align="center"
                  gutterBottom
                >
                  Verify OTP
                </Typography>
              </motion.div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ values, errors, touched, handleBlur, handleChange }) => (
                  <Form>
                    <TextField
                      id="verificationOTP"
                      name="verificationOTP"
                      label="Enter OTP"
                      value={values.verificationOTP}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.verificationOTP &&
                        Boolean(errors.verificationOTP)
                      }
                      helperText={
                        touched.verificationOTP && errors.verificationOTP
                      }
                      fullWidth
                      sx={{ mb: theme.spacing(5) }}
                      type="number"
                    />
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isVerifying}
                      >
                        {isVerifying ? "Verifying..." : "Verify OTP"}
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
              <Box sx={{ mt: theme.spacing(4), textAlign: "center" }}>
                <Typography variant="body2">
                  Didn&apos;t receive OTP?
                  <Button onClick={handleResendOTP} disabled={isResending}>
                    {isResending ? "Resending..." : "Resend OTP"}
                  </Button>
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default VerifyOTPForm;
