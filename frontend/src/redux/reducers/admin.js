import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  isAdmin: false,
  admin: null,
  error: null,
  successMessage: null,
};

export const adminReducer = createReducer(initialState, (builder) => {
  builder
    // Load admin cases
    .addCase("LoadAdminRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("LoadAdminSuccess", (state, action) => {
      state.isLoading = false;
      state.isAdmin = true;
      state.admin = action.payload;
    })
    .addCase("LoadAdminFail", (state, action) => {
      state.isLoading = false;
      state.isAdmin = false;
      state.error = action.payload;
    })

    // Admin logout cases
    .addCase("AdminLogoutRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("AdminLogoutSuccess", (state) => {
      state.isLoading = false;
      state.isAdmin = false;
      state.admin = null;
    })
    .addCase("AdminLogoutFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Admin info update cases
    .addCase("updateAdminInfoRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("updateAdminInfoSuccess", (state, action) => {
      state.isLoading = false;
      state.admin = action.payload.admin;
      state.successMessage = action.payload.successMessage;
    })
    .addCase("updateAdminInfoFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Clear messages and errors
    .addCase("clearAdminMessages", (state) => {
      state.successMessage = null;
    })
    .addCase("clearAdminErrors", (state) => {
      state.error = null;
    });
});
