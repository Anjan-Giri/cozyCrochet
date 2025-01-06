// import { createReducer } from "@reduxjs/toolkit";

// const initialState = {
//   isLoading: true,
// };

// export const productReducer = createReducer(initialState, {
//   productCreateRequest: (state) => {
//     state.isLoading = true;
//   },
//   productCreateSuccess: (state, action) => {
//     state.isLoading = false;
//     state.product = action.payload;
//     state.success = true;
//   },
//   productCreateFail: (state, action) => {
//     state.isLoading = false;
//     state.error = action.payload;
//     state.success = false;
//   },

//   clearErrors: (state) => {
//     state.error = null;
//   },
// });

import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

export const productReducer = createReducer(initialState, (builder) => {
  builder
    // Create product
    .addCase("productCreateRequest", (state) => {
      state.isLoading = true;
      state.success = false;
      state.error = null;
    })
    .addCase("productCreateSuccess", (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.success = true;
    })
    .addCase("productCreateFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    // Get all products of shop
    .addCase("getAllProductsShopRequest", (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase("getAllProductsShopSuccess", (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    })
    .addCase("getAllProductsShopFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Delete product of a shop
    .addCase("deleteProductRequest", (state) => {
      state.isLoading = true;
      state.error = null;
      state.message = null;
    })
    .addCase("deleteProductSuccess", (state, action) => {
      state.isLoading = false;
      state.message = action.payload;
    })
    .addCase("deleteProductFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    .addCase("clearErrors", (state) => {
      state.error = null;
    });
  // // Get all products
  // .addCase("getAllProductsRequest", (state) => {
  //   state.isLoading = true;
  //   state.error = null;
  // })
  // .addCase("getAllProductsSuccess", (state, action) => {
  //   state.isLoading = false;
  //   state.allProducts = action.payload;
  // })
  // .addCase("getAllProductsFailed", (state, action) => {
  //   state.isLoading = false;
  //   state.error = action.payload;
  // })
});
