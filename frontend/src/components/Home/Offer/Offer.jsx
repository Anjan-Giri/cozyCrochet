import React from "react";
import styles from "../../../styles/styles";
import OfferCard from "./OfferCard.jsx";

const Offer = () => {
  return (
    <div>
      <div className={`${styles.section}`}>
        <div className="text-[27px] text-center md:text-start font-[600] font-Roboto pt-[30px] pb-[30px] text-[#690071]">
          <h1 className="underline">Special Offer</h1>
        </div>
      </div>
      <div className="w-full grid">
        <OfferCard />
      </div>
    </div>
  );
};

export default Offer;
