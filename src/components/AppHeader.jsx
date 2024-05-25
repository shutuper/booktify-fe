import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { ENV } from "../config/env.js";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import UserMenu from "./UserMenu.jsx";
import { Person } from "@mui/icons-material";
import { getFileUrlByFileId } from "../utils/file-utils.js";

function AppHeader() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const authUser = useSelector((state) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleOpenLogin = () => {
    navigate("/sign-in", { replace: true, state: { redirectTo: location } });
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      className="rounded-b-lg shadow-xl"
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        borderBottom: 5,
        borderBottomColor: "secondary.main",
        borderBottomStyle: "dashed",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => navigate("/")}
            className="hover:text-pink-500 hover:animate-pulse"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              alignContent: "center",
            }}
          >
            <span className="text-3xl mr-1 font-bold">💅</span>
            {ENV.VITE_TITLE}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <span className="text-3xl mr-1">💅</span> {ENV.VITE_TITLE}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} />

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={authUser ? "Open menu" : "Login"}>
              <IconButton
                onClick={authUser ? handleOpenUserMenu : handleOpenLogin}
                sx={{ p: 0 }}
              >
                <Avatar
                  sx={{
                    borderColor: "secondary.main",
                    borderWidth: 2,
                    borderStyle: "dashed",
                  }}
                  alt="avatar"
                  className="bg-stone-100 hover:bg-pink-400 hover:animate-pulse"
                  src={getFileUrlByFileId(authUser?.avatarId)}
                >
                  {authUser ? (
                    <Person color="primary" />
                  ) : (
                    <LoginIcon color="primary" />
                  )}
                </Avatar>
              </IconButton>
            </Tooltip>
            <UserMenu
              authUser={authUser}
              open={anchorElUser}
              onClose={handleCloseUserMenu}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AppHeader;
