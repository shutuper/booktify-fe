import { handleError } from "../services/error-handler.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createAppThunk = (type, payloadCreator) =>
  createAsyncThunk(type, payloadCreator);

export function withHandledError(payloadCreator) {
  return async (args, thunkAPI) => {
    try {
      return await payloadCreator(args, thunkAPI);
    } catch (err) {
      const errPayload = handleError(err);
      return thunkAPI.rejectWithValue(errPayload);
    }
  };
}
