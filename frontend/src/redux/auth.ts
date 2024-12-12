import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {AuthState, updateUserState} from '../types/user'

const initialState: AuthState = {
  isAuthenticated: false,
  user: {
    accessToken: null,
    refreshToken: null,
    fullName: "",
    email: "",
    userId: "",
    profilePic : "",
    phone : 0,
    target : "",
    institution : "",
    isMentor:false,
    isAdmin:false,
    isLoggedIn: false
  },
  error: null,
};

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: AuthState['user'] }>) {
      const {
        accessToken,
        refreshToken,
        fullName,
        institution,
        phone,
        target,
        email,
        isMentor,
        isAdmin,
        userId,
        profilePic,
      } = action.payload.user;
      state.isAuthenticated = true;
      state.user = {
        accessToken,
        refreshToken,
        fullName,
        institution,
        phone,
        target,
        email,
        isMentor,
        isAdmin,
        userId,
        profilePic,
        isLoggedIn: true
      };
      state.error = null;
    },
    
    updateuser(state, action: PayloadAction<updateUserState>) {
      const { fullName, email, userId, isAdmin, isMentor } = action.payload;
      state.user = {
        ...state.user,
        fullName,
        email,
        userId,
        isAdmin,
        isMentor,
        isLoggedIn: true // Ensure this property exists
      };
    },

    loginFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = initialState.user;
    },
    logout(state) {
      Object.assign(state, initialState);
    },
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setUser(state, action: PayloadAction<{ fullName: string; email: string }>) {
      state.user.fullName = action.payload.fullName;
      state.user.email = action.payload.email;
    },
  },
});

export const { setIsAuthenticated, login, loginFailed, logout, setUser,updateuser } = userReducer.actions;
export default userReducer.reducer;
