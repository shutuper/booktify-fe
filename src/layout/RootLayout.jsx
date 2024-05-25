import { Outlet } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { useEffect, useState } from "react";
import { authCheckUser } from "../store/authReducer.js";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import AppHeader from "../components/AppHeader.jsx";

function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authCheckUser());
      setIsLoading(false);
    })();
  }, [dispatch]);

  return (
    <>
      {!isLoading && (
        <Box>
          <AppHeader />
          <Outlet />
          <Footer />
        </Box>
      )}
    </>
  );
}

export default RootLayout;
