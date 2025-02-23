import React from "react";
import Timer from "./Timer.jsx";

const OfferCard = ({ offers, active }) => {
  // Find offer with highest discount percentage
  const getBestOffer = () => {
    if (!offers || offers.length === 0) return null;

    return offers.reduce((best, current) => {
      const currentDiscount =
        ((current.originalPrice - current.discountPrice) /
          current.originalPrice) *
        100;
      const bestDiscount = best
        ? ((best.originalPrice - best.discountPrice) / best.originalPrice) * 100
        : 0;
      return currentDiscount > bestDiscount ? current : best;
    }, null);
  };

  const bestOffer = getBestOffer();

  if (!bestOffer) return null;

  const discountPercentage = Math.round(
    ((bestOffer.originalPrice - bestOffer.discountPrice) /
      bestOffer.originalPrice) *
      100
  );

  return (
    <div
      className={`w-full block bg-[#e3cdb6] rounded-lg ${
        active ? "unset" : "mb-12"
      } lg:flex p-2 border-b-orange-200 border-2`}
    >
      <div className="w-full lg:w-[50%] m-auto p-10 justify-center">
        <img
          src={
            bestOffer.images[0]?.url ||
            "https://images.pexels.com/photos/7127868/pexels-photo-7127868.jpeg"
          }
          alt={bestOffer.name}
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-4 pb-4 mr-16">
        <div className="bg-red-500 text-white px-2 py-1 rounded-full w-fit mb-2">
          {discountPercentage}% OFF
        </div>
        <h2 className="text-[25px] font-semibold font-Roboto text-[#48004f]">
          {bestOffer.name}
        </h2>
        <p className="pt-6 text-[15px] font-Roboto">{bestOffer.description}</p>
        <div className="flex pb-6 pt-10 justify-between">
          <div className="flex">
            <h5 className="font-bold text-[20px] text-[#5d0675] font-Roboto">
              Nrs {bestOffer.discountPrice.toLocaleString()}
            </h5>
            <h5 className="font-semibold text-[15px] text-[#b55252] pl-3 line-through">
              Nrs {bestOffer.originalPrice.toLocaleString()}
            </h5>
          </div>
          <span className="pr-3 font-semibold text-[17px] text-[#00392e]">
            {bestOffer.sold_out} sold
          </span>
        </div>
        <Timer endDate={bestOffer.endDate} />
      </div>
    </div>
  );
};

export default OfferCard;
