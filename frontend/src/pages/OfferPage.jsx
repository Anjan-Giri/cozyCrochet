import React from "react";
import Header from "../components/Layout/Header";
import OfferCard from "../components/Home/Offer/OfferCard";
import Footer from "../components/Layout/Footer";

const OfferPage = () => {
  return (
    <div>
      <Header activeHeading={4} />
      <OfferCard active={true} />
      <OfferCard active={true} />
      <Footer />
    </div>
  );
};

export default OfferPage;
