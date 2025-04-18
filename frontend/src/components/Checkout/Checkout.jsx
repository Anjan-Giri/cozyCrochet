import React, { useState, useEffect } from "react";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("NP");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
    if (
      address1 === "" ||
      address2 === "" ||
      zipCode === null ||
      country === "" ||
      city === ""
    ) {
      toast.error("Please choose your delivery address!");
    } else {
      const shippingAddress = {
        address1,
        address2,
        zipCode,
        country,
        city,
      };
      const orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice,
        shippingAddress,
        user,
      };
      // update local storage with orders
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice =
    cart && cart.items && cart.items.length > 0
      ? cart.items.reduce(
          (acc, item) =>
            acc + item.quantity * (item.product.discountPrice || item.price),
          0
        )
      : 0;

  // shipping cost variable
  const shipping = subTotalPrice * 0.05;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    try {
      const response = await axios.get(`${server}/code/get-code-value/${name}`);

      if (response.data.success) {
        const codeData = response.data.code;

        if (codeData) {
          const shopId = codeData.shop;
          const codeValue = codeData.value;

          // Check if this coupon is for specific products only
          if (codeData.selectedProducts) {
            // Filter items that match both shop and selected product name
            const eligibleItems =
              cart && cart.items
                ? cart.items.filter(
                    (item) =>
                      item.product.shopId === shopId &&
                      (codeData.selectedProducts === item.product.name ||
                        codeData.selectedProducts === "all")
                  )
                : [];

            if (eligibleItems.length === 0) {
              toast.error("This coupon is only valid for specific products");
              setCouponCode("");
              return;
            }

            // Calculate discount based on only eligible products
            const eligiblePrice = eligibleItems.reduce(
              (acc, item) =>
                acc +
                item.quantity * (item.product.discountPrice || item.price),
              0
            );

            // Apply other checks and calculations
            handleDiscountCalculation(eligiblePrice, codeData);
          } else {
            // Check for shop-wide coupon (any product from the shop)
            const eligibleItems =
              cart && cart.items
                ? cart.items.filter((item) => item.product.shopId === shopId)
                : [];

            if (eligibleItems.length === 0) {
              toast.error("Coupon code is not valid for this shop");
              setCouponCode("");
              return;
            }

            // Calculate based on all eligible shop items
            const eligiblePrice = eligibleItems.reduce(
              (acc, item) =>
                acc +
                item.quantity * (item.product.discountPrice || item.price),
              0
            );

            // Apply other checks and calculations
            handleDiscountCalculation(eligiblePrice, codeData);
          }
        } else {
          toast.error("Coupon code doesn't exist!");
          setCouponCode("");
        }
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Failed to apply coupon code. Please try again.");
      setCouponCode("");
    }
  };

  const handleDiscountCalculation = (eligiblePrice, codeData) => {
    // Check if meets minimum amount requirement
    if (codeData.minAmount > 0 && eligiblePrice < codeData.minAmount) {
      toast.error(
        `Minimum purchase of Nrs. ${codeData.minAmount} required for this code`
      );
      setCouponCode("");
      return;
    }

    // Calculate discount
    let discount = (eligiblePrice * codeData.value) / 100;

    // Apply maximum discount limit if set
    if (codeData.maxAmount > 0 && discount > codeData.maxAmount) {
      discount = codeData.maxAmount;
      toast.info(`Maximum discount of Nrs. ${codeData.maxAmount} applied`);
    }

    setDiscountPrice(discount);
    setCouponCodeData(codeData);
    setCouponCode("");
    toast.success("Coupon code applied successfully!");
  };

  const discountPercentage = couponCodeData ? discountPrice : "";

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentage).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8 flex flex-col">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentage={discountPercentage}
          />
          <div
            className="w-full h-[50px] flex items-center justify-center text-center text-[50007a] border-2 border-purple-800 rounded-md cursor-pointer mt-10 hover:border-red-900 hover:text-red-900 hover:scale-105 duration-300"
            onClick={paymentSubmit}
          >
            <h5>Go to Payment</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
}) => {
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500] text-[#50007a]">
        Shipping Address
      </h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Full Name
            </label>
            <input
              type="text"
              value={user && user.name}
              required
              className="block w-[95%] px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="w-[50%]">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Email Address
            </label>
            <input
              type="email"
              value={user && user.email}
              required
              className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Phone Number
            </label>
            <input
              type="number"
              required
              value={user && user.phoneNumber}
              className="block w-[95%] px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="w-[50%]">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Zip Code
            </label>
            <input
              type="number"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          {/* <div className="w-[50%]">
            <label className="block pb-2">Country</label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px]"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your country
              </option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div> */}
          <div className="w-[50%]">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Country
            </label>
            <input
              type="text"
              value="Nepal"
              className="block w-[95%] px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled
            />
            <input type="hidden" value={country} />
          </div>
          <div className="w-[50%]">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              City
            </label>
            <select
              className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option className="block" value="">
                Choose your State
              </option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Address 1
            </label>
            <input
              type="address"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="block w-[95%] px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="w-[50%]">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Address 2
            </label>
            <input
              type="address"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
              className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div></div>
      </form>
      <h5
        className="text-[18px] text-[#50007a] cursor-pointer inline-block mt-3"
        onClick={() => setUserInfo(!userInfo)}
      >
        Choose From saved address
      </h5>
      {userInfo && (
        <div>
          {user &&
            user.addresses.map((item, index) => (
              <div className="w-full flex mt-1" key={index}>
                <input
                  type="checkbox"
                  className="mr-3"
                  value={item.addressType}
                  onClick={() =>
                    setAddress1(item.address1) ||
                    setAddress2(item.address2) ||
                    setZipCode(item.zipCode) ||
                    setCountry(item.country) ||
                    setCity(item.city)
                  }
                />
                <h2>{item.addressType}</h2>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentage,
}) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#50007a]">Subtotal:</h3>
        <h5 className="text-[18px] font-[600]">Nrs. {subTotalPrice}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#50007a]">Shipping:</h3>
        <h5 className="text-[18px] font-[600]">Nrs. {shipping.toFixed(2)}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#50007a]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          - {discountPercentage ? "Nrs." + discountPercentage.toString() : null}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">
        Nrs. {totalPrice}
      </h5>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        <input
          className="w-full h-[40px] text-center text-[#50007a] border-2 font-semibold border-[#50007a] rounded-md cursor-pointer mt-8 hover:border-red-900 hover:text-red-900 hover:scale-105 duration-300"
          required
          value="Apply code"
          type="submit"
        />
      </form>
    </div>
  );
};

export default Checkout;
