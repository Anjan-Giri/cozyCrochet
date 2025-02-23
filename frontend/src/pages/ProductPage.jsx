import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import { useSearchParams } from "react-router-dom";
import { productData } from "../stat/data";
import ProductCard from "../components/Home/ProductCard/ProductCard";
import Footer from "../components/Layout/Footer";
import { useSelector } from "react-redux";

const ProductPage = () => {
  const [data, setData] = useState([]);

  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      // Map to track products per shop
      const shopProducts = new Map();

      // Group products by shop
      allProducts.forEach((product) => {
        if (!shopProducts.has(product.shopId)) {
          shopProducts.set(product.shopId, []);
        }
        shopProducts.get(product.shopId).push(product);
      });

      setData(allProducts);
    }
  }, [allProducts]);

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
