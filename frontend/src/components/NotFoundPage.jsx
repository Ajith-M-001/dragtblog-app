import { Container, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" className="min-height" sx={{ textAlign: "center", py: 10 }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <Typography variant="h1" color="textPrimary" sx={{ fontWeight: 'bold' }}>
          404
        </Typography>
        <Typography variant="h4" color="textSecondary">
          Oops! Page not found.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 600 }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/")}>
          Go Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
