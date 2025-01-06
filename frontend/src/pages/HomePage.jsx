import React from "react";
import Header from "../components/Layout/Header.jsx";
import HomeSection from "../components/Home/HomeSection.jsx";
import Categories from "../components/Home/Categories/Categories.jsx";
import DealsForYou from "../components/Home/DealsForYou/DealsForYou.jsx";
import FeaturedProducts from "../components/Home/FeaturedProducts/FeaturedProducts.jsx";
import Offer from "../components/Home/Offer/Offer.jsx";
import Support from "../components/Home/Support/Support.jsx";
import Footer from "../components/Layout/Footer.jsx";

const HomePage = () => {
  return (
    <div>
      <Header activeHeading={1} />
      <HomeSection />

      <DealsForYou />

      <Categories />

      <FeaturedProducts />
      <Offer />
      <Support />
      <Footer />
    </div>
  );
};

export default HomePage;
