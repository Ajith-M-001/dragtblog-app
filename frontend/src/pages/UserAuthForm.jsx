import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MuiTextField from "../components/MuiTextField";
import {
  useSigninMutation,
  useSignupMutation,
} from "../redux/api/userApiSlice";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/userSlice";
import GoogleIcon from "@mui/icons-material/Google";
import { showNotification } from "../redux/slices/notificationSlice";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { AnimatedPage } from "../common/AnimatedPage";
import { motion } from "framer-motion";

// eslint-disable-next-line react/prop-types
const UserAuthForm = ({ type }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Add a key prop to the Formik component that changes with the type
  const formKey = type === "signup" ? "signup-form" : "signin-form";

  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();
  const [signin, { isLoading: isSigninLoading }] = useSigninMutation();

  const validationSchema =
    type === "signup"
      ? Yup.object({
          fullName: Yup.string("enter Full Name").required(
            "Your full name required"
          ),
          email: Yup.string("Enter your email")
            .email("Invalid email format")
            .required("Email is required"),
          password: Yup.string("enter Password")
            .min(8, "Password must be at least 8 characters")
            .matches(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
              "Must contain at least one uppercase, lowercase, number and special character"
            )
            .required("password is required"),
          confirmPassword: Yup.string("Confirm your password")
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Password confirmation is required"),
        })
      : Yup.object({
          email: Yup.string("Enter your email")
            .email("Invalid email format")
            .required("Email is required"),
          password: Yup.string("enter Password").required(
            "password is required"
          ),
        });

  const initialValues =
    type === "signup"
      ? {
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }
      : {
          email: "",
          password: "",
        };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      if (type === "signup") {
        const response = await signup(values).unwrap();
        dispatch(
          showNotification({
            open: true,
            message: response.message,
            severity: response.status,
          })
        );

        navigate("/verify-otp", { state: { email: response.data } });
      } else {
        const { email, password } = values;
        const response = await signin({ email, password }).unwrap();
        dispatch(setCredentials(response.data));
        navigate("/");
        dispatch(
          showNotification({
            message: response.message,
            severity: response.status,
          })
        );
      }
    } catch ({ data }) {
      dispatch(
        showNotification({
          message: data.message,
          severity: data.status,
        })
      );
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = () => {
    // Redirect to your backend Google auth route
    const backendURL = import.meta.env.VITE_API_BASE_URL_DEVELOP;
    window.location.href = `${backendURL}/auth/google`;
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const formControlVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.2,
        ease: "easeOut",
      },
    }),
  };

  return (
    <AnimatedPage>
      <Container className="min-height " component="main" maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: theme.spacing(4),
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
              sx={{ padding: theme.spacing(4), width: "100%" }}
            >
              <Typography
                component="h1"
                variant="h5"
                sx={{
                  mb: theme.spacing(6),
                  textAlign: "center",
                  fontWeight: theme.typography.fontWeightBold,
                  color: theme.palette.text.primary,
                }}
              >
                {type === "signup" ? "Join Us Today" : "Welcome Back"}
              </Typography>
              <Formik
                key={formKey}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                validateOnMount={true}
                validateOnChange={true}
                validateOnBlur={false}
                enableReinitialize={false} // Add this to prevent re-initialization
              >
                {({
                  //   isSubmitting,
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                }) => (
                  <Form>
                    {type === "signup" && (
                      <motion.div custom={0} variants={formControlVariants}>
                        <MuiTextField
                          id="fullName"
                          name="fullName"
                          placeholder={"Enter Your Full Name"}
                          value={values.fullName || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.fullName && Boolean(errors.fullName)}
                          helperText={touched.fullName && errors.fullName}
                          sx={{ mb: theme.spacing(2) }}
                          startIcon={<PersonIcon />}
                        />
                      </motion.div>
                    )}
                    <motion.div custom={1} variants={formControlVariants}>
                      <MuiTextField
                        id="email"
                        name="email"
                        placeholder={"Enter Email"}
                        value={values.email || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        sx={{ mb: theme.spacing(2) }}
                        startIcon={<EmailIcon />}
                      />
                    </motion.div>
                    <motion.div custom={3} variants={formControlVariants}>
                      <MuiTextField
                        id="password"
                        name="password"
                        placeholder={"Enter password"}
                        value={values.password || ""}
                        type="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        sx={{ mb: theme.spacing(2) }}
                        startIcon={<LockIcon />}
                        isPassword
                      />
                    </motion.div>
                    {type === "signup" && (
                      <motion.div custom={4} variants={formControlVariants}>
                        <MuiTextField
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder={"confirm Password "}
                          value={values.confirmPassword || ""}
                          type="password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.confirmPassword &&
                            Boolean(errors.confirmPassword)
                          }
                          helperText={
                            touched.confirmPassword && errors.confirmPassword
                          }
                          sx={{ mb: theme.spacing(2) }}
                          startIcon={<LockIcon />}
                          isPassword
                        />
                      </motion.div>
                    )}
                    {type === "signin" && (
                      <motion.div custom={4} variants={formControlVariants}>
                        <Box
                          sx={{
                            textAlign: "right",
                            mt: theme.spacing(2),
                            mb: theme.spacing(1),
                          }}
                        >
                          <Button
                            component={Link}
                            to="/forgot-password"
                            sx={{
                              textTransform: "none",

                              p: 0,
                              "&:hover": {
                                backgroundColor: "transparent",
                                textDecoration: "underline",
                              },
                            }}
                          >
                            Forgot Password ?
                          </Button>
                        </Box>
                      </motion.div>
                    )}
                    <motion.div custom={5} variants={formControlVariants}>
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
                            type === "signup"
                              ? isSignupLoading
                              : isSigninLoading
                          }
                        >
                          {type === "signup"
                            ? isSignupLoading
                              ? "Signing Up..."
                              : "Sign Up"
                            : isSigninLoading
                            ? "Signing In..."
                            : "Sign In"}
                        </Button>
                      </Box>
                    </motion.div>
                    <motion.div custom={6} variants={formControlVariants}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          my: theme.spacing(5),
                          mx: theme.spacing(6),
                        }}
                      >
                        <hr style={{ flex: 1 }} />
                        <Typography sx={{ mx: 2 }}>OR</Typography>
                        <hr style={{ flex: 1 }} />
                      </Box>
                    </motion.div>
                    <motion.div custom={7} variants={formControlVariants}>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                          variant="outlined"
                          startIcon={<GoogleIcon />}
                          onClick={handleGoogleAuth}
                          fullWidth
                          sx={{
                            color: theme.palette.text.primary,
                            borderColor: theme.palette.divider,
                            textTransform: "none",
                            py: theme.spacing(2),
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                        >
                          {type === "signup"
                            ? "Sign up with Google"
                            : "Sign in with Google"}
                        </Button>
                      </Box>
                    </motion.div>
                  </Form>
                )}
              </Formik>
              <Box sx={{ textAlign: "center", mt: theme.spacing(4) }}>
                <Typography variant="body2" color="text.secondary">
                  {type === "signup"
                    ? "Already have an account? "
                    : "Don't have an account? "}
                  <Button
                    component={Link}
                    to={type === "signup" ? "/signin" : "/signup"}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      p: 0,
                      ml: 0.5,
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {type === "signup" ? "Sign In" : "Sign Up"}
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

export default UserAuthForm;
