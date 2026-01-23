import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    adminUser: null,
  },
  reducers: {
    loginAdmin: (state, action) => {
      state.adminUser = action.payload;
    },
    logoutAdmin: (state) => {
      state.adminUser = null;
    },
  },
});

export const { loginAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;