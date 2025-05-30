import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type User = {
  address: any;
  _id: any;
  role: string;
  createdAt: any;
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateUserAddress: (state, action: PayloadAction<any>) => {
      if (state.user) {
        state.user.address = action.payload;
      }
    },
  },
});

export const { loginSuccess, logout, updateUserAddress } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
