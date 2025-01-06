import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import { useSearchParams } from "react-router-dom";
import { productData } from "../stat/data";
import ProductCard from "../components/Home/ProductCard/ProductCard";
import Footer from "../components/Layout/Footer";

const BestSellingPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const d =
      productData && productData.sort((a, b) => b.total_sell - a.total_sell);

    setData(d);
  }, []);

  return (
    <div>
      <Header activeHeading={2} />

      <div className="w-11/12 mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap[25px] xl:grid-cols-5 gap-[30px] mb-12 ">
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BestSellingPage;
