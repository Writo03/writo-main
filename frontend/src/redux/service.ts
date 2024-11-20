import { Subscription, SubscriptionState } from "@/types/all";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: SubscriptionState = {
  subscriptions: [], 
  status: "idle",
  error: null,
};

// Create the subscription reducer slice
const subscriptionReducer = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setSubscriptions(state, action: PayloadAction<Subscription[]>) {
      state.subscriptions = action.payload;
      state.status = "succeeded";
    },
    clearSubscriptions(state) {
      state.subscriptions = [];
      state.status = "idle";
      state.error = null;
    },
  },
});

// Export the actions and reducer
export const {
  setSubscriptions,
  clearSubscriptions,
} = subscriptionReducer.actions;
export default subscriptionReducer.reducer;
