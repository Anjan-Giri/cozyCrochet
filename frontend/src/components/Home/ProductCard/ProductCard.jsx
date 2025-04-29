import React, { useState, useMemo, useEffect } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard.jsx";
import { backend_url } from "../../../server.js";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist.js";
import { addToCart } from "../../../redux/actions/cart.js";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings.jsx";

const ProductCard = ({ data }) => {
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      wishlist &&
      wishlist.items &&
      wishlist?.items.some((i) => i?.product?._id === data?._id)
    ) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data._id]);

  const product_name = data.name.replace(/\s+/g, "-").toLowerCase();

  const imageUrl = useMemo(() => {
    if (!data.images?.[0]?.url) return "/no-image.png";
    if (imageError) return "/no-image.png";

    if (data.images[0].url.startsWith("http")) {
      return data.images[0].url;
    }

    const baseUrl = backend_url.replace("/api/v2", "").replace(/\/$/, "");

    const imagePath = data.images[0].url.replace(/^\/?(uploads\/)?/, "");

    return `${baseUrl}/uploads/${imagePath}`;
  }, [data.images, imageError]);

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
  const addToWishlistHandler = (data) => {
    setClick(!click);

    dispatch(addToWishlist(data));
  };
  const removeFromWishlistHandler = (data) => {
    setClick(!click);

    dispatch(removeFromWishlist(data));
  };

  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <div className="flex justify-end"></div>
        {/* Product Image Link */}
        <Link to={`/product/${product_name}`}>
          <img
            src={imageUrl}
            alt={data.name}
            className="w-full h-[160px] object-contain"
            onError={(e) => {
              setImageError(true);
              e.target.src = "/no-image.png";
            }}
            loading="lazy"
          />
        </Link>
        {/* Shop Preview Link */}
        <Link to={`/shop-preview/${data.shop?._id}`}>
          <h5 className="pt-3 text-[13px] text-[#b10012] pb-2">
            {data.shop?.name}
          </h5>
        </Link>
        {/* Product Details Link */}
        <Link to={`/product/${product_name}`}>
          <h4 className="pb-3 font-[500] text-[#690071]">
            {data.name.length > 35 ? data.name.slice(0, 35) + "..." : data.name}
          </h4>

          <div className="flex py-2">
            <Ratings rating={data?.ratings} />
          </div>

          <div className="pt-3 pb-2 flex items-center justify-between">
            <div className="flex">
              <h5 className="font-bold text-[18px] text-[#690071] font-Roboto">
                Nrs {data.discountPrice || data.originalPrice}
              </h5>
              <h4 className="font-[500] text-[13px] text-[#b03722] pl-3 mt-[-6px] line-through">
                {data.discountPrice ? `${data.originalPrice} Nrs` : null}
              </h4>
            </div>
            <span className="font-[400] text-[15px] text-[#9b1a52]">
              {data.sold_out} sold
            </span>
          </div>
        </Link>

        <div>
          {click ? (
            <AiFillHeart
              size={25}
              className="cursor-pointer absolute right-[10px] top-[10px]"
              onClick={() => removeFromWishlistHandler(data)}
              color={click ? "red" : "#333"}
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={25}
              className="cursor-pointer absolute right-[10px] top-[10px]"
              onClick={() => addToWishlistHandler(data)}
              color={click ? "red" : "#333"}
              title="Add to wishlist"
            />
          )}
          <AiOutlineEye
            size={25}
            className="cursor-pointer absolute right-[10px] top-[40px]"
            onClick={() => setOpen(!open)}
            color="#333"
            title="View"
          />
          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-[10px] top-[70px]"
            onClick={() => addToCartHandler(data._id)}
            color="#444"
            title="Add to cart"
          />
          {open ? (
            <ProductDetailsCard open={open} setOpen={setOpen} data={data} />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
