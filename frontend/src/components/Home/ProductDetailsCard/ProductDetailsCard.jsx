import React, { useState } from "react";

import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";

const ProductDetailsCard = ({ setOpen, data }) => {
  const [click, setClick] = useState(false);
  //   const [select, setSelect] = useState(false);
  const [count, setCount] = useState(1);

  const handleMessageSubmit = () => {};

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
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
                <img src={data.image_Url[0].url} alt="product" />
                <div className="flex items-center pt-4">
                  <img
                    src={data.shop.shop_avatar.url}
                    alt="shop"
                    className="w-[50px] h-[50px] rounded-full mr-2"
                  />
                  <div>
                    <h3 className="pt-3 text-[15px] pb-3 text-[#b10012]">
                      {data.shop.name}
                    </h3>
                    <h5 className="pb-2 text-[15px]">
                      ({data.shop.ratings}) Rating
                    </h5>
                  </div>
                </div>
                <div
                  className={`${styles.button} mt-4 rounded-[4px] h-11 flex items-center`}
                  onClick={handleMessageSubmit}
                >
                  <span className="text-[#fff] flex items-center">
                    Send Message <AiOutlineMessage className="ml-2" />{" "}
                  </span>
                </div>
                <h5 className="text-[16px] text-red-700 pt-1">
                  {data.total_sell} SOLD OUT
                </h5>
              </div>

              <div className="w-full 800px:w-[50%] py-4 pl-[40px] pr-[20px]">
                <h1 className="text-[25px] font-[600] font-Roboto text-[#48004f]">
                  {data.name}
                </h1>
                <p className="pt-4">{data.description}</p>

                <div className="flex pt-6">
                  <h4 className="font-bold text-[18px] text-[#4c0064] font-Roboto">
                    {data.discount_price} Nrs
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {"Nrs " + data.price ? data.price : null}
                  </h3>
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
                        onClick={() => setClick(!click)}
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => setClick(!click)}
                        color={click ? "red" : "#333"}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} mt-8 rounded-[4px] h-11 flex items-center`}
                  //   onClick={() => addToCartHandler(data._id)}
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
