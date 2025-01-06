import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import ProductCard from "../Home/ProductCard/ProductCard";
import styles from "../../styles/styles";
import { productData } from "../../stat/data";

const SuggestedProduct = ({ data }) => {
  //   const { allProducts } = useSelector((state) => state.products);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    const d =
      productData && productData.filter((i) => i.category === data.category);
    setProducts(d);
  }, []);

  return (
    <div>
      {data ? (
        <div className={`p-4 ${styles.section}`}>
          <div className="text-[27px] text-center md:text-start font-[600] font-Roboto pt-[30px] pb-[20px] text-[#690071]">
            <h1 className="underline">Related Products</h1>
          </div>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {products &&
              products.map((i, index) => <ProductCard data={i} key={index} />)}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SuggestedProduct;
