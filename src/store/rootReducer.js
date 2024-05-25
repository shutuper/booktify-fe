import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./authReducer.js";
import { workScheduleReducer } from "./workScheduleReducer.js";
import { salonSettingsReducer } from "./salonSettingsReducer.js";

const appReducer = combineReducers({
  auth: authReducer,
  workSchedule: workScheduleReducer,
  salon: salonSettingsReducer,
});

export const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    state = undefined;
  }
  return appReducer(state, action);
};
