import React from "react";
import { productData } from "../../../stat/data";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";

const FeaturedProducts = () => {
  return (
    <div>
      <div className={`${styles.section}`}>
        <div className="text-[27px] text-center md:text-start font-[600] font-Roboto pt-[30px] pb-[20px] text-[#690071]">
          <h1 className="underline">Featured Products</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {productData &&
            productData.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
