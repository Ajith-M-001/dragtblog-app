import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import MuiTextField from "./MuiTextField";
import { useRef } from "react";
import { Formik, Form } from "formik"; // Import Form from Formik
import * as yup from "yup";
import PersonIcon from "@mui/icons-material/Person";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import MuiTextareaAutosize from "./MuiTextareaAutosize";
import EmailIcon from "@mui/icons-material/Email";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import { useUpdateProfileMutation } from "../redux/api/userApiSlice";
import { setCredentials } from "../redux/slices/userSlice";
import { showNotification } from "../redux/slices/notificationSlice";
import { useUploadBannerMutation } from "../redux/api/blogApiSlice";

const EditProfile = () => {
  const { userInfo } = useSelector((state) => state.user);
  const imageRef = useRef(null);
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadBannerMutation();

  let initialValues = {
    profilePicture: "",
    username: "",
    email: "",
    fullName: "",
    bio: "",
    social_links: {
      youtube: "",
      instagram: "",
      facebook: "",
      twitter: "",
      github: "",
      website: "",
    },
  };

  if (userInfo) {
    initialValues = {
      profilePicture: userInfo.profilePicture || "",
      username: userInfo.username || "",
      email: userInfo.email || "",
      fullName: userInfo.fullName || "",
      bio: userInfo.bio || "",
      social_links: userInfo.social_links || {
        youtube: "",
        instagram: "",
        facebook: "",
        twitter: "",
        github: "",
        website: "",
      },
    };
  }

  const handleSubmit = async (values) => {
    console.log("values", values);
    try {
      const res = await updateProfile(values).unwrap();
      console.log("res", res);
      dispatch(setCredentials(res.data));
      dispatch(
        showNotification({
          open: true,
          message: res.message || "Profile updated successfully",
          type: res.status,
        })
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  const validationSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    fullName: yup.string().required("Full Name is required"),
    bio: yup.string().max(150, "Bio must be less than 150 characters"),
  });

  const handleImageUpload = async (e, setFieldValue) => {
    const file = e.target.files[0];
    console.log("file", file);
    const formData = new FormData();
    formData.append("image", file);
    console.log("formData", formData);
    try {
      const res = await uploadImage(formData).unwrap();
      console.log("res", res);
      setFieldValue("profilePicture", res.data.secure_url);
      dispatch(
        showNotification({
          open: true,
          message: res.message || "Profile picture updated successfully",
          type: res.status,
        })
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Container sx={{ mt: 15 }}>
      <Typography variant="h6" sx={{ textAlign: "center" }}>
        Edit Profile
      </Typography>

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          errors,
          touched,
          setFieldValue,
        }) => (
          <Form>
            <Grid container sx={{ mt: 3 }}>
              <Grid
                item
                xs={12}
                sm={3}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Box sx={{ position: "relative", width: 120, height: 120 }}>
                  {isUploading ? (
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Avatar
                      src={values.profilePicture}
                      sx={{
                        width: 120,
                        height: 120,
                        cursor: "pointer",
                      }}
                    />
                  )}
                  <input
                    ref={imageRef}
                    type="file"
                    hidden
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => handleImageUpload(e, setFieldValue)}
                  />
                  <Box
                    onClick={() => imageRef.current.click()}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: 0,
                      transition: "opacity 0.3s",
                      color: "#fff",
                      fontWeight: "bold",
                      borderRadius: "50%",
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Typography variant="subtitle2">Upload Image</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={9} sx={{ px: 5 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <MuiTextField
                    label="Username"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                    startIcon={<AlternateEmailIcon />}
                  />
                  <MuiTextField
                    label="Email"
                    name="email"
                    value={values.email}
                    disabled
                    startIcon={<EmailIcon />}
                  />
                </Box>
                <Box sx={{ my: 3 }}>
                  <MuiTextField
                    label="Full Name"
                    name="fullName"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fullName && Boolean(errors.fullName)}
                    helperText={touched.fullName && errors.fullName}
                    startIcon={<PersonIcon />}
                  />
                </Box>
                <Box>
                  <MuiTextareaAutosize
                    label="Bio"
                    name="bio"
                    value={values.bio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Bio ...."
                    width="100%"
                    error={touched.bio && Boolean(errors.bio)}
                    helperText={
                      touched.bio && errors.bio
                        ? errors.bio
                        : `${150 - values.bio?.length || 0} characters left`
                    }
                  />
                </Box>

                {/* Social Links Section */}
                <Box sx={{ my: 2 }}>
                  <Typography sx={{ color: "text.secondary" }} variant="body2">
                    Add Your Social Handles Below
                  </Typography>
                  <Grid container sx={{ mt: 2 }} spacing={4}>
                    <Grid item xs={12} sm={6}>
                      <MuiTextField
                        label="YouTube"
                        name="social_links.youtube"
                        value={values.social_links.youtube}
                        onChange={handleChange}
                        placeholder="https://"
                        startIcon={<YouTubeIcon />}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MuiTextField
                        label="Instagram"
                        name="social_links.instagram"
                        value={values.social_links.instagram}
                        onChange={handleChange}
                        placeholder="https://"
                        startIcon={<InstagramIcon />}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MuiTextField
                        label="Facebook"
                        name="social_links.facebook"
                        value={values.social_links.facebook}
                        onChange={handleChange}
                        placeholder="https://"
                        startIcon={<FacebookIcon />}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MuiTextField
                        label="Twitter"
                        name="social_links.twitter"
                        value={values.social_links.twitter}
                        onChange={handleChange}
                        placeholder="https://"
                        startIcon={<TwitterIcon />}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MuiTextField
                        label="Github"
                        name="social_links.github"
                        value={values.social_links.github}
                        onChange={handleChange}
                        placeholder="https://"
                        startIcon={<GitHubIcon />}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MuiTextField
                        label="Website"
                        name="social_links.website"
                        value={values.social_links.website}
                        onChange={handleChange}
                        placeholder="https://"
                        startIcon={<LanguageIcon />}
                        onBlur={handleBlur}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ my: 6, display: "flex", justifyContent: "center" }}>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Profile"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default EditProfile;
