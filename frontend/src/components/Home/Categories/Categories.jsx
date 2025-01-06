import React from "react";
import { brandingData } from "../../../stat/data";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <div
        className={`${styles.section} bg-white p-6 rounded-lg my-12`}
        id="categories"
      >
        <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
          {categoriesData &&
            categoriesData.map((i) => {
              const handleSubmit = (i) => {
                navigate(`/products?category=${i.title}`);
              };

              return (
                <div
                  className="w-full h-[120px] flex items-center justify-between cursor-pointer overflow-hidden"
                  key={i.id}
                  onClick={() => handleSubmit(i)}
                >
                  <h5 className="text-[15px] leading-[1.3] text-[#690071] font-semibold pr-4">
                    {i.title}
                  </h5>
                  <img
                    src={i.image_Url}
                    className="w-[140px] object-cover"
                    alt=""
                  />
                </div>
              );
            })}
        </div>
      </div> */}

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
