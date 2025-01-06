import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import { useSearchParams } from "react-router-dom";
import { productData } from "../stat/data";
import ProductCard from "../components/Home/ProductCard/ProductCard";
import Footer from "../components/Layout/Footer";

const ProductPage = () => {
  const [data, setData] = useState([]);

  const [searchParams] = useSearchParams();

  const categoryData = searchParams.get("category");

  useEffect(() => {
    if (categoryData === null) {
      const d =
        productData && productData.sort((a, b) => a.total_sell - b.total_sell);

      setData(d);
    } else {
      const d =
        productData &&
        productData.filter((item) => item.category === categoryData);

      setData(d);
    }
  }, []);

  return (
    <div>
      <Header activeHeading={3} />

      <div className="w-11/12 mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap[25px] xl:grid-cols-5 gap-[30px] mb-12 ">
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>
        {data && data.length === 0 ? (
          <h1 className=" flex justify-center items-center text-center w-full top-[50%] bottom-[50%] text-[30px] text-[#ac1e1e] font-semibold">
            No Product Found
          </h1>
        ) : null}
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;
