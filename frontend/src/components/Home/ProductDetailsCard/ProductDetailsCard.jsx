import React, { useState, useMemo, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_url } from "../../../server";
import { FaShop } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";

const ProductDetailsCard = ({ setOpen, data }) => {
  const [click, setClick] = useState(false);
  const [count, setCount] = useState(1);
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

  // Memoize the image URL following the pattern from ShopInfo component
  const getImageUrl = (image) => {
    if (!image) return "/no-image.png";

    // If image is already a full URL
    if (
      typeof image === "string" &&
      (image.startsWith("http://") || image.startsWith("https://"))
    ) {
      return image;
    }

    // If image is an object with url property
    const imagePath = typeof image === "object" ? image.url : image;

    // Remove any leading slashes and 'uploads/'
    const cleanPath = imagePath.replace(/^\/?(uploads\/)?/, "");

    // Construct the full URL using the backend_url
    return `${backend_url}uploads/${cleanPath}`;
  };

  // Get the product image URL
  const productImageUrl = useMemo(() => {
    if (imageError) return "/no-image.png";

    // Check which property contains the image data
    if (data.image_Url && data.image_Url[0]) {
      return getImageUrl(data.image_Url[0].url);
    } else if (data.images && data.images[0]) {
      return getImageUrl(data.images[0].url);
    }
    return "/no-image.png";
  }, [data, imageError]);

  // Get the shop avatar URL
  const shopAvatarUrl = useMemo(() => {
    if (!data.shop) return "/default-avatar.png";

    // Check which property contains the avatar data
    if (data.shop.shop_avatar) {
      return getImageUrl(data.shop.shop_avatar.url);
    } else if (data.shop.avatar) {
      return getImageUrl(data.shop.avatar);
    }
    return "/default-avatar.png";
  }, [data.shop]);

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

  return (
    <div className="bg-[#fff]">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50"
              onClick={() => setOpen(false)}
            />

            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%] pt-4">
                <img
                  src={productImageUrl}
                  alt={data.name || "Product"}
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    setImageError(true);
                    e.target.src = "/no-image.png";
                  }}
                  loading="lazy"
                />
                <div className="flex items-center pt-4">
                  <img
                    src={shopAvatarUrl}
                    alt={data.shop?.name || "Shop"}
                    className="w-[50px] h-[50px] rounded-full mr-2 object-cover"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                    loading="lazy"
                  />
                  <div>
                    <h3 className="pt-3 text-[15px] pb-3 text-[#b10012]">
                      {data.shop?.name || "Shop"}
                    </h3>
                    <h5 className="pb-2 text-[15px]">
                      ({data.shop?.ratings || "No ratings"}) Rating
                    </h5>
                  </div>
                </div>
                <Link to={`/shop-preview/${data.shop._id}`}>
                  <div
                    className={`${styles.button} mt-4 rounded-[4px] h-11 flex items-center`}
                  >
                    <span className="text-[#fff] flex items-center">
                      Visit Shop <FaShop className="ml-2" />
                    </span>
                  </div>
                </Link>
                <h5 className="text-[16px] text-red-700 pt-1">
                  {data.total_sell || data.sold_out || 0} SOLD OUT
                </h5>
              </div>

              <div className="w-full 800px:w-[50%] py-4 pl-[40px] pr-[20px]">
                <h1 className="text-[25px] font-[600] font-Roboto text-[#48004f]">
                  {data.name || "Product Name"}
                </h1>
                <p className="pt-4">
                  {data.description || "No description available"}
                </p>

                <div className="flex pt-6">
                  <h4 className="font-bold text-[18px] text-[#4c0064] font-Roboto">
                    {data.discount_price ||
                      data.discountPrice ||
                      data.price ||
                      data.originalPrice ||
                      0}{" "}
                    Nrs
                  </h4>
                  {(data.price || data.originalPrice) &&
                    (data.discount_price || data.discountPrice) && (
                      <h3 className="font-[500] text-[13px] text-[#b03722] pl-3 mt-[2px] line-through">
                        {data.price || data.originalPrice} Nrs
                      </h3>
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
                  className={`${styles.button} mt-8 rounded-[4px] h-11 flex items-center`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-[#fff] flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
