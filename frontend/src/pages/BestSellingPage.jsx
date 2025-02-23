import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import ProductCard from "../components/Home/ProductCard/ProductCard";
import Footer from "../components/Layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../redux/actions/product";

const BestSellingPage = () => {
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
    // const firstFive = sortedData && sortedData.slice(0, 5);
    // setData(firstFive);
    setData(sortedData);
  }, [allProducts]);

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
