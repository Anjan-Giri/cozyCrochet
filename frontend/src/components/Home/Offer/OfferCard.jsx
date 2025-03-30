import React, { useMemo } from "react";
import Timer from "./Timer.jsx";
import { backend_url } from "../../../server.js"; // Make sure this path is correct
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../../redux/actions/cart.js";

const OfferCard = ({ offers, active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const getBestOffer = () => {
    if (!offers || offers.length === 0) return null;

    const currentDate = new Date();
    const activeOffers = offers.filter((offer) => {
      return offer.endDate && new Date(offer.endDate) > currentDate;
    });

    if (activeOffers.length === 0) return null;

    return activeOffers.reduce((best, current) => {
      const currentDiscount =
        ((current.originalPrice - current.discountPrice) /
          current.originalPrice) *
        100;
      const bestDiscount = best
        ? ((best.originalPrice - best.discountPrice) / best.originalPrice) * 100
        : 0;
      return currentDiscount > bestDiscount ? current : best;
    }, null);
  };

  const bestOffer = getBestOffer();

  const imageUrl = useMemo(() => {
    if (!bestOffer?.images?.[0]?.url) {
      return "https://images.pexels.com/photos/7127868/pexels-photo-7127868.jpeg";
    }

    if (bestOffer.images[0].url.startsWith("http")) {
      return bestOffer.images[0].url;
    }

    const baseUrl = backend_url.replace("/api/v2", "").replace(/\/$/, "");

    const imagePath = bestOffer.images[0].url.replace(/^\/?(uploads\/)?/, "");

    return `${baseUrl}/uploads/${imagePath}`;
  }, [bestOffer?.images]);

  if (!bestOffer) return null;

  const discountPercentage = Math.round(
    ((bestOffer.originalPrice - bestOffer.discountPrice) /
      bestOffer.originalPrice) *
      100
  );

  // const addToCartHandler = (data) => {
  //   const isItemExists = cart?.items.find((i) => i._id === data._id);
  //   if (isItemExists) {
  //     toast.error("Item already in cart!");
  //   } else {
  //     if (data.stock < 1) {
  //       toast.error("Product stock limited!");
  //     } else {
  //       const cartData = { ...data, qty: 1 };
  //       dispatch(addToCart(cartData));
  //       toast.success("Item added to cart successfully!");
  //     }
  //   }
  // };

  return (
    <div
      className={`w-full block bg-[#e3cdb6] rounded-lg ${
        active ? "unset" : "mb-12"
      } lg:flex p-2 border-b-orange-200 border-2`}
    >
      <div className="w-full lg:w-[50%] m-auto py-4">
        <div className="w-full h-80 md:h-96 lg:h-[400px] rounded-md flex items-center justify-center ">
          <img
            src={imageUrl}
            alt={bestOffer.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-4 pb-4 mr-16">
        <div className="bg-red-500 text-white px-2 py-1 rounded-full w-fit mb-2">
          {discountPercentage}% OFF
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-[25px] font-semibold font-Roboto text-[#48004f]">
            {bestOffer.name}
          </h2>
          {/* <AiOutlineShoppingCart
            className="text-[25px] text-[#48004f] cursor-pointer"
            onClick={addToCartHandler}
          /> */}
        </div>
        <p className="pt-6 text-[15px] font-Roboto">{bestOffer.description}</p>
        <div className="flex pb-6 pt-10 justify-between">
          <div className="flex">
            <h5 className="font-bold text-[20px] text-[#5d0675] font-Roboto">
              Nrs {bestOffer.discountPrice.toLocaleString()}
            </h5>
            <h5 className="font-semibold text-[15px] text-[#b55252] pl-3 line-through">
              Nrs {bestOffer.originalPrice.toLocaleString()}
            </h5>
          </div>
          <span className="pr-3 font-semibold text-[17px] text-[#00392e]">
            {bestOffer.sold_out} sold
          </span>
        </div>
        <Timer endDate={bestOffer.endDate} />
      </div>
    </div>
  );
};

export default OfferCard;
