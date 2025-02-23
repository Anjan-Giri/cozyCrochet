import React, { useEffect } from "react";
import Header from "../components/Layout/Header";
import OfferCard from "../components/Home/Offer/OfferCard";
import Footer from "../components/Layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getAllOffers } from "../redux/actions/offer";
import Loader from "../components/Layout/Loader";

const OfferPage = () => {
  const dispatch = useDispatch();
  const { products: offers, isLoading } = useSelector((state) => state.offers);

  useEffect(() => {
    dispatch(getAllOffers());
  }, [dispatch]);

  return (
    <div>
      <Header activeHeading={4} />
      <div>
        <div className="text-[27px] text-center md:text-center font-[600] font-Roboto pt-[30px] pb-[30px] text-[#690071]">
          <h1 className="underline">Offers</h1>
        </div>

        <div className="w-full grid">
          {isLoading ? (
            <div className="text-center">
              <Loader />
            </div>
          ) : offers && offers.length > 0 ? (
            offers.map((offer) => (
              <OfferCard key={offer.id} offers={[offer]} active={true} />
            ))
          ) : (
            <div className="text-center text-gray-500">No offers available</div>
          )}
        </div>

        {/* <div className="w-full grid">
          {isLoading ? (
            <div className="text-center">
              <Loader />
            </div>
          ) : offers && offers.length > 0 ? (
            <OfferCard offers={offers} active={true} />
          ) : (
            <div className="text-center text-gray-500">No offers available</div>
          )}
        </div> */}
      </div>
      <Footer />
    </div>
  );
};

export default OfferPage;
