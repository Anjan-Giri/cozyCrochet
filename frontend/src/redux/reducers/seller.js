import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const sellerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("LoadSellerRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("LoadSellerSuccess", (state, action) => {
      state.isLoading = false;
      state.isSeller = true;
      state.seller = action.payload;
    })
    .addCase("LoadSellerFail", (state, action) => {
      state.isLoading = false;
      state.isSeller = false;
      state.error = action.payload;
    })
    // logout cases
    .addCase("LogoutRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("LogoutSuccess", (state) => {
      state.isLoading = false;
      state.isSeller = false;
      state.seller = null;
    })
    .addCase("LogoutFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    //update info
    .addCase("updateSellerInfoRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("updateSellerInfoSuccess", (state, action) => {
      state.isLoading = false;
      state.seller = action.payload.shop;
      state.successMessage = action.payload.successMessage;
    })
    .addCase("updateSellerInfoFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    .addCase("clearMessages", (state) => {
      state.successMessage = null;
    })

    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
