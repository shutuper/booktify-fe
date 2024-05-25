import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Logout } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { queryClient } from "../config/queryClient.js";
import * as localForage from "localforage";
import { useLocation, useNavigate } from "react-router-dom";

const settings = [
  {
    role: "ROLE_CLIENT",
    items: ["Appointments", "Profile", "Logout"],
  },
  {
    role: "ROLE_MASTER",
    items: ["Appointments", "Salon", "Settings", "Logout"],
  },
];

function UserMenu({ authUser, open, onClose }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  if (!authUser) {
    return null;
  }

  function handleMenuItemClick(menuItem) {
    if (menuItem === "Logout") {
      localForage.removeItem("accessToken");
      localForage.removeItem("refreshToken");
      dispatch({ type: "RESET_STORE" });
      queryClient.clear();
      onClose();
      navigate("/sign-in", { replace: true, state: { redirectTo: location } });
      return;
    }
    if (menuItem === "Settings" || menuItem === "Profile") {
      navigate("/");
      return;
    }
    if (menuItem === "Salon") {
      navigate("/masters/salon");
      return;
    }

    if (menuItem === "Appointments") {
      navigate("/appointments");
    }
  }

  return (
    <Menu
      sx={{ mt: "45px" }}
      id="menu-appbar"
      anchorEl={open}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(open)}
      onClose={onClose}
    >
      {settings
        .filter((x) => x.role === authUser.role)
        .flatMap((x) => x.items)
        .map((setting) => (
          <MenuItem key={setting} onClick={() => handleMenuItemClick(setting)}>
            <Typography textAlign="center" alignItems="center" color="primary">
              {setting}
            </Typography>
            {setting === "Logout" && <Logout fontSize="small" sx={{ ml: 1 }} />}
          </MenuItem>
        ))}
    </Menu>
  );
}

export default UserMenu;
