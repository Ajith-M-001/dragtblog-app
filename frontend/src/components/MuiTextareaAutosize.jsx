/* eslint-disable react/prop-types */
import { TextareaAutosize } from "@mui/base";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

const StyledTextarea = styled(TextareaAutosize)(({ theme, error }) => ({
  width: "100%",
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.fontSize,
  padding: "16.5px 14px",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.input,
  color: theme.palette.text.primary,
  border: `1px solid ${
    error 
      ? theme.palette.error.main 
      : theme.palette.mode === 'light' 
        ? '#e0e0e0' 
        : '#2a2a2a'
  }`,
  transition: "all 0.2s ease-in-out",

  "&:hover": {
    backgroundColor: theme.palette.mode === 'light' 
      ? 'rgb(230, 232, 235)' 
      : '#444',
  },

  "&:focus": {
    outline: "none",
    borderColor: error 
      ? theme.palette.error.main 
      : theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${error 
      ? theme.palette.error.main 
      : theme.palette.primary.main}25`,
  },

  "&::placeholder": {
    color: theme.palette.text.secondary,
    opacity: 0.7,
  },
}));

const MuiTextareaAutosize = ({
  minRows = 3,
  maxRows = 6,
  placeholder = "Enter your text...",
  value,
  onChange,
  error,
  helperText,
  ...props
}) => {
  return (
    <Box>
      <StyledTextarea
        minRows={minRows}
        maxRows={maxRows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={error}
        {...props}
      />
      {helperText && (
        <Typography
          variant="caption"
          color={error ? "error" : "textSecondary"}
          sx={{ mt: 0.5, ml: 1.5 }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default MuiTextareaAutosize;
