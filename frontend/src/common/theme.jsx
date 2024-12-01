import { createTheme } from "@mui/material/styles";

const DESIGN_TOKENS = {
  // Font Sizes
  typography: {
    fontSizes: {
      xs: 12, // 12px
      sm: 14, // 14px
      base: 16, // 16px
      lg: 18, // 18px
      xl: 20, // 20px
      "2xl": 24, // 24px
      "3xl": 30, // 30px
      "4xl": 36, // 36px
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    fontFamily: {
      primary: "'Inter', sans-serif",
      secondary: "'Roboto', sans-serif",
    },
  },
  // Spacing & Sizing
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
  },

  // Border Radius
  borderRadius: {
    sm: 4, // 4px
    md: 8, // 8px
    lg: 12, // 12px
    xl: 16, // 16px
    full: "9999px", // Fully rounded
  },

  // Colors
  colors: {
    primary: {
      light: "#3f51b5",
      main: "#1976d2",
      dark: "#002984",
    },
    secondary: {
      light: "#ff4081",
      main: "#f50057",
      dark: "#c51162",
    },
    background: {
      light: "#f4f4f9",
      dark: "#121212",
    },
    text: {
      light: {
        primary: "#000",
        secondary: "#555",
      },
      dark: {
        primary: "#fff",
        secondary: "#aaa",
      },
    },
    input: {
      light: {
        background: "rgb(243, 244, 246)",
        hoverBackground: "rgb(230, 232, 235)",
        text: "#000",
      },
      dark: {
        background: "#333",
        hoverBackground: "#444",
        text: "#fff",
      },
    },
  },

  // Button Variants
  button: {
    dark: {
      primary: {
        backgroundColor: "#f5f5f5",
        color: "#000",
        hoverBackgroundColor: "#e0e0e0",
      },
      secondary: {
        backgroundColor: "#333333",
        color: "#fff",
        hoverBackgroundColor: "#4a4a4a",
      },
    },
    light: {
      primary: {
        backgroundColor: "#333333",
        color: "#fff",
        hoverBackgroundColor: "#4a4a4a",
      },
      secondary: {
        backgroundColor: "#f5f5f5",
        color: "#000",
        hoverBackgroundColor: "#e0e0e0",
      },
    },
  },
};

let lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: DESIGN_TOKENS.colors.primary,
    secondary: DESIGN_TOKENS.colors.secondary,
    background: {
      default: DESIGN_TOKENS.colors.background.light,
      paper: "#fff",
      input: "rgb(243, 244, 246)",
    },
    text: DESIGN_TOKENS.colors.text.light,
  },
  typography: {
    fontFamily: DESIGN_TOKENS.typography.fontFamily.primary,
    fontSize: DESIGN_TOKENS.typography.fontSizes.base,
    fontWeightLight: DESIGN_TOKENS.typography.fontWeights.light,
    fontWeightRegular: DESIGN_TOKENS.typography.fontWeights.normal,
    fontWeightMedium: DESIGN_TOKENS.typography.fontWeights.medium,
    fontWeightBold: DESIGN_TOKENS.typography.fontWeights.bold,
    fontSizes: DESIGN_TOKENS.typography.fontSizes,
  },
  spacing: 4,
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: DESIGN_TOKENS.colors.input.light.background,
          "&:hover": {
            backgroundColor: DESIGN_TOKENS.colors.input.light.hoverBackground,
          },
          color: DESIGN_TOKENS.colors.input.light.text,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 30,
          padding: "6px 25px",
          fontSize: "1rem",
          fontWeight: 500,
          transition: "all 0.2s ease-in-out",
        },
        containedPrimary: {
          backgroundColor: DESIGN_TOKENS.button.light.primary.backgroundColor,
          color: DESIGN_TOKENS.button.light.primary.color,
          "&:hover": {
            backgroundColor:
              DESIGN_TOKENS.button.light.primary.hoverBackgroundColor,
          },
        },
        containedSecondary: {
          backgroundColor: DESIGN_TOKENS.button.light.secondary.backgroundColor,
          color: DESIGN_TOKENS.button.light.secondary.color,
          "&:hover": {
            backgroundColor:
              DESIGN_TOKENS.button.light.secondary.hoverBackgroundColor,
          },
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: DESIGN_TOKENS.colors.primary,
    secondary: DESIGN_TOKENS.colors.secondary,
    background: {
      default: DESIGN_TOKENS.colors.background.dark,
      paper: "#1e1e1e",
      input: "#333",
    },
    text: DESIGN_TOKENS.colors.text.dark,
  },
  typography: {
    fontFamily: DESIGN_TOKENS.typography.fontFamily.primary,
    fontSize: DESIGN_TOKENS.typography.fontSizes.base,
    fontWeightLight: DESIGN_TOKENS.typography.fontWeights.light,
    fontWeightRegular: DESIGN_TOKENS.typography.fontWeights.normal,
    fontWeightMedium: DESIGN_TOKENS.typography.fontWeights.medium,
    fontWeightBold: DESIGN_TOKENS.typography.fontWeights.bold,
    fontSizes: DESIGN_TOKENS.typography.fontSizes,
  },
  spacing: 4,
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: DESIGN_TOKENS.colors.input.dark.background,
          "&:hover": {
            backgroundColor: DESIGN_TOKENS.colors.input.dark.hoverBackground,
          },
          color: DESIGN_TOKENS.colors.input.dark.text,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 30,
          padding: "6px 25px",
          fontSize: "1rem",
          fontWeight: 500,
          transition: "all 0.2s ease-in-out",
        },
        containedPrimary: {
          backgroundColor: DESIGN_TOKENS.button.dark.primary.backgroundColor,
          color: DESIGN_TOKENS.button.dark.primary.color,
          "&:hover": {
            backgroundColor:
              DESIGN_TOKENS.button.dark.primary.hoverBackgroundColor,
          },
        },
        containedSecondary: {
          backgroundColor: DESIGN_TOKENS.button.dark.secondary.backgroundColor,
          color: DESIGN_TOKENS.button.dark.secondary.color,
          "&:hover": {
            backgroundColor:
              DESIGN_TOKENS.button.dark.secondary.hoverBackgroundColor,
          },
        },
      },
    },
  },
});

export { lightTheme, darkTheme };

//border color : #e0e0e0 for light theme
//border color : #2a2a2a for dark theme
