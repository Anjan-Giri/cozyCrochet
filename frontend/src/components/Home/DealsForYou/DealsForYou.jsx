import React, { useEffect, useState } from "react";
import { productData } from "../../../stat/data";

import ProductCard from "../ProductCard/ProductCard.jsx";
import styles from "../../../styles/styles";

const DealsForYou = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const d =
      productData && productData.sort((a, b) => b.total_sell - a.total_sell);

    const best = d.slice(0, 5);

    setData(best);
  }, []);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className="text-[27px] text-center md:text-start font-[600] font-Roboto pt-[30px] pb-[20px] text-[#690071]">
          <h1 className="underline">Best Deals</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {data && data.length !== 0 && (
            <>
              {data &&
                data.map((i, index) => <ProductCard data={i} key={index} />)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealsForYou;
