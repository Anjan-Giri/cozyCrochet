import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/Home/ProductCard/ProductCard";
import Footer from "../components/Layout/Footer";
import { useSelector } from "react-redux";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      let filteredProducts = [...allProducts];

      // Filter by category if category parameter exists
      if (categoryParam) {
        filteredProducts = allProducts.filter(
          (product) => product.category === categoryParam
        );
      }

      setData(filteredProducts);
    }
  }, [allProducts, categoryParam]);

  return (
    <div>
      <Header activeHeading={3} />

      <div className="w-11/12 mx-auto py-16">
        {categoryParam && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              Category: <span className="text-purple-700">{categoryParam}</span>
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap[25px] xl:grid-cols-5 gap-[30px] mb-12">
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>

        {data && data.length === 0 ? (
          <h1 className="flex justify-center items-center text-center w-full top-[50%] bottom-[50%] text-[30px] text-[#ac1e1e] font-semibold">
            {categoryParam
              ? `No Products Found in "${categoryParam}" Category`
              : "No Products Found"}
          </h1>
        ) : null}
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;
