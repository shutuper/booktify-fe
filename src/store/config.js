import {
  persistReducer,
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import * as localForage from "localforage";
import { ENV } from "../config/env.js";
import { rootReducer } from "./rootReducer.js";

const config = {
  key: "root",
  storage: localForage,
  version: 1,
};

const setupStore = () => {
  const store = configureStore({
    reducer: persistReducer(config, rootReducer),
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      });
    },
    devTools: ENV.VITE_ENV_NAME !== "prod",
  });

  const persistor = persistStore(store);

  return { store, persistor };
};

export default setupStore();
