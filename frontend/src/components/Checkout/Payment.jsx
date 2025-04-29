import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { clearCart } from "../../redux/actions/cart";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const storedOrderData = JSON.parse(localStorage.getItem("latestOrder"));

    if (storedOrderData) {
      if (storedOrderData.cart && storedOrderData.cart.items) {
        const updatedItems = storedOrderData.cart.items.map((item) => {
          if (!item.shopId && item.product && item.product.shop) {
            return { ...item, shopId: item.product.shop };
          }
          return item;
        });

        setOrderData({
          ...storedOrderData,
          cart: {
            ...storedOrderData.cart,
            items: updatedItems,
          },
        });
      } else if (Array.isArray(storedOrderData.cart)) {
        const updatedCart = storedOrderData.cart.map((item) => {
          if (!item.shopId && item.product && item.product.shop) {
            return { ...item, shopId: item.product.shop };
          }
          return item;
        });

        setOrderData({
          ...storedOrderData,
          cart: updatedCart,
        });
      } else {
        setOrderData(storedOrderData);
      }
    }
  }, []);

  const order = {
    cart:
      orderData?.cart?.items ||
      (Array.isArray(orderData?.cart) ? orderData.cart : []),
    shippingAddress: orderData?.shippingAddress || {},
    user: user || {},
    totalPrice: orderData?.totalPrice || 0,
  };

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  };

  const paymentHandler = async (e) => {
    e.preventDefault();
    if (!orderData || !order) {
      toast.error("Order data is missing. Please try again.");
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${server}/payment/process`,
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            type: "Credit Card",
          };

          await axios
            .post(`${server}/order/create-order`, order, config)
            .then((res) => {
              setOpen(false);
              navigate("/order-success");
              toast.success("Order placed successfully!");
              localStorage.setItem("cartItems", JSON.stringify([]));
              localStorage.setItem("latestOrder", JSON.stringify([]));

              dispatch(clearCart());
            });
        }
      }
    } catch (error) {
      console.error(
        "Payment error details:",
        error.response ? error.response.data : error
      );
      toast.error(
        error.response
          ? error.response.data.message
          : error.message || "Payment failed"
      );
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      type: "Cash On Delivery",
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        navigate("/order-success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));

        dispatch(clearCart());
      });
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            open={open}
            setOpen={setOpen}
            paymentHandler={paymentHandler}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({ user, paymentHandler, cashOnDeliveryHandler }) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      {/* select buttons */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#50007a] relative flex items-center justify-center cursor-pointer"
            onClick={() => setSelect(1)}
          >
            {select === 1 ? (
              <div className="w-[13px] h-[13px] bg-[#50007a] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#50007a]">
            Pay with Debit/credit card
          </h4>
        </div>

        {/* pay with card */}
        {select === 1 ? (
          <div className="w-full flex border-b">
            <form className="w-full" onSubmit={paymentHandler}>
              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block text-sm font-medium text-[#50007a] py-2">
                    Name On Card
                  </label>
                  <input
                    required
                    placeholder={user && user.name}
                    className="block w-[95%] px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={user && user.name}
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block text-sm font-medium text-[#50007a] py-2">
                    Exp Date
                  </label>
                  <CardExpiryElement
                    required
                    placeholder="MM/YY"
                    className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    name="expiry"
                    options={{
                      style: {
                        base: {
                          fontSize: "14px",
                          lineHeight: 1.5,
                          color: "#444",
                        },
                        empty: {
                          color: "#50007a",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#444",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block text-sm font-medium text-[#50007a] py-2">
                    Card Number
                  </label>
                  <CardNumberElement
                    required
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="block w-[95%] px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    name="cardNumber"
                    options={{
                      style: {
                        base: {
                          fontSize: "14px",
                          lineHeight: 1.5,
                          color: "#444",
                        },
                        empty: {
                          color: "#50007a",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#444",
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block text-sm font-medium text-[#50007a] py-2">
                    CVV
                  </label>
                  <CardCvcElement
                    required
                    placeholder="XXX"
                    className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    name="cvc"
                    maxLength="3"
                    options={{
                      style: {
                        base: {
                          fontSize: "14px",
                          lineHeight: 1.5,
                          color: "#444",
                        },
                        empty: {
                          color: "#50007a",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#444",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <input
                type="submit"
                value="Submit"
                className="w-full h-[50px] flex items-center justify-center text-center text-[50007a] border-2 border-purple-800 rounded-md cursor-pointer mt-10 hover:border-red-900 hover:text-red-900 hover:scale-105 duration-300 font-semibold"
              />
            </form>
          </div>
        ) : null}
      </div>

      <br />
      {/* cash on delivery */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#50007a] relative flex items-center justify-center cursor-pointer"
            onClick={() => setSelect(2)}
          >
            {select === 2 ? (
              <div className="w-[13px] h-[13px] bg-[#50007a] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#50007a]">
            Cash on Delivery
          </h4>
        </div>

        {/* cash on delivery */}
        {select === 2 ? (
          <div className="w-full flex">
            <form className="w-full" onSubmit={cashOnDeliveryHandler}>
              <input
                type="submit"
                value="Confirm"
                className="w-full h-[50px] flex items-center justify-center text-center text-[50007a] border-2 border-purple-800 rounded-md cursor-pointer mt-10 hover:border-red-900 hover:text-red-900 hover:scale-105 duration-300 font-semibold"
              />
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);
  return (
    <div className="w-full bg-white rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#50007a]">Total:</h3>
        <h5 className="text-[18px] font-[600]">
          Nrs. {orderData?.subTotalPrice}
        </h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#50007a]">Shipping:</h3>
        <h5 className="text-[18px] font-[600]">Nrs. {shipping}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#50007a]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          {orderData?.discountPrice ? "Nrs. " + orderData.discountPrice : "-"}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">
        Nrs. {orderData?.totalPrice}
      </h5>
      <br />
    </div>
  );
};

export default Payment;
