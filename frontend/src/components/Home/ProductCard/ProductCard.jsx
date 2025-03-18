import React, { useState, useMemo } from "react";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard.jsx";
import { backend_url } from "../../../server.js";
import { useSelector } from "react-redux";

const ProductCard = ({ data }) => {
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { cart } = useSelector((state) => state.cart);

  // Create URL-friendly product name
  const product_name = data.name.replace(/\s+/g, "-").toLowerCase();

  // Memoize the image URL to prevent recalculation on re-renders
  const imageUrl = useMemo(() => {
    if (!data.images?.[0]?.url) return "/no-image.png";
    if (imageError) return "/no-image.png";

    // If it's already a full URL
    if (data.images[0].url.startsWith("http")) {
      return data.images[0].url;
    }

    // Remove /api/v2 if present in backend_url
    const baseUrl = backend_url.replace("/api/v2", "").replace(/\/$/, "");

    // Clean the image path
    const imagePath = data.images[0].url.replace(/^\/?(uploads\/)?/, "");

    // Construct the final URL
    return `${baseUrl}/uploads/${imagePath}`;
  }, [data.images, imageError]);

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
            <AiFillStar className="mr-2 cursor pointer" color="#F6BA00" />
            <AiFillStar className="mr-2 cursor pointer" color="#F6BA00" />
            <AiFillStar className="mr-2 cursor pointer" color="#F6BA00" />
            <AiFillStar className="mr-2 cursor pointer" color="#F6BA00" />
            <AiOutlineStar className="mr-2 cursor pointer" color="#F6BA00" />
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
              onClick={() => setClick(!click)}
              color={click ? "red" : "#333"}
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={25}
              className="cursor-pointer absolute right-[10px] top-[10px]"
              onClick={() => setClick(!click)}
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
            onClick={() => setOpen(!open)}
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
