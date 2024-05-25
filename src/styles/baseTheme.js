import { createTheme } from "@mui/material";

const baseTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#39393b",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#aa4272",
    },
    divider: "rgba(86,38,38,0.12)",
    background: {
      paper: "#f1f1f1",
    },
    info: {
      main: "#d454cd",
    },
    success: {
      main: "#59a85d",
    },
    warning: {
      main: "#d88550",
    },
    error: {
      main: "#e43f3f",
    },
    badgeBg: "rgba(208,203,203,0.12)",
    text: {
      primary: "rgba(10,9,10,0.87)",
      secondary: "rgba(53,50,50,0.6)",
    },
  },
});

export default baseTheme;
