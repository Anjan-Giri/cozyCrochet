import React, { useMemo, useState } from "react";

import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { backend_url } from "../../server";
import { addToCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = (data) => {
    const itemExists = cart?.items
      ? cart.items.some((i) => i.product._id === data._id)
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

  // Safely get wishlist items
  const wishlistItems = wishlist && wishlist.items ? wishlist.items : [];

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-[#0000004b] z-50">
      <div className="fixed top-0 right-0 h-screen w-[90%] sm:w-[60%] md:w-[40%] lg:w-[40%] bg-gray-100 flex flex-col justify-between shadow-sm z-20 overflow-hidden">
        {wishlistItems.length === 0 ? (
          <>
            <div>
              <div className="flex w-full pt-6 pl-6 pb-4 pr-3 justify-between">
                <h2 className="text-2xl text-[#d21e1e] font-bold">
                  My Wishlist
                </h2>
                <RxCross1
                  size={30}
                  className="cursor-pointer"
                  onClick={() => setOpenWishlist(false)}
                />
              </div>
              <div className="flex items-center p-4 sm:p-6">
                <AiOutlineHeart size={24} />
                <h3 className="pl-4 text-[15px] sm:text-[17px] font-semibold">
                  0 Items
                </h3>
              </div>
              <div className="flex items-center sm:p-6 justify-center text-[25px] sm:text-[35px] font-semibold text-red-800">
                No Items in Wishlist!!
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full overflow-y-scroll">
            <div className="flex w-full pt-6 pl-6 pb-4 pr-3 justify-between">
              <h2 className="text-2xl text-[#d21e1e] font-bold">My Wishlist</h2>
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpenWishlist(false)}
              />
            </div>

            <div className="flex items-center p-6">
              <AiFillHeart size={28} fill="red" />
              <h3 className="pl-4 text-[17px] font-semibold text-[#9a0000]">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "Item" : "Items"}
              </h3>
            </div>

            <div className="w-full border-t flex-1">
              {wishlistItems.map((i, index) => (
                <CartOne
                  key={index}
                  data={i.product}
                  removeFromWishlistHandler={removeFromWishlistHandler}
                  addToCartHandler={addToCartHandler}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CartOne = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  const [val, setVal] = useState(1);
  const totalPrice = data.discountPrice * val;
  const [imageError, setImageError] = useState(false);

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

  return (
    <div className="flex items-center justify-between p-5 py-6 border-b">
      <div className="w-full flex items-center relative">
        <img
          src={imageUrl}
          alt="product"
          className="w-[90px] h-[90px] ml-4"
          onError={(e) => {
            setImageError(true);
            e.target.src = "/no-image.png";
          }}
          loading="lazy"
        />

        <div className="px-4">
          <h3 className="text-[18px] font-semibold text-[#440052]">
            {data.name}
          </h3>
          <h6 className="text-[15px] text-[#900000] font-semibold font-Roboto">
            Nrs {totalPrice}
          </h6>
        </div>
        <div className="absolute flex items-center flex-col right-3 gap-4">
          <RxCross1
            size={10}
            className="cursor-pointer font-bold"
            onClick={() => removeFromWishlistHandler(data)}
            title="remove"
            color="red"
          />

          <BsCartPlus
            size={20}
            className="cursor-pointer"
            onClick={() => addToCartHandler(data)}
            title="add to cart"
            color="purple"
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
