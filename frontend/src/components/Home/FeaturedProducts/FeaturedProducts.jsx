import React, { useEffect, useState } from "react";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import { useSelector } from "react-redux";
import Loader from "../../Layout/Loader";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const shopProducts = new Map();

      allProducts.forEach((product) => {
        if (!shopProducts.has(product.shopId)) {
          shopProducts.set(product.shopId, []);
        }
        shopProducts.get(product.shopId).push(product);
      });

      const featuredItems = [];
      let remainingSlots = 10;

      //get one product from each shop
      for (const [_, products] of shopProducts.entries()) {
        if (remainingSlots <= 0) break;
        featuredItems.push(products[0]);
        remainingSlots--;
      }

      //if needed, get additional products
      if (remainingSlots > 0) {
        const remainingProducts = allProducts
          .filter((p) => !featuredItems.some((f) => f._id === p._id))
          .slice(0, remainingSlots);

        featuredItems.push(...remainingProducts);
      }

      setFeaturedProducts(featuredItems);
    }
  }, [allProducts]);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className="text-[27px] text-center md:text-start font-[600] font-Roboto pt-[30px] pb-[20px] text-[#690071]">
          <h1 className="underline">Featured Products</h1>
        </div>
        {!allProducts ? (
          <div className="flex justify-center items-center h-[200px]">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
            {featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <ProductCard data={product} key={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p>No featured products available at this time.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;
