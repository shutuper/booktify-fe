import { createSlice } from "@reduxjs/toolkit";
import { createAppThunk, withHandledError } from "../utils/redux-thunk.js";
import SalonApi from "../api/salon.api.js";

const initialState = {
  salon: null,
};

export const getSalon = createAppThunk(
  "salon/get",
  withHandledError(async (masterId) => {
    const { data: salon } = await SalonApi.getSalon(masterId, true);
    return {
      salon,
    };
  }),
);

const salonSettingsSlice = createSlice({
  name: "salon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSalon.fulfilled, (state, { payload }) => {
      state.salon = payload.salon;
    });
  },
});

export const { reducer: salonSettingsReducer } = salonSettingsSlice;
