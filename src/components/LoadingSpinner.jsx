import { Avatar, CircularProgress } from "@mui/material";
import AppLogo from "../assets/nails.gif";
import Box from "@mui/material/Box";

export default function LoadingSpinner() {
  return (
    <>
      <Box className="m-auto flex items-center justify-center">
        <Box m="auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <Avatar src={AppLogo} sx={{ width: "3rem", height: "3rem" }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <CircularProgress
              className="text-pink-400"
              size="5rem"
              thickness={3}
            />
          </div>
        </Box>
      </Box>
    </>
  );
}
