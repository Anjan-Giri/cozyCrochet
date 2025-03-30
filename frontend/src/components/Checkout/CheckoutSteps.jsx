import React from "react";

const CheckoutSteps = ({ active }) => {
  return (
    <div className="w-full flex justify-center py-6">
      <div className="w-[90%] 800px:w-[50%] flex items-center flex-wrap">
        <div className="flex items-center">
          <div
            className={`
            flex items-center justify-center px-4 py-2 rounded-md
            ${
              active >= 1
                ? "bg-[#7a14b0] text-white"
                : "bg-[#e3d5e9] text-[#50007a]"
            }
            cursor-pointer hover:scale-105 duration-300
          `}
          >
            <span className="font-semibold">1. Shipping</span>
          </div>
          <div
            className={`${
              active > 1
                ? "w-[30px] 800px:w-[70px] h-[4px] bg-[#50007a]"
                : "w-[30px] 800px:w-[70px] h-[4px] bg-[#e3d5e9]"
            }`}
          />
        </div>

        <div className="flex items-center">
          <div
            className={`
            flex items-center justify-center px-4 py-2 rounded-md
            ${
              active >= 2
                ? "bg-[#50007a] text-white"
                : "bg-[#e3d5e9] text-[#50007a]"
            }
            cursor-pointer hover:scale-105 duration-300
          `}
          >
            <span className="font-semibold">2. Payment</span>
          </div>
          <div
            className={`${
              active > 2
                ? "w-[30px] 800px:w-[70px] h-[4px] bg-[#50007a]"
                : "w-[30px] 800px:w-[70px] h-[4px] bg-[#e3d5e9]"
            }`}
          />
        </div>

        <div className="flex items-center">
          <div
            className={`
            flex items-center justify-center px-4 py-2 rounded-md
            ${
              active >= 3
                ? "bg-[#50007a] text-white"
                : "bg-[#e3d5e9] text-[#50007a]"
            }
            cursor-pointer hover:scale-105 duration-300
          `}
          >
            <span className="font-semibold">3. Success</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;
