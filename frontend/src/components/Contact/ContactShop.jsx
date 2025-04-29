import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { BsChatSquareFill } from "react-icons/bs";
import { FaStore, FaPhoneAlt, FaShoppingCart } from "react-icons/fa";
import Loader from "../Layout/Loader";
import ReCAPTCHA from "react-google-recaptcha";

const ContactShop = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shopDetails, setShopDetails] = useState(null);
  const [captchaToken, setCaptchaToken] = useState(null);

  //form data for authenticated users
  const [formData, setFormData] = useState({
    shopId: "",
    subject: "",
    message: "",
    orderDetails: "",
  });

  //form data for non-authenticated users
  const [guestFormData, setGuestFormData] = useState({
    shopId: "",
    name: "",
    email: "",
    subject: "",
    message: "",
    orderDetails: "",
  });

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${server}/contact/get-shops-for-contact`
        );
        setShops(data.shops);
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch shops");
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const handleShopChange = async (e) => {
    const shopId = e.target.value;

    if (isAuthenticated) {
      setFormData({
        ...formData,
        shopId: shopId,
      });
    } else {
      setGuestFormData({
        ...guestFormData,
        shopId: shopId,
      });
    }

    if (shopId) {
      try {
        const { data } = await axios.get(
          `${server}/contact/shop-contact-info/${shopId}`
        );
        setShopDetails(data.shopInfo);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch shop details"
        );
      }
    } else {
      setShopDetails(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (isAuthenticated) {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setGuestFormData({
        ...guestFormData,
        [name]: value,
      });
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated && !captchaToken) {
      toast.error("Please complete the CAPTCHA verification");
      return;
    }

    try {
      setLoading(true);

      if (isAuthenticated) {
        const { data } = await axios.post(
          `${server}/contact/contact-shop`,
          formData,
          { withCredentials: true }
        );
        toast.success(data.message);
        setFormData({
          shopId: "",
          subject: "",
          message: "",
          orderDetails: "",
        });
      } else {
        const { data } = await axios.post(
          `${server}/contact/contact-shop-public`,
          { ...guestFormData, captchaToken }
        );
        toast.success(data.message);
        setGuestFormData({
          shopId: "",
          name: "",
          email: "",
          subject: "",
          message: "",
          orderDetails: "",
        });

        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
        setCaptchaToken(null);
      }

      setShopDetails(null);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      setLoading(false);
    }
  };

  if (loading && shops.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="w-11/12 mx-auto max-w-6xl bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center">
            <div className="bg-[#fce1e6] p-3 rounded-full">
              <BsChatSquareFill size={24} color="#e94560" />
            </div>
            <h1 className="pl-3 text-2xl font-bold text-gray-800">
              Contact Shop
            </h1>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gray-50 p-4 rounded-md mt-6 text-gray-700">
          <p className="text-center">
            Request custom orders or ask questions directly to shop owners.
          </p>
        </div>

        <div className="mt-6">
          <form onSubmit={handleSubmit}>
            {/* Shop Selection */}
            <div className="mb-6">
              <label
                htmlFor="shopId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Shop <span className="text-[#e94560]">*</span>
              </label>
              <select
                id="shopId"
                name="shopId"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#50007a] focus:border-[#50007a]"
                value={isAuthenticated ? formData.shopId : guestFormData.shopId}
                onChange={handleShopChange}
                required
              >
                <option value="">Choose a shop</option>
                {shops.map((shop) => (
                  <option key={shop._id} value={shop._id}>
                    {shop.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Shop Details Card */}
            {shopDetails && (
              <div className="bg-white rounded-lg border-2 border-[#50007a] p-4 mb-6">
                <div className="flex items-center mb-3">
                  <div className="bg-[#fce1e6] p-2 rounded-full mr-3">
                    <FaStore size={20} color="#e94560" />
                  </div>
                  <h5 className="text-xl font-semibold text-gray-800">
                    {shopDetails.name}
                  </h5>
                </div>
                {shopDetails.description && (
                  <p className="text-gray-600 mb-3 pl-2 border-l-4 border-[#fce1e6] bg-gray-50 p-2 rounded-r-md">
                    {shopDetails.description}
                  </p>
                )}
                {shopDetails.phoneNumber && (
                  <div className="flex items-center text-gray-700 mt-2">
                    <FaPhoneAlt className="mr-2 text-[#e94560]" size={14} />
                    <span>{shopDetails.phoneNumber}</span>
                  </div>
                )}
              </div>
            )}

            {!isAuthenticated && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Name <span className="text-[#e94560]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#50007a] focus:border-[#50007a]"
                    value={guestFormData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Email <span className="text-[#e94560]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#50007a] focus:border-[#50007a]"
                    value={guestFormData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Message Fields */}
            <div className="mb-6">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subject <span className="text-[#e94560]">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#50007a] focus:border-[#50007a]"
                value={
                  isAuthenticated ? formData.subject : guestFormData.subject
                }
                onChange={handleInputChange}
                required
                placeholder="E.g., Custom Crochet Blanket Request"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Message <span className="text-[#e94560]">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#50007a] focus:border-[#50007a]"
                rows="4"
                value={
                  isAuthenticated ? formData.message : guestFormData.message
                }
                onChange={handleInputChange}
                required
                placeholder="Describe what you're looking for..."
              ></textarea>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <FaShoppingCart className="mr-2 text-[#e94560]" />
                <label
                  htmlFor="orderDetails"
                  className="block text-sm font-medium text-gray-700"
                >
                  Custom Order Details (Optional)
                </label>
              </div>
              <textarea
                id="orderDetails"
                name="orderDetails"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#50007a] focus:border-[#50007a]"
                rows="3"
                value={
                  isAuthenticated
                    ? formData.orderDetails
                    : guestFormData.orderDetails
                }
                onChange={handleInputChange}
                placeholder="Size, colors, specific patterns, timeframe, budget, etc."
              ></textarea>
            </div>

            {!isAuthenticated && (
              <div className="mb-6 flex justify-center">
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  onChange={handleCaptchaChange}
                  onExpired={() => setCaptchaToken(null)}
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="px-8 py-3 bg-[#50007a] text-white rounded-md font-semibold hover:bg-[#e94560] transition duration-300 shadow-md"
                disabled={loading || (!isAuthenticated && !captchaToken)}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>

            {/* Contact Info Message */}
            <div className="mt-6 text-center">
              {isAuthenticated && (
                <p className="text-sm text-gray-600 mb-1">
                  Your message will be sent using your account email:{" "}
                  <span className="font-medium">{user.email}</span>
                </p>
              )}
              <p className="text-sm text-gray-600">
                <span className="text-[#e94560]">*</span> The shop will reply
                directly to your email address
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactShop;
