// import React, { useState, useEffect } from "react";
// import { productData } from "../../stat/data";
// import ProductCard from "../Home/ProductCard/ProductCard";
// import { Link } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useParams } from "react-router-dom";
// import { getAllProductsShop } from "../../redux/actions/product";
// import { getAllOffersShop } from "../../redux/actions/offer";

// const ShopProfileData = ({ isOwner }) => {
//   const [active, setActive] = useState(1);
//   const { products } = useSelector((state) => state.products);
//   const { offers } = useSelector((state) => state.offers);
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(getAllProductsShop(id));
//     dispatch(getAllOffersShop(id));
//   }, [dispatch]);

//   return (
//     <div className="w-full">
//       <div className="flex w-full items-center justify-between">
//         <div className="w-full flex">
//           <div className="flex items-center" onClick={() => setActive(1)}>
//             <h5
//               className={`font-[600] text-[20px] ${
//                 active === 1 ? "text-red-800" : "text-[#333]"
//               } cursor-pointer pr-[20px]`}
//             >
//               Shop Products
//             </h5>
//           </div>
//           <div className="flex items-center" onClick={() => setActive(2)}>
//             <h5
//               className={`font-[600] text-[20px] ${
//                 active === 2 ? "text-red-800" : "text-[#333]"
//               } cursor-pointer pr-[20px]`}
//             >
//               Running Events
//             </h5>
//           </div>

//           <div className="flex items-center" onClick={() => setActive(3)}>
//             <h5
//               className={`font-[600] text-[20px] ${
//                 active === 3 ? "text-red-800" : "text-[#333]"
//               } cursor-pointer pr-[20px]`}
//             >
//               Shop Reviews
//             </h5>
//           </div>
//         </div>
//         <div>
//           {isOwner && (
//             <div>
//               <Link to="/dashboard">
//                 <div className="bg-gradient-to-r from-gray-900 to-gray-600 text-white font-bold hover:cursor-pointer hover:bg-gradient-to-l hover:from-gray-900 hover:to-gray-600 hover:text-gray-200 duration-300 ease-in-out rounded-lg flex items-center py-3 px-4 justify-center my-6">
//                   <span className="text-[#fff]">Dashboard</span>
//                 </div>
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>

//       <br />
//       {active === 1 && (
//         <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
//           {products &&
//             products.map((i, index) => (
//               <ProductCard data={i} key={index} isShop={true} />
//             ))}
//         </div>
//       )}

//       {/* {active === 2 && (
//         <div className="w-full">
//           <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
//             {events &&
//               events.map((i, index) => (
//                 <ProductCard
//                   data={i}
//                   key={index}
//                   isShop={true}
//                   isEvent={true}
//                 />
//               ))}
//           </div>
//           {events && events.length === 0 && (
//             <h5 className="w-full text-center py-5 text-[18px]">
//               No Events have for this shop!
//             </h5>
//           )}
//         </div>
//       )}

//       {active === 3 && (
//         <div className="w-full">
//           {allReviews &&
//             allReviews.map((item, index) => (
//               <div className="w-full flex my-4">
//                 <img
//                   src={`${item.user.avatar?.url}`}
//                   className="w-[50px] h-[50px] rounded-full"
//                   alt=""
//                 />
//                 <div className="pl-2">
//                   <div className="flex w-full items-center">
//                     <h1 className="font-[600] pr-2">{item.user.name}</h1>
//                     <Ratings rating={item.rating} />
//                   </div>
//                   <p className="font-[400] text-[#000000a7]">{item?.comment}</p>
//                   <p className="text-[#000000a7] text-[14px]">{"2days ago"}</p>
//                 </div>
//               </div>
//             ))}
//           {allReviews && allReviews.length === 0 && (
//             <h5 className="w-full text-center py-5 text-[18px]">
//               No Reviews have for this shop!
//             </h5>
//           )}
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default ShopProfileData;

