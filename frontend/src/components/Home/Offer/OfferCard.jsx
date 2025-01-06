import React from "react";

import Timer from "./Timer.jsx";

const OfferCard = ({ active }) => {
  return (
    <div className="w-full block bg-[#e3cdb6] rounded-lg ${active ? unset : mb-12} lg:flex p-2">
      <div className="w-full lg:-w[50%] m-auto p-10 justify-center">
        <img
          src="https://images.pexels.com/photos/7127868/pexels-photo-7127868.jpeg"
          alt="product"
        />
      </div>
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-4 pb-4 mr-16">
        <h2 className="text-[25px] font-semibold font-Roboto text-[#48004f]">
          Crochet Toy Handmade
        </h2>
        <p className="pt-6 text-[15px] font-Roboto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. A enim
          accusamus ad eligendi, totam, fugiat libero molestiae quam laudantium,
          maiores voluptate possimus eum corrupti! Vitae mollitia repellat odit
          similique asperiores.
        </p>
        <div className="flex pb-6 pt-10 justify-between">
          <div className="flex">
            <h5 className="font-bold text-[20px] text-[#5d0675] font-Roboto">
              Nrs 500
            </h5>
            <h5 className="font-semibold text-[15px] text-[#b55252] pl-3 line-through">
              Nrs 1000
            </h5>
          </div>
          <span className="pr-3 font-semibold text-[17px] text-[#00392e]">
            120 sold
          </span>
        </div>
        <Timer />
      </div>
    </div>
  );
};

export default OfferCard;
