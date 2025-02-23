// import React from "react";
// import styles from "../../../styles/styles";
// import OfferCard from "./OfferCard.jsx";

// const Offer = () => {
//   return (
//     <div>
//       <div className={`${styles.section}`}>
//         <div className="text-[27px] text-center md:text-start font-[600] font-Roboto pt-[30px] pb-[30px] text-[#690071]">
//           <h1 className="underline">Special Offer</h1>
//         </div>
//       </div>
//       <div className="w-full grid">
//         <OfferCard offers={offers} active={true} />
//       </div>
//     </div>
//   );
// };

// export default Offer;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../styles/styles";
import OfferCard from "./OfferCard.jsx";
import { getAllOffers } from "../../../redux/actions/offer";
import Loader from "../../Layout/Loader.jsx";

const Offer = () => {
  const dispatch = useDispatch();
  const { products: offers, isLoading } = useSelector((state) => state.offers);

  useEffect(() => {
    dispatch(getAllOffers());
  }, [dispatch]);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className="text-[27px] text-center md:text-start font-[600] font-Roboto pt-[30px] pb-[30px] text-[#690071]">
          <h1 className="underline">Special Offer</h1>
        </div>
      </div>
      <div className="w-full grid">
        {isLoading ? (
          <div className="text-center">
            <Loader />
          </div>
        ) : offers && offers.length > 0 ? (
          <OfferCard offers={offers} active={true} />
        ) : (
          <div className="text-center text-gray-500">No offers available</div>
        )}
      </div>
    </div>
  );
};

export default Offer;
