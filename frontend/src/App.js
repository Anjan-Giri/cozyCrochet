import React, { useEffect } from "react";
import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  BestSellingPage,
  ProductPage,
  OfferPage,
  FAQPage,
  ProductDetailsPage,
  ProfilePage,
  CreateShopPage,
  SellerActivationPage,
  ShopLoginPage,
  ShopPreviewPage,
} from "./routes/Routes.js";

import {
  ShopHomePage,
  ShopDashboardPage,
  CreateProduct,
  ShopAllProducts,
  CreateOfferPage,
  AllOffersPage,
  AllCouponsPage,
} from "./routes/ShopRoutes.js";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadSeller, loadUser } from "./redux/actions/user.js";

import ProtectedRoute from "./routes/ProtectedRoute.js";
import Store from "./redux/store.js";
import SellerProtectedRoute from "./routes/SellerProtectedRoute.js";
import { fetchCart } from "./redux/actions/cart.js";
import { fetchWishlist } from "./redux/actions/wishlist.js";

const App = () => {
  // const dispatch = useDispatch();

  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(fetchCart());
    Store.dispatch(fetchWishlist());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route
          path="/activation/:activation_token"
          element={<ActivationPage />}
        />
        <Route
          path="/seller/activation/:activation_token"
          element={<SellerActivationPage />}
        />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/offers" element={<OfferPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/product/:name" element={<ProductDetailsPage />} />
        <Route path="/shop-preview/:id" element={<ShopPreviewPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/shop-create" element={<CreateShopPage />} />
        <Route path="/shop-login" element={<ShopLoginPage />} />
        <Route
          path="/shop/:id"
          element={
            <SellerProtectedRoute>
              <ShopHomePage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <SellerProtectedRoute>
              <ShopDashboardPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-product"
          element={
            <SellerProtectedRoute>
              <CreateProduct />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-products"
          element={
            <SellerProtectedRoute>
              <ShopAllProducts />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-offer"
          element={
            <SellerProtectedRoute>
              <CreateOfferPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-offer"
          element={
            <SellerProtectedRoute>
              <AllOffersPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-coupon"
          element={
            <SellerProtectedRoute>
              <AllCouponsPage />
            </SellerProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;
