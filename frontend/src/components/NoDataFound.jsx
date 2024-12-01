/* eslint-disable react/prop-types */
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NoDataFound = ({ message }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
        textAlign: "center",
        gap: 3,
      }}
    >
      <Typography variant="h4" color="textSecondary">
        {message || "No Data Found"}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ mt: 2 }}
      >
        Go Back to Home
      </Button>
    </Box>
  );
};

export default NoDataFound;
