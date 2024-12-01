// import { createReducer } from "@reduxjs/toolkit";

// const initialState = {
//   isAuthenticated: false,
// };

// export const userReducer = createReducer(initialState, {
//   LoadUserRequest: (state) => {
//     state.loading = true;
//   },

//   LoadUserSuccess: (state, action) => {
//     state.loading = false;
//     state.isAuthenticated = true;
//     state.user = action.payload;
//   },

//   LoadUserFail: (state, action) => {
//     state.loading = false;
//     state.isAuthenticated = false;
//     // state.user = null;
//     state.error = action.payload;
//   },

//   clearErrors: (state) => {
//     state.error = null;
//   },
// });

import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("LoadUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("LoadUserSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    })
    .addCase("LoadUserFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