import React, { useState, useEffect } from "react";
import ProductCard from "../Home/ProductCard/ProductCard";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllOffersShop } from "../../redux/actions/offer";
import Loader from "../Layout/Loader";
import Ratings from "../Products/Ratings";
import { server, backend_url } from "../../server"; // Import these from your server config
import axios from "axios";
import { AiFillStar } from "react-icons/ai";
import OfferCard from "../Home/Offer/OfferCard";

const ShopProfileData = ({ isOwner }) => {
  const [active, setActive] = useState(1);
  const { products } = useSelector((state) => state.products);
  const { products: offers } = useSelector((state) => state.offers);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [allReviews, setAllReviews] = useState([]);
  const [shopData, setShopData] = useState(null);
  const [shopProductCount, setShopProductCount] = useState(0);
  const [shopTotalReviews, setShopTotalReviews] = useState(0);
  const [shopAverageRating, setShopAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllOffersShop(id));

    // Fetch reviews and shop data
    const fetchShopData = async () => {
      setLoading(true);
      try {
        // Fetch updated shop info
        const shopResponse = await axios.get(
          `${server}/shop/get-shop-info/${id}`
        );

        if (shopResponse.data.success) {
          setShopData(shopResponse.data.shop);
        }

        // Fetch all products for this specific shop to calculate ratings
        const productsResponse = await axios.get(
          `${server}/product/get-all-products-shop/${id}`
        );

        if (productsResponse.data.success) {
          // Count the products
          const productsArray = productsResponse.data.products || [];
          setShopProductCount(productsArray.length);

          // Calculate total shop reviews by summing all product reviews
          let reviewCount = 0;
          let ratingSum = 0;
          let ratingCount = 0;
          let allProductReviews = [];
          const newRatingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

          productsArray.forEach((product) => {
            // Count reviews
            const productReviews = product.reviews ? product.reviews.length : 0;
            reviewCount += productReviews;

            // Collect all reviews for display
            if (product.reviews && product.reviews.length > 0) {
              allProductReviews = [...allProductReviews, ...product.reviews];

              // Sum ratings for average calculation and count by rating value
              product.reviews.forEach((review) => {
                if (review.rating) {
                  ratingSum += review.rating;
                  ratingCount++;

                  // Count ratings by level (1-5)
                  const ratingLevel = Math.round(review.rating);
                  if (ratingLevel >= 1 && ratingLevel <= 5) {
                    newRatingCounts[ratingLevel] += 1;
                  }
                }
              });
            }
          });

          setAllReviews(allProductReviews);
          setShopTotalReviews(reviewCount);
          setRatingCounts(newRatingCounts);

          // Calculate average rating (with 1 decimal place)
          const avgRating =
            ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : 0;
          setShopAverageRating(avgRating);
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [dispatch, id]);

  console.log(
    "Redux state - offers:",
    useSelector((state) => state.offers)
  );

  // Function to get avatar URL (similar to ProductDetails component)
  const getImageUrl = (image) => {
    if (!image) return "/no-image.png";

    // Get the image path, whether from object or string
    const imagePath = typeof image === "object" ? image.url : image;

    // If it's already a full URL
    if (imagePath && imagePath.startsWith("http")) {
      return imagePath;
    }

    // Clean the image path by removing any leading slash or 'uploads/'
    const cleanImagePath = imagePath
      ? imagePath.replace(/^\/?(uploads\/)?/, "")
      : "";
    const baseUrl = backend_url.replace("/api/v2", "").replace(/\/$/, "");

    // Construct the final URL
    return `${baseUrl}/uploads/${cleanImagePath}`;
  };

  // Calculate percentage for ratings bar
  const calculatePercentage = (count) => {
    if (shopTotalReviews === 0) return 0;
    return Math.round((count / shopTotalReviews) * 100);
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full flex">
          <div className="flex items-center" onClick={() => setActive(1)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 1 ? "text-red-800" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Products
            </h5>
          </div>
          <div className="flex items-center" onClick={() => setActive(2)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 2 ? "text-red-800" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Running Events
            </h5>
          </div>

          <div className="flex items-center" onClick={() => setActive(3)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 3 ? "text-red-800" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Reviews
            </h5>
          </div>
        </div>
        <div>
          {isOwner && (
            <div>
              <Link to="/dashboard">
                <div className="bg-gradient-to-r from-gray-900 to-gray-600 text-white font-bold hover:cursor-pointer hover:bg-gradient-to-l hover:from-gray-900 hover:to-gray-600 hover:text-gray-200 duration-300 ease-in-out rounded-lg flex items-center py-3 px-4 justify-center my-6">
                  <span className="text-[#fff]">Dashboard</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <br />
      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
          {products &&
            products.map((i, index) => (
              <ProductCard data={i} key={index} isShop={true} />
            ))}
        </div>
      )}

      {/* {active === 2 && (
        <div className="w-full">
          {loading ? (
            <div className="w-full flex justify-center py-5">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
              {offers && offers.length > 0 ? (
                offers.map((i, index) => (
                  <OfferCard
                    data={i}
                    key={index}
                    isShop={true}
                    isEvent={true}
                  />
                ))
              ) : (
                <div className="w-full flex justify-center items-center bg-gray-50 rounded-lg p-8 mt-4">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-700">
                      No Events Available
                    </h3>
                    <p className="text-gray-500 mt-2">
                      This shop doesn't have any running events at the moment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )} */}

      {active === 2 && (
        <div className="w-full">
          {loading ? (
            <div className="w-full flex justify-center py-5">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-col w-full items-center justify-center gap-4">
              {offers && offers.length > 0 ? (
                <OfferCard offers={offers} active={true} />
              ) : (
                <div className="w-full flex justify-center items-center bg-gray-50 rounded-lg p-8 mt-4">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-700">
                      No Events Available
                    </h3>
                    <p className="text-gray-500 mt-2">
                      This shop doesn't have any running events at the moment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="w-full">
          {loading ? (
            <div className="w-full flex justify-center py-5">
              <Loader />
            </div>
          ) : (
            <>
              {/* Ratings Summary Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex flex-col md:flex-row">
                  {/* Left side - Average rating */}
                  <div className="w-full md:w-1/3 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
                    <div className="text-5xl font-bold text-[#48004f] flex items-center">
                      {shopAverageRating}
                      <AiFillStar className="text-yellow-500 ml-2" size={36} />
                    </div>
                    <div className="text-lg text-gray-600 mt-2">
                      Based on {shopTotalReviews}{" "}
                      {shopTotalReviews === 1 ? "review" : "reviews"}
                    </div>
                  </div>

                  {/* Right side - Rating distribution */}
                  <div className="w-full md:w-2/3 pl-0 md:pl-6 pt-4 md:pt-0">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center mb-2">
                        <div className="text-gray-700 w-8">{star}</div>
                        <AiFillStar className="text-yellow-500 mr-2" />
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-yellow-500 h-2.5 rounded-full"
                            style={{
                              width: `${calculatePercentage(
                                ratingCounts[star]
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-600 w-12 text-right">
                          {ratingCounts[star]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="w-full min-h-[45vh] max-h-[70vh] flex flex-col py-3 items-start overflow-y-auto">
                {allReviews && allReviews.length > 0 ? (
                  allReviews.map((item, index) => (
                    <div
                      key={index}
                      className="w-full flex my-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                    >
                      <img
                        src={getImageUrl(item.user?.avatar)}
                        className="w-[50px] h-[50px] rounded-full object-cover"
                        alt=""
                        onError={(e) => (e.target.src = "/default-avatar.png")}
                        loading="lazy"
                      />
                      <div className="pl-4 flex-1">
                        <div className="flex w-full items-center mb-2">
                          <h1 className="font-medium text-[16px] mr-3 text-[#48004f]">
                            {item.user?.name || "Anonymous User"}
                          </h1>
                          <Ratings rating={item.rating || 0} />
                        </div>
                        <p className="text-gray-700">{item?.comment}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full flex justify-center items-center bg-gray-50 rounded-lg p-8 mt-4">
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-700">
                        No Reviews Yet
                      </h3>
                      <p className="text-gray-500 mt-2">
                        This shop doesn't have any reviews yet.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
