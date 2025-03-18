import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  cart:
    localStorage.getItem("cartItems") &&
    localStorage.getItem("cartItems") !== "undefined"
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToCart", (state, action) => {
      const item = action.payload;
      const existItem = state.cart.find((i) => i._id === item._id);
      if (existItem) {
        return {
          ...state,
          cart: state.cart.map((i) => (i._id === existItem._id ? item : i)),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, item],
        };
      }
    })
    .addCase("removeFromCart", (state, action) => {
      return {
        ...state,
        cart: state.cart.filter((i) => i._id !== action.payload),
      };
    });
});
