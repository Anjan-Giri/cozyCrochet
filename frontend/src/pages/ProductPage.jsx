import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/Home/ProductCard/ProductCard";
import ProductFilter from "../components/Products/ProductFilter";
import Footer from "../components/Layout/Footer";
import { useSelector } from "react-redux";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("default");
  const { allProducts } = useSelector((state) => state.products);

  //filter by category
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
      setFilteredData(filteredProducts);
    }
  }, [allProducts, categoryParam]);

  //apply sorting
  useEffect(() => {
    let sortedData = [...data];

    switch (activeFilter) {
      case "price-asc":
        sortedData.sort(
          (a, b) =>
            (a.discountPrice || a.originalPrice) -
            (b.discountPrice || b.originalPrice)
        );
        break;
      case "price-desc":
        sortedData.sort(
          (a, b) =>
            (b.discountPrice || b.originalPrice) -
            (a.discountPrice || a.originalPrice)
        );
        break;
      case "sold-desc":
        sortedData.sort((a, b) => b.sold_out - a.sold_out);
        break;
      case "date-desc":
        sortedData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "date-asc":
        sortedData.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "ratings-desc":
        sortedData.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
        break;
      default:
        // Default sorting - can be by relevance or whatever makes sense for your app
        break;
    }

    setFilteredData(sortedData);
  }, [activeFilter, data]);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  return (
    <div>
      <Header activeHeading={3} />

      <div className="w-11/12 mx-auto py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          {categoryParam && (
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
              Category: <span className="text-purple-700">{categoryParam}</span>
            </h2>
          )}

          <div className="flex-shrink-0">
            <ProductFilter onFilterChange={handleFilterChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap[25px] xl:grid-cols-5 gap-[30px] mb-12">
          {filteredData &&
            filteredData.map((i, index) => (
              <ProductCard data={i} key={index} />
            ))}
        </div>

        {filteredData && filteredData.length === 0 ? (
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
