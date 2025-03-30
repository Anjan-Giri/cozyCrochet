import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import CheckoutSteps from "../components/Checkout/CheckoutSteps.jsx";
import Payment from "../components/Checkout/Payment.jsx";

const stripePromise = loadStripe(
  "pk_test_51R7vXcRorWVRKHcRmBPsDWeNVltQqEXmmMo14OfdenXjgCVKqQpiYVia20AJjytLWsAU6kPolzMBMykPVXJ4YqNV009nnepDHA"
);

const PaymentPage = () => {
  return (
    <div>
      <Header />
      <br />
      <br />
      <CheckoutSteps active={2} />
      <Elements stripe={stripePromise}>
        <Payment />
      </Elements>
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default PaymentPage;
