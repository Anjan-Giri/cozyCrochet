import { configureStore } from "@reduxjs/toolkit";

import { userReducer } from "./reducers/user.js";

import { sellerReducer } from "./reducers/seller";
import { productReducer } from "./reducers/product.js";
import { offerReducer } from "./reducers/offer.js";

const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    products: productReducer,
    offers: offerReducer,
  },
});
export default Store;
