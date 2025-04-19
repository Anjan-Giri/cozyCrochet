import React from "react";
import home4 from "../../assests/home4.jpeg";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";

const HomeSection = () => {
  return (
    <div
      className="relative min-h-[70vh] 800px:min-h-[80vh] bg-no-repeat flex items-center w-12/12 mx-auto"
      style={{
        backgroundImage: `url(${home4})`,
        backgroundSize: "cover",
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%] ml-8 mt-2`}>
        <h1
          className={`text-[35px] leading-[1.2] 800px:text-6xl text-[#3f004c] font-semibold`}
        >
          Best Place for <br /> Crochet Collections!
        </h1>
        <p className="pt-5 pr-6 text-[16px] font-Poppins text-[#3f004c]">
          Discover our handcrafted crochet items made with premium yarns and
          artisanal care. <br /> Each piece tells a unique story, combining
          traditional techniques with modern designs.
        </p>
        <Link to="/products" className="inline-block">
          <div className="w-[150px] text-white hover:text-[#3f004c] bg-[#2d0036] hover:bg-[#baaf96] hover:scale-105 duration-300 h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer mt-10">
            <span className="font-Poppins text-[18px]">Explore Now</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomeSection;
