import React, { useEffect, useState } from "react";
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
  CheckoutPage,
  PaymentPage,
  OrderSuccessPage,
  CalendarPage,
  UserOrderDetailsPage,
  TrackOrderPage,
  ContactUsPage,
} from "./routes/Routes.js";

import {
  ShopHomePage,
  ShopDashboardPage,
  CreateProduct,
  ShopAllProducts,
  CreateOfferPage,
  AllOffersPage,
  AllCouponsPage,
  ShopAllOrders,
  ShopOrderDetailsPage,
  ShopSettingsPage,
} from "./routes/ShopRoutes.js";

import {
  AdminLoginPage,
  AdminDashboard,
  AdminUsers,
  AdminSellers,
  AdminProducts,
  AdminOrders,
} from "./routes/AdminRoutes.js";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadSeller, loadUser } from "./redux/actions/user.js";

import ProtectedRoute from "./routes/ProtectedRoute.js";
import Store from "./redux/store.js";
import SellerProtectedRoute from "./routes/SellerProtectedRoute.js";
import { fetchCart } from "./redux/actions/cart.js";
import { fetchWishlist } from "./redux/actions/wishlist.js";
import { server } from "./server.js";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import { loadAdmin } from "./redux/actions/admin.js";
import AdminProtectedRoute from "./routes/AdminProtectedRoute.js";

const App = () => {
  const [stripeApikey, setStripeApikey] = useState("");

  useEffect(() => {
    async function getStripeApikey() {
      try {
        const { data } = await axios.get(`${server}/payment/stripeapikey`);
        setStripeApikey(data.stripeApikey);
        console.log("Stripe Api Key updated:", data.stripeApikey);
      } catch (error) {
        console.error("Error fetching Stripe API key:", error);
      }
    }

    getStripeApikey();
  }, []);

  // This will still show empty initially, but the log inside useEffect will show the updated value
  console.log("Current Stripe Api Key value:", stripeApikey);

  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(fetchCart());
    Store.dispatch(fetchWishlist());
    Store.dispatch(loadAdmin());
  }, []);

  return (
    <BrowserRouter>
      {stripeApikey && (
        <Elements stripe={loadStripe(stripeApikey)}>
          <Routes>
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>
        </Elements>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
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
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/product/:name" element={<ProductDetailsPage />} />
        <Route path="/shop-preview/:id" element={<ShopPreviewPage />} />
        <Route
          path="/calendar-events"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/order/:id"
          element={
            <ProtectedRoute>
              <UserOrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/track-order/:id"
          element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccessPage />
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
          path="/dashboard-orders"
          element={
            <SellerProtectedRoute>
              <ShopAllOrders />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <SellerProtectedRoute>
              <ShopOrderDetailsPage />
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
        <Route
          path="/settings"
          element={
            <SellerProtectedRoute>
              <ShopSettingsPage />
            </SellerProtectedRoute>
          }
        />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <AdminUsers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/sellers"
          element={
            <AdminProtectedRoute>
              <AdminSellers />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminProtectedRoute>
              <AdminProducts />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminProtectedRoute>
              <AdminOrders />
            </AdminProtectedRoute>
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
