import "./App.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import storeConfig from "./store/config";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { RouterProvider } from "react-router-dom";
import rootRouter from "./router/rootRouter.jsx";
import GlobalLoader from "./components/GlobalLoader.jsx";
import { queryClient } from "./config/queryClient.js";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import baseTheme from "./styles/baseTheme.js";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Provider store={storeConfig.store}>
        <PersistGate loading={null} persistor={storeConfig.persistor}>
          <QueryClientProvider client={queryClient}>
            <StyledEngineProvider injectFirst>
              <CssBaseline />
              <GlobalLoader>
                <ThemeProvider theme={baseTheme}>
                  <ToastContainer />
                  <RouterProvider router={rootRouter} />
                </ThemeProvider>
              </GlobalLoader>
            </StyledEngineProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
