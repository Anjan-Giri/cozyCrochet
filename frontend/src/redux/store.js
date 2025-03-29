import { configureStore } from "@reduxjs/toolkit";

import { userReducer } from "./reducers/user.js";

import { sellerReducer } from "./reducers/seller";
import { productReducer } from "./reducers/product.js";
import { offerReducer } from "./reducers/offer.js";
import { cartReducer } from "./reducers/cart.js";
import { wishlistReducer } from "./reducers/wishlist.js";

const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    products: productReducer,
    offers: offerReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});
export default Store;
