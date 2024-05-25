import { createSlice } from "@reduxjs/toolkit";
import { createAppThunk, withHandledError } from "../utils/redux-thunk.js";
import WorkScheduleApi from "../api/work-schedule.api.js";

const initialState = {
  workSchedules: [],
};

export const workSchedulesUpdate = createAppThunk(
  "workSchedule/update",
  withHandledError(async (workSchedules) => {
    const { data } = await WorkScheduleApi.updateWorkSchedule({
      workSchedules: workSchedules,
    });
    return {
      workSchedules: data.workSchedules,
    };
  }),
);
export const getWorkSchedules = createAppThunk(
  "workSchedule/get",
  withHandledError(async () => {
    const { data } = await WorkScheduleApi.getWorkSchedules();
    return {
      workSchedules: data.workSchedules,
    };
  }),
);

const workScheduleSlice = createSlice({
  name: "workSchedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(workSchedulesUpdate.fulfilled, (state, { payload }) => {
      state.workSchedules = payload.workSchedules;
    });
    builder.addCase(getWorkSchedules.fulfilled, (state, { payload }) => {
      state.workSchedules = payload.workSchedules;
    });
  },
});

export const { reducer: workScheduleReducer } = workScheduleSlice;
