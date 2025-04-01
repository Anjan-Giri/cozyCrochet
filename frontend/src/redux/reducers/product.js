import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  allProducts: [],
  products: [],
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

    // all products
    .addCase("getAllProductsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllProductsSuccess", (state, action) => {
      state.isLoading = false;
      state.allProducts = action.payload;
    })
    .addCase("getAllProductsFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // update product
    .addCase("updateProductRequest", (state) => {
      state.isLoading = true;
      state.success = false;
      state.error = null;
    })
    .addCase("updateProductSuccess", (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.success = true;
    })
    .addCase("updateProductFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase("updateProductReset", (state) => {
      state.success = false;
    })

    // all categories
    .addCase("getAllCategoriesRequest", (state) => {
      state.isLoadingCategories = true;
    })
    .addCase("getAllCategoriesSuccess", (state, action) => {
      state.isLoadingCategories = false;
      state.categories = action.payload;
    })
    .addCase("getAllCategoriesFailed", (state, action) => {
      state.isLoadingCategories = false;
      state.categoriesError = action.payload;
    })

    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
