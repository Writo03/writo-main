import {service,serviceState } from "@/types/all";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState:serviceState = {
 services: [], 
  status: "idle",
  error: null,
};

// Create theservice reducer slice
const serviceReducer = createSlice({
  name: "services",
  initialState,
  reducers: {
    setServices(state, action: PayloadAction<service[]>) {
      state.services = action.payload;
      state.status = "succeeded";
    },
    clearServices(state) {
      state.services = [];
      state.status = "idle";
      state.error = null;
    },
  },
});

// Export the actions and reducer
export const {
    setServices,
    clearServices,
} =serviceReducer.actions;
export default serviceReducer.reducer;
