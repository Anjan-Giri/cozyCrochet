import React from "react";
import { brandingData } from "../../../stat/data";

const Categories = () => {
  return (
    <>
      <div className="w-full hidden sm:block">
        <div className="my-12 flex justify-between w-full shadow-sm bg-gradient-to-tr from-[#9b8b6b] to-[#dfcda0] p-5 px-16 rounded-md">
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-start" key={index}>
                {i.icon}
                <div className="px-5">
                  <h3 className="font-bold text-sm md:text-base">{i.title}</h3>
                  <p className="text-xs md:text-sm text-[#440007]">
                    {i.Description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Categories;
