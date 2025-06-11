import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  apiUrl: string;
};

const initialState: InitialState = {
  apiUrl: "",
};

export const shopFilterSlice = createSlice({
  name: "shopFilter",
  initialState,
  reducers: {
    setApiUrl: (state, action) => {
      state.apiUrl = action.payload;
    },
    clearApiUrl: (state) => {
      state.apiUrl = "";
    },
  },
});

export const { setApiUrl, clearApiUrl } = shopFilterSlice.actions;
export default shopFilterSlice.reducer;
