// import React, { useEffect, useState } from "react";
// import Header from "../components/Layout/Header";
// import Footer from "../components/Layout/Footer";
// import ProductDetails from "../components/Products/ProductDetails";
// import { useParams } from "react-router-dom";
// import { productData } from "../stat/data";

// const ProductDetailsPage = () => {
//   const { name } = useParams();

//   const [data, setData] = useState(null);

//   //   const productName = name.replace(/-/g, " ");
//   const productName = name
//     .replace(/-+/g, " ")
//     .replace(/\s+/g, " ")
//     .trim()
//     .toLowerCase();

//   //   console.log(name);

//   useEffect(() => {
//     // const data = productData.find((item) => item.name === productName);
//     // setData(data);

//     const normalizedProductData = productData.map((item) => ({
//       ...item,
//       name: item.name.toLowerCase().replace(/\s+/g, " ").trim(),
//     }));

//     const data = normalizedProductData.find(
//       (item) => item.name === productName
//     );

//     setData(data);
//   }, [productName]);

//   console.log(data);
//   console.log("Route Param:", name);
//   console.log("Formatted Name:", productName);
//   console.log("Matched Data:", data);
//   console.log("Product Data:", productData);
//   return (
//     <div>
//       <Header />
//       <ProductDetails data={data} />
//       <Footer />
//     </div>
//   );
// };

// export default ProductDetailsPage;

import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductDetails from "../components/Products/ProductDetails";
import { useParams } from "react-router-dom";
import { productData } from "../stat/data";
import SuggestedProduct from "../components/Products/SuggestedProduct.jsx";

const ProductDetailsPage = () => {
  const { name } = useParams();

  const [data, setData] = useState(null);

  const productName = name
    .replace(/-+/g, " ") // Replace multiple hyphens with a single space
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim()
    .toLowerCase();

  useEffect(() => {
    const normalizedProductData = productData.map((item) => ({
      ...item,
      normalizedName: item.name
        .toLowerCase()
        .replace(/-+/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    }));

    const matchedData = normalizedProductData.find(
      (item) => item.normalizedName === productName
    );

    setData(matchedData || null);
  }, [productName]);

  console.log(data);
  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {data && <SuggestedProduct data={data} />}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
