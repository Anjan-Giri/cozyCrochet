import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { backend_url } from "../../server";
import {
  fetchCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "../../redux/actions/cart";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";

const Cart = ({ setOpenCart }) => {
  const dispatch = useDispatch();
  const { cart, error } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchCart())
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [dispatch]);

  //calculate total price
  const totalPrice =
    cart?.items?.reduce((acc, item) => acc + item.quantity * item.price, 0) ||
    0;

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to empty your cart?")) {
      dispatch(clearCart());
    }
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-screen bg-[#0000004b] z-10 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-[#0000004b] z-10 flex items-center justify-center">
      <div className="fixed top-0 right-0 min-h-screen w-[90%] sm:w-[60%] md:w-[40%] lg:w-[40%] bg-gray-100 flex flex-col justify-between shadow-sm z-20">
        {!cart || cart.items.length === 0 ? (
          <>
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
          </>
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

            <div className="flex items-center justify-between p-4 sm:p-6">
              <div className="flex items-center">
                <IoBagHandleOutline size={24} />
                <h3 className="pl-4 text-[15px] sm:text-[17px] font-semibold">
                  {cart.items.length}{" "}
                  {cart.items.length === 1 ? "Item" : "Items"}
                </h3>
              </div>

              <AiOutlineDelete
                size={30}
                onClick={handleClearCart}
                className=" text-red-800 text-sm font-medium cursor-pointer hover:scale-105 transition duration-300"
              />
            </div>

            <div className="w-full border-t">
              {cart.items.map((item) => (
                <CartItem
                  key={item.product._id}
                  data={item}
                  dispatch={dispatch}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-3 px-1">
          <Link to="/checkout">
            <div className="w-full flex items-center justify-center py-2 px-6 sm:py-1 sm:px-8 bg-[#ffffff] border-2 border-black text-black font-semibold rounded-md hover:bg-[#333] hover:text-white duration-300">
              CHECKOUT (Nrs {totalPrice.toFixed(2)})
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

const CartItem = ({ data, dispatch }) => {
  const [val, setVal] = useState(data.quantity);
  const [imageError, setImageError] = useState(false);

  const increment = () => {
    if (data.product.stock < val + 1) {
      toast.error("Product stock limit reached");
      return;
    }

    const newQuantity = val + 1;
    setVal(newQuantity);
    dispatch(updateCartItemQuantity(data.product._id, newQuantity));
  };

  const decrement = () => {
    const newQuantity = val > 1 ? val - 1 : 1;
    setVal(newQuantity);
    dispatch(updateCartItemQuantity(data.product._id, newQuantity));
  };

  const imageUrl = React.useMemo(() => {
    if (!data.product.images?.[0]?.url) return "/no-image.png";
    if (imageError) return "/no-image.png";

    if (data.product.images[0].url.startsWith("http")) {
      return data.product.images[0].url;
    }

    const baseUrl = backend_url.replace("/api/v2", "").replace(/\/$/, "");
    const imagePath = data.product.images[0].url.replace(
      /^\/?(uploads\/)?/,
      ""
    );

    return `${baseUrl}/uploads/${imagePath}`;
  }, [data.product.images, imageError]);

  const totalPrice = data.price * val;

  return (
    <div className="flex items-center justify-between p-4 sm:p-5 py-4 sm:py-6 border-b relative">
      <div className="w-full flex flex-row items-center">
        <div className="flex flex-col items-center sm:items-start">
          <div
            className="bg-[#027e00] border border-[#00000073] rounded-full w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] flex items-center justify-center cursor-pointer hover:scale-105 duration-300"
            onClick={increment}
          >
            <HiPlus size={12} className="text-white font-semibold" />
          </div>
          <span className="pl-[2px] sm:pl-[7px]">{val}</span>
          <div
            className="bg-[#bc3434] border border-[#00000073] rounded-full w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] flex items-center justify-center cursor-pointer hover:scale-105 duration-300"
            onClick={decrement}
          >
            <HiOutlineMinus size={12} className="text-white font-semibold" />
          </div>
        </div>
        <img
          src={imageUrl}
          alt="product"
          className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] ml-4"
          onError={(e) => {
            setImageError(true);
            e.target.src = "/no-image.png";
          }}
          loading="lazy"
        />
        <div className="px-2 sm:px-4">
          <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#440052]">
            {data.product.name}
          </h3>
          <h6 className="text-[10px] text-[#610000] font-medium py-1 sm:py-2">
            Nrs {data.price} * {val}
          </h6>
          <h6 className="text-[14px] sm:text-[15px] text-[#900000] font-semibold">
            Nrs {totalPrice.toFixed(2)}
          </h6>
        </div>
      </div>

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <RxCross1
          size={16}
          className="cursor-pointer text-red-600"
          onClick={() => dispatch(removeFromCart(data.product._id))}
          title="remove"
        />
      </div>
    </div>
  );
};

export default Cart;
