import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { backend_url } from "../../server";
import { addToCart, removeFromCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = (data) => {
    dispatch(addToCart(data));
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-[#0000004b] z-10 flex items-center justify-center">
      <div className="fixed top-0 right-0 min-h-screen w-[90%] sm:w-[60%] md:w-[40%] lg:w-[40%] bg-gray-100 flex flex-col justify-between shadow-sm z-20 overflow-y-scroll">
        {cart && cart.length === 0 ? (
          <div>
            <div className="flex w-full pt-6 pl-6 pb-4 pr-3 justify-between">
              <h2 className="text-2xl text-[#d21e1e] font-bold">My Cart</h2>
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <div className="flex items-center p-4 sm:p-6">
              <IoBagHandleOutline size={24} />
              <h3 className="pl-4 text-[15px] sm:text-[17px] font-semibold">
                0 Items
              </h3>
            </div>
            <div className="flex items-center sm:p-6 justify-center text-[25px] sm:text-[35px] font-semibold text-red-800">
              No Items in Cart!!
            </div>
          </div>
        ) : (
          <div className="overflow-y-scroll h-[85vh]">
            <div className="flex w-full pt-6 pl-6 pb-4 pr-3 justify-between">
              <h2 className="text-xl sm:text-2xl text-[#320040] font-bold">
                My Cart
              </h2>
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>

            <div className="flex items-center p-4 sm:p-6">
              <IoBagHandleOutline size={24} />
              <h3 className="pl-4 text-[15px] sm:text-[17px] font-semibold">
                {cart && cart.length}{" "}
                {cart && cart.length === 1 ? "Item" : "Items"}
              </h3>
            </div>

            <div className="w-full border-t">
              {cart &&
                cart.map((i, index) => (
                  <CartOne
                    key={index}
                    data={i}
                    quantityChangeHandler={quantityChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
            </div>
          </div>
        )}

        <div className="mb-3 px-1">
          <Link to="/checkout">
            <div className="w-full flex items-center justify-center py-2 px-6 sm:py-1 sm:px-8 bg-[#ffffff] border-2 border-black text-black font-semibold rounded-md hover:bg-[#333] hover:text-white duration-300">
              CHECKOUT (Nrs {totalPrice})
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

const CartOne = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [val, setVal] = useState(data.qty);
  const totalPrice = data.discountPrice * val;

  const increment = (data) => {
    if (data.stock < val) {
      toast.error("Product stock limit reached");
    } else {
      setVal(val + 1);
      const updateCartData = { ...data, qty: val + 1 };
      quantityChangeHandler(updateCartData);
    }
  };

  const decrement = (data) => {
    setVal(val === 1 ? 1 : val - 1);
    const updateCartData = { ...data, qty: val === 1 ? 1 : val - 1 };
    quantityChangeHandler(updateCartData);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 py-4 sm:py-6 border-b">
      <div className="w-full flex flex-row items-center">
        <div className="flex flex-col items-center sm:items-start">
          <div
            className="bg-[#027e00] border border-[#00000073] rounded-full w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] flex items-center justify-center cursor-pointer hover:scale-105 duration-300"
            onClick={() => increment(data)}
          >
            <HiPlus size={12} className="text-white font-semibold" />
          </div>
          <span className="pl-[2px] sm:pl-[7px]">{data.qty}</span>
          <div
            className="bg-[#bc3434] border border-[#00000073] rounded-full w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] flex items-center justify-center cursor-pointer hover:scale-105 duration-300"
            onClick={() => decrement(data)}
          >
            <HiOutlineMinus size={12} className="text-white font-semibold" />
          </div>
        </div>
        <img
          src={`${backend_url}${data?.images[0]}`}
          alt="product"
          className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] ml-4"
        />
        <div className="px-2 sm:px-4">
          <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#440052]">
            {data.name}
          </h3>
          <h6 className="text-[10px] text-[#610000] font-medium py-1 sm:py-2">
            Nrs {data.discountPrice} * {val}
          </h6>
          <h6 className="text-[14px] sm:text-[15px] text-[#900000] font-semibold">
            Nrs {totalPrice}
          </h6>
        </div>
        <RxCross1
          size={10}
          className="cursor-pointer fixed right-4"
          onClick={() => removeFromCartHandler(data)}
        />
      </div>
    </div>
  );
};

export default Cart;
