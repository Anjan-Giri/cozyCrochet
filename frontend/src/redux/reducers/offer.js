import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

export const offerReducer = createReducer(initialState, (builder) => {
  builder
    // Create offer
    .addCase("offerCreateRequest", (state) => {
      state.isLoading = true;
      state.success = false;
      state.error = null;
    })
    .addCase("offerCreateSuccess", (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.success = true;
    })
    .addCase("offerCreateFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    // Get all offers of shop
    .addCase("getAllOffersShopRequest", (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase("getAllOffersShopSuccess", (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    })
    .addCase("getAllOffersShopFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Delete offer of a shop
    .addCase("deleteOfferRequest", (state) => {
      state.isLoading = true;
      state.error = null;
      state.message = null;
    })
    .addCase("deleteOfferSuccess", (state, action) => {
      state.isLoading = false;
      state.message = action.payload;
    })
    .addCase("deleteOfferFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // all offers
    .addCase("getAllOffersRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOffersSuccess", (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    })
    .addCase("getAllOffersFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
