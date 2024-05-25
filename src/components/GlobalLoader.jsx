import { Avatar, CircularProgress, Grow } from "@mui/material";
import AppLogo from "../assets/nails.gif";
import { useEffect, useState } from "react";

export default function GlobalLoader({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  return (
    <>
      <Grow
        in={isLoading}
        mountOnEnter
        unmountOnExit
        exit={false}
        sx={{ zIndex: 100000 }}
      >
        <div className="h-screen flex items-center justify-center bg-stone-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <Avatar src={AppLogo} sx={{ width: "7rem", height: "7rem" }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <CircularProgress
              className="text-pink-400"
              size="9rem"
              thickness={3}
            />
          </div>
        </div>
      </Grow>
      <main className="bg-stone-300" hidden={isLoading}>
        {children}
      </main>
    </>
  );
}
