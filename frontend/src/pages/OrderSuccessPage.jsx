import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import OrderSuccess from "../components/Checkout/OrderSuccess.jsx";

const OrderSuccessPage = () => {
  return (
    <div>
      <Header />
      <br />
      <br />
      <OrderSuccess />
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
