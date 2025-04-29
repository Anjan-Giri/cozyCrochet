import React, { useState, useMemo, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_url, server } from "../../../server";
import { FaShop } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import axios from "axios";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";

const ProductDetailsCard = ({ setOpen, data }) => {
  const [click, setClick] = useState(false);
  const [count, setCount] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [shopData, setShopData] = useState(null);
  const [shopProductCount, setShopProductCount] = useState(0);
  const [shopTotalReviews, setShopTotalReviews] = useState(0);
  const [shopAverageRating, setShopAverageRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const getImageUrl = useMemo(
    () => (image) => {
      if (!image) return "/no-image.png";

      const imagePath = typeof image === "object" ? image.url : image;

      if (imagePath && imagePath.startsWith("http")) {
        return imagePath;
      }

      const cleanImagePath = imagePath
        ? imagePath.replace(/^\/?(uploads\/)?/, "")
        : "";
      const baseUrl = backend_url.replace("/api/v2", "").replace(/\/$/, "");

      return `${baseUrl}/uploads/${cleanImagePath}`;
    },
    [imageError]
  );

  const productImageUrl = useMemo(() => {
    if (imageError) return "/no-image.png";

    if (data.images && data.images[0]) {
      return getImageUrl(data.images[0]);
    } else if (data.image_Url && data.image_Url[0]) {
      return getImageUrl(data.image_Url[0].url);
    }
    return "/no-image.png";
  }, [data, imageError, getImageUrl]);

  const getShopAvatarUrl = (avatar) => {
    if (!avatar) return "/default-avatar.png";

    if (
      typeof avatar === "string" &&
      (avatar.startsWith("http://") || avatar.startsWith("https://"))
    ) {
      return avatar;
    }

    const avatarPath = typeof avatar === "object" ? avatar.url : avatar;

    if (!avatarPath) return "/default-avatar.png";

    const cleanPath = avatarPath.replace(/^\/?(uploads\/)?/, "");

    const baseUrl = backend_url.replace("/api/v2", "").replace(/\/$/, "");

    return `${baseUrl}/uploads/${cleanPath}`;
  };

  const addToCartHandler = (id) => {
    const itemExists = cart?.items
      ? cart.items.some((i) => i.product._id === id)
      : false;

    if (itemExists) {
      toast.error("Item already in cart");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limit reached");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addToCart(cartData));
      }
    }
  };

  useEffect(() => {
    if (
      wishlist &&
      wishlist.items &&
      wishlist.items.some((i) => i?.product?._id === data?._id)
    ) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data._id]);

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  //fetch shop data and calculate ratings
  useEffect(() => {
    const fetchShopData = async () => {
      if (data?.shop?._id) {
        try {
          setLoading(true);

          const shopResponse = await axios.get(
            `${server}/shop/get-shop-info/${data.shop._id}`
          );

          if (shopResponse.data.success) {
            setShopData(shopResponse.data.shop);
          }

          const productsResponse = await axios.get(
            `${server}/product/get-all-products-shop/${data.shop._id}`
          );

          if (productsResponse.data.success) {
            const productsArray = productsResponse.data.products || [];
            setShopProductCount(productsArray.length);

            let reviewCount = 0;
            let ratingSum = 0;
            let ratingCount = 0;

            productsArray.forEach((product) => {
              const productReviews = product.reviews
                ? product.reviews.length
                : 0;
              reviewCount += productReviews;

              if (product.reviews && product.reviews.length > 0) {
                product.reviews.forEach((review) => {
                  if (review.rating) {
                    ratingSum += review.rating;
                    ratingCount++;
                  }
                });
              }
            });

            setShopTotalReviews(reviewCount);

            const avgRating =
              ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : 0;
            setShopAverageRating(avgRating);
          }
        } catch (error) {
          console.error("Error fetching shop data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchShopData();
  }, [data?.shop?._id]);

  return (
    <div className="bg-[#fff]">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50 cursor-pointer hover:text-gray-700"
              onClick={() => setOpen(false)}
            />

            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%] pt-4">
                <img
                  src={productImageUrl}
                  alt={data.name || "Product"}
                  className="w-[70%] h-auto object-contain m-auto"
                  onError={(e) => {
                    setImageError(true);
                    e.target.src = "/no-image.png";
                  }}
                  loading="lazy"
                />
                <div className="flex items-center mt-8 border-t pt-4">
                  <Link to={`/shop-preview/${data.shop._id}`}>
                    <img
                      src={getShopAvatarUrl(
                        shopData?.avatar || data.shop?.avatar
                      )}
                      alt={data.shop?.name || "Shop"}
                      className="w-[70px] h-[70px] rounded-full mr-4 object-cover"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                      loading="lazy"
                    />
                  </Link>
                  <div>
                    <Link to={`/shop-preview/${data.shop._id}`}>
                      <h3 className="text-[16px] font-medium text-[#b10012]">
                        {shopData?.name || data.shop?.name || "Shop"}
                      </h3>
                    </Link>
                    <div className="flex items-center">
                      <span className="text-[14px] mr-1">
                        {loading ? "Loading..." : shopAverageRating} ★
                      </span>
                      <span className="text-[13px]">
                        ({shopTotalReviews}{" "}
                        {shopTotalReviews === 1 ? "Rating" : "Ratings"})
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-[13px] text-gray-600">
                        {shopProductCount} Products
                      </span>
                    </div>
                  </div>
                </div>
                <Link to={`/shop-preview/${data.shop._id}`}>
                  <div className="bg-gradient-to-r from-gray-900 to-gray-600 text-white font-bold hover:cursor-pointer hover:bg-gradient-to-l hover:from-gray-900 hover:to-gray-600 hover:text-gray-200 duration-300 ease-in-out rounded-lg flex items-center py-3 px-4 justify-center mt-4">
                    <span className="flex items-center justify-center">
                      Visit Shop <FaShop className="ml-2" />
                    </span>
                  </div>
                </Link>
                {data.total_sell || data.sold_out ? (
                  <h5 className="text-[16px] text-red-700 mt-4 font-medium">
                    {data.total_sell || data.sold_out || 0} SOLD OUT
                  </h5>
                ) : null}
              </div>

              <div className="w-full 800px:w-[50%] py-4 pl-[5px] 800px:pl-[40px] pr-[5px] 800px:pr-[20px]">
                <h1 className="text-[25px] font-[600] font-Roboto text-[#48004f]">
                  {data.name || "Product Name"}
                </h1>
                <p className="pt-4 whitespace-pre-line">
                  {data.description || "No description available"}
                </p>

                <div className="flex pt-6 items-center">
                  <h2 className="font-bold text-[18px] text-[#8e0000] font-Roboto">
                    Nrs{" "}
                    {data.discountPrice ||
                      data.discount_price ||
                      data.price ||
                      data.originalPrice ||
                      0}
                  </h2>
                  {(data.discountPrice || data.discount_price) &&
                    (data.originalPrice || data.price) && (
                      <h4 className="font-[500] text-[14px] text-[#e32e0e] pl-3 mt-[-18px] line-through">
                        Nrs {data.originalPrice || data.price}
                      </h4>
                    )}
                </div>

                <div className="flex items-center mt-8 justify-between pr-3">
                  <div>
                    <button
                      className="bg-gradient-to-r from-gray-800 to-gray-500 text-white font-bold rounded-l-md px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[9px]">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-gray-500 to-gray-800 text-white font-bold rounded-r-md px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>

                <div
                  className="bg-gradient-to-r from-gray-800 to-gray-500 text-white font-bold shadow-lg hover:cursor-pointer hover:bg-gradient-to-l hover:from-gray-800 hover:to-gray-500 hover:text-gray-200 duration-300 ease-in-out mt-10 rounded flex items-center py-3 justify-center"
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="flex items-center justify-center">
                    Add to Cart <AiOutlineShoppingCart className="ml-2" />
                  </span>
                </div>

                {data.stock < 10 && (
                  <div className="mt-4 text-orange-600 font-medium">
                    Only {data.stock} items left in stock!
                  </div>
                )}

                {data.category && (
                  <div className="mt-4">
                    <span className="font-medium">Category: </span>
                    <span className="text-[#48004f]">{data.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
