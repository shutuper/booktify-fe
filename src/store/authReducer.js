import { createSlice } from "@reduxjs/toolkit";
import AuthApi from "../api/auth.api.js";
import * as localForage from "localforage";
import { createAppThunk, withHandledError } from "../utils/redux-thunk.js";

const initialState = {
  user: null,
};

export const authCheckUser = createAppThunk(
  "auth/checkUser",
  withHandledError(async () => {
    const token = await localForage.getItem("accessToken");
    if (!token) {
      return {
        user: null,
      };
    }

    const response = await AuthApi.me();
    return {
      user: response.data,
    };
  }),
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser(state, { payload }) {
      state.user = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authCheckUser.fulfilled, (state, { payload }) => {
      state.user = payload.user;
    });

    builder.addCase(authCheckUser.rejected, (state) => {
      state.user = null;
    });
  },
});

export const {
  reducer: authReducer,
  actions: { updateUser },
} = authSlice;
