// import React, { useEffect } from "react";
// import "./App.css";

// import { BrowserRouter, Route, Routes } from "react-router-dom";

// import {
//   LoginPage,
//   SignupPage,
//   ActivationPage,
//   HomePage,
//   BestSellingPage,
//   ProductPage,
//   OfferPage,
//   FAQPage,
//   ProductDetailsPage,
//   ProfilePage,
// } from "./Routes.js";

// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// // import axios from "axios";
// // import { server } from "./server.js";
// import Store from "./redux/store.js";
// import { loadUser } from "./redux/actions/user.js";
// import { useSelector } from "react-redux";
// // import { useDispatch } from "react-redux";

// const App = () => {
//   const { loading } = useSelector((state) => state.user);

//   // const dispatch = useDispatch();

//   // useEffect(() => {
//   //   dispatch(loadUser());
//   // }, [dispatch]);
//   useEffect(() => {
//     Store.dispatch(loadUser());
//   }, []);

//   return (
//     <>
//       {loading ? null : (
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/sign-up" element={<SignupPage />} />
//             <Route
//               path="/activation/:activation_token"
//               element={<ActivationPage />}
//             />
//             <Route path="/products" element={<ProductPage />} />
//             <Route path="/best-selling" element={<BestSellingPage />} />
//             <Route path="/offers" element={<OfferPage />} />
//             <Route path="/faq" element={<FAQPage />} />
//             <Route path="/product/:name" element={<ProductDetailsPage />} />
//             <Route path="/profile" element={<ProfilePage />} />
//           </Routes>
//           <ToastContainer
//             position="top-right"
//             autoClose={5000}
//             hideProgressBar={false}
//             newestOnTop={false}
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//             theme="dark"
//           />
//         </BrowserRouter>
//       )}
//     </>
//   );
// };

// export default App;

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

const App = () => {
  // const dispatch = useDispatch();

  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
  }, []);

  // If still loading, show a loading screen or spinner
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
  //     </div>
  //   );
  // }

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
