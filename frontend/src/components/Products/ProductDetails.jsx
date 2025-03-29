import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { backend_url, server } from "../../server";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import Loader from "../Layout/Loader";
import { FaShop } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import axios from "axios";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";

const ProductDetails = ({ data }) => {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const [imageError, setImageError] = useState(false);

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

  const getImageUrl = React.useMemo(
    () => (image) => {
      if (!image) return "/no-image.png";

      // Get the image path, whether from object or string
      const imagePath = typeof image === "object" ? image.url : image;

      // If it's already a full URL
      if (imagePath.startsWith("http")) {
        return imagePath;
      }

      // Remove /api/v2 if present in backend_url and ensure no trailing slash
      const baseUrl = backend_url.replace("/api/v2", "").replace(/\/$/, "");

      // Clean the image path by removing any leading slash or 'uploads/'
      const cleanImagePath = imagePath.replace(/^\/?(uploads\/)?/, "");

      // Construct the final URL
      return `${baseUrl}/uploads/${cleanImagePath}`;
    },
    [imageError]
  );

  const addToCartHandler = (id) => {
    // Check if cart items exist and is an array
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
    // Change from wishlist.find to checking if wishlist exists and has items
    if (
      wishlist &&
      wishlist.items &&
      wishlist.items.some((i) => i.product._id === data._id)
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

  if (!data) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
        <div className="w-full py-8">
          <div className="block w-full 800px:flex">
            <div className="w-full 800px:w-[50%]">
              <img
                src={data.images && getImageUrl(data.images[select])}
                className="w-[70%] m-auto mb-6"
                alt={data.name}
                onError={() => setImageError(true)}
                loading="lazy"
              />
              <div className="w-full flex gap-6">
                {data.images &&
                  data.images.map((image, index) => (
                    <div
                      key={index}
                      className={`${
                        select === index ? "border" : "null"
                      } cursor-pointer`}
                    >
                      <img
                        src={getImageUrl(image)}
                        className="h-[170px] w-[240px]"
                        onClick={() => setSelect(index)}
                        alt={`${data.name} - view ${index + 1}`}
                        onError={() => setImageError(true)}
                        loading="lazy"
                      />
                    </div>
                  ))}
              </div>
            </div>
            <div className="w-full 800px:w-[50%] pl-12 pr-8 pt-4">
              <h3 className="text-[25px] font-[600] font-Roboto text-[#48004f]">
                {data.name}
              </h3>
              <p className="pt-4">{data.description}</p>
              <div className="flex pt-6 items-center">
                <h2 className="font-bold text-[18px] text-[#8e0000] font-Roboto">
                  Nrs {data.discountPrice || data.originalPrice}
                </h2>
                {data.discountPrice && (
                  <h4 className="font-[500] text-[14px] text-[#e32e0e] pl-3 mt-[-18px] line-through">
                    Nrs {data.originalPrice}
                  </h4>
                )}
              </div>
              {/* Counter and Wishlist */}
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
              {/* Add to Cart Button */}
              <div
                className={`bg-gradient-to-r from-gray-800 to-gray-500 text-white font-bold shadow-lg hover:cursor-pointer hover:bg-gradient-to-l hover:from-gray-800 hover:to-gray-500 hover:text-gray-200 duration-300 ease-in-out mt-10 rounded flex items-center py-3 justify-center`}
                onClick={() => addToCartHandler(data._id)}
              >
                <span className="flex items-center justify-center">
                  Add to Cart <AiOutlineShoppingCart className="ml-2" />
                </span>
              </div>
              {/* Shop Info */}
              <div className="flex items-center pt-10">
                <Link to={`/shop-preview/${data.shop._id}`}>
                  <img
                    src={getImageUrl(data.shop?.avatar)}
                    alt="shop avatar"
                    className="w-[70px] h-[70px] rounded-full mr-4"
                    onError={() => setImageError(true)}
                    loading="lazy"
                  />
                </Link>
                <div className="pr-8">
                  <Link to={`/shop-preview/${data.shop._id}`}>
                    <h1 className="pt-3 text-[15px] pb-1 text-[#b10012]">
                      {data.shop?.name}
                    </h1>
                  </Link>
                  <h2 className="pb-2 text-[13px]">
                    ({data.shop?.ratings || 0}) Ratings
                  </h2>
                </div>
                <Link to={`/shop-preview/${data.shop._id}`}>
                  <div className="bg-gradient-to-r from-gray-900 to-gray-600 text-white font-bold hover:cursor-pointer hover:bg-gradient-to-l hover:from-gray-900 hover:to-gray-600 hover:text-gray-200 duration-300 ease-in-out rounded-lg flex items-center py-3 px-4 justify-center">
                    <span className="flex items-center justify-center">
                      Visit Now <FaShop className="ml-2" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <ProductInfo data={data} getImageUrl={getImageUrl} />
      </div>
    </div>
  );
};

const ProductInfo = ({ data, getImageUrl }) => {
  const [active, setActive] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [shopProductCount, setShopProductCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShopProductCount = async () => {
      if (active === 3 && data?.shop?._id) {
        try {
          setLoading(true);

          // Fetch all products for this specific shop
          const response = await axios.get(
            `${server}/product/get-all-products-shop/${data.shop._id}`
          );

          if (response.data.success) {
            // Count the products manually
            const productsArray = response.data.products || [];
            setShopProductCount(productsArray.length);
          }
        } catch (error) {
          console.error("Error fetching shop products:", error);
          setShopProductCount(0);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchShopProductCount();
  }, [active, data?.shop?._id]);

  return (
    <div className="py-6">
      <div className="bg-gray-200 min-h-[55vh] px-5 800px:px-12 rounded">
        <div className="flex items-center justify-between w-full border-b pt-12 pb-8">
          <div className="relative">
            <h1
              className="text-[#440049] text-[18px] px-4 leading-5 font-semibold cursor-pointer 800px:[23px] hover:scale-105 duration-200"
              onClick={() => setActive(1)}
            >
              Details
            </h1>
            {active === 1 && (
              <div className="absolute bottom-[-27%] left-0 h-[3px] w-full bg-[#781125]"></div>
            )}
          </div>
          <div className="relative">
            <h1
              className="text-[#440049] text-[18px] px-4 leading-5 font-semibold cursor-pointer 800px:[23px] hover:scale-105 duration-200"
              onClick={() => setActive(2)}
            >
              Reviews
            </h1>
            {active === 2 && (
              <div className="absolute bottom-[-27%] left-0 h-[3px] w-full bg-[#781125]"></div>
            )}
          </div>
          <div className="relative">
            <h1
              className="text-[#440049] text-[18px] px-4 leading-5 font-semibold cursor-pointer 800px:[23px] hover:scale-105 duration-200"
              onClick={() => setActive(3)}
            >
              Seller
            </h1>
            {active === 3 && (
              <div className="absolute bottom-[-27%] left-0 h-[3px] w-full bg-[#781125]"></div>
            )}
          </div>
        </div>

        {active === 1 && (
          <div className="py-4">
            <p className="font-Roboto text-[15px] pb-2">{data.description}</p>
          </div>
        )}

        {active === 2 && (
          <div className="w-full justify-center min-h-[45vh] flex items-center">
            <p>No Reviews Yet</p>
          </div>
        )}

        {active === 3 && (
          <div className="w-full block 800px:flex p-4">
            <div className="w-full 800px:w-[50%]">
              <div className="flex items-center">
                <Link to={`/shop-preview/${data.shop._id}`}>
                  <img
                    src={getImageUrl(data.shop?.avatar)}
                    alt="shop avatar"
                    className="w-[80px] h-[80px] rounded-full"
                    onError={() => setImageError(true)}
                    loading="lazy"
                  />
                </Link>

                <div className="px-4">
                  <Link to={`/shop-preview/${data.shop._id}`}>
                    <h3 className="pt-2 text-[18px] pb-1 text-[#b10012]">
                      {data.shop?.name}
                    </h3>
                  </Link>
                  <h5 className="pb-2 text-[14px]">
                    ({data.shop?.ratings || 0}) Ratings
                  </h5>
                </div>
              </div>
              <p className="pt-4 font-Roboto text-[15px]">
                {data.shop?.description || "No shop description available"}
              </p>
            </div>
            <div className="w-full 800px:w-[50%] mt-6 800px:mt-0 800px: flex flex-col items-end">
              <div className="text-left">
                <h1 className="font-semibold text-[#480043]">
                  Joined:{" "}
                  <span className="font-medium text-[#530000] pl-2">
                    {data.shop?.createdAt
                      ? new Date(data.shop.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </h1>
                <h1 className="font-semibold pt-4 text-[#480043]">
                  Total Products:
                  <span className="font-medium text-[#530000] pl-2">
                    {/* {(products && products.length) || 0} */}{" "}
                    {loading ? "Loading..." : shopProductCount}
                  </span>
                </h1>
                <h1 className="font-semibold pt-4 text-[#480043]">
                  Total Reviews:{" "}
                  <span className="font-medium text-[#530000] pl-2">
                    {data.shop?.totalReviews || 0}
                  </span>
                </h1>
                <Link to={`/shop-preview/${data.shop?._id}`}>
                  <div className="bg-gradient-to-r from-gray-900 to-gray-600 text-white font-bold hover:cursor-pointer hover:bg-gradient-to-l hover:from-gray-900 hover:to-gray-600 hover:text-gray-200 duration-300 ease-in-out rounded-lg flex items-center py-3 px-4 justify-center my-6">
                    <span className="flex items-center justify-center">
                      Visit Shop
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
