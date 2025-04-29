import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { FaMapMarkerAlt, FaPhoneAlt, FaCreditCard } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersShop } from "../../redux/actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";

const ShopOrderDetails = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersShop(seller._id));
    }
  }, [dispatch, seller]);

  const data = orders && orders.find((item) => item._id === id);

  useEffect(() => {
    if (data) {
      setStatus(data.status || "Processing");
    }
  }, [data]);

  const orderUpdateHandler = async () => {
    try {
      setIsSubmitting(true);
      await axios.put(
        `${server}/order/update-order-status/${id}`,
        {
          status,
        },
        { withCredentials: true }
      );
      toast.success("Order status updated successfully!");
      if (seller?._id) {
        dispatch(getAllOrdersShop(seller._id));
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-[#e94560]">
            Order not found
          </h2>
          <p className="mt-2 text-gray-600">
            This order may have been deleted or doesn't exist
          </p>
          <Link to="/dashboard-orders">
            <button className="mt-4 px-6 py-2 bg-[#fce1e6] text-[#e94560] rounded-md hover:bg-[#e94560] hover:text-white transition duration-300">
              Return to Orders
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const getCartItems = () => {
    if (!data) return [];

    // If cart is an array
    if (Array.isArray(data.cart)) {
      return data.cart;
    }

    // If cart is an object with items array
    if (data.cart && Array.isArray(data.cart.items)) {
      return data.cart.items;
    }

    return [];
  };

  const cartItems = getCartItems();

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Transferred to delivery partner":
        return "bg-purple-100 text-purple-800";
      case "Shipping":
        return "bg-yellow-100 text-yellow-800";
      case "Received":
        return "bg-green-100 text-green-800";
      case "On the way":
        return "bg-indigo-100 text-indigo-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const orderStatuses = [
    "Processing",
    "Transferred to delivery partner",
    "Shipping",
    "Received",
    "On the way",
    "Delivered",
  ];

  const getAvailableStatuses = () => {
    const currentIndex = orderStatuses.indexOf(data.status);
    if (currentIndex === -1) return orderStatuses;
    return orderStatuses.slice(currentIndex);
  };

  const getProductImage = (item) => {
    const imageUrl =
      (item.images && item.images[0]?.url) ||
      (item.product?.images && item.product.images[0]?.url);

    if (!imageUrl) return "/placeholder-image.png";

    if (imageUrl.startsWith("http")) return imageUrl;

    const baseUrl = server.replace("/api/v2", "").replace(/\/$/, "");

    const imagePath = imageUrl.replace(/^\/?(uploads\/)?/, "");

    return `${baseUrl}/uploads/${imagePath}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className={`${styles.section} bg-white rounded-lg shadow-md p-6`}>
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center">
            <div className="bg-[#fce1e6] p-3 rounded-full">
              <BsFillBagFill size={24} color="#e94560" />
            </div>
            <h1 className="pl-3 text-2xl font-bold text-gray-800">
              Order Details
            </h1>
          </div>
          <Link to="/dashboard-orders">
            <div className="px-6 py-2 bg-[#fce1e6] rounded-md text-[#e94560] font-semibold hover:bg-[#e94560] hover:text-white transition duration-300">
              Order List
            </div>
          </Link>
        </div>

        {/* Order Info Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 p-4 rounded-md mt-6">
          <div className="flex items-center mb-2 md:mb-0">
            <span className="text-gray-500 mr-2">Order ID:</span>
            <span className="font-semibold text-gray-900">
              #{data._id?.slice(0, 8)}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">Placed on:</span>
            <span className="font-semibold text-gray-900">
              {data.createdAt?.slice(0, 10)}
            </span>
          </div>
        </div>

        {/* Current Status Badge */}
        <div className="mt-4">
          <span className="text-gray-500">Current Status:</span>
          <span
            className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              data.status
            )}`}
          >
            {data.status || "Processing"}
          </span>
        </div>

        {/* Order Items */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Items
          </h2>
          <div className="bg-white rounded-lg border border-gray-200">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div
                  className={`p-4 flex items-start ${
                    index !== cartItems.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                  key={index}
                >
                  <img
                    src={getProductImage(item)}
                    alt="Product"
                    className="w-[80px] h-[80px] object-cover rounded-md"
                  />
                  <div className="ml-4 flex-grow">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.name || item.product?.name || "Product Name"}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-gray-500">
                        Nrs.{" "}
                        {item.discountPrice ||
                          item.price ||
                          item.product?.discountPrice ||
                          0}{" "}
                        x {item.qty || item.quantity || 1}
                      </p>
                      <p className="font-medium text-gray-900">
                        Nrs.{" "}
                        {(item.discountPrice ||
                          item.price ||
                          item.product?.discountPrice ||
                          0) * (item.qty || item.quantity || 1)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No items in this order
              </div>
            )}
          </div>

          {/* Total Price */}
          <div className="flex justify-end mt-4 border-t border-gray-200 pt-4">
            <div className="text-right">
              <span className="text-gray-500">Total Price:</span>
              <span className="ml-2 text-xl font-bold text-[#e94560]">
                Nrs. {data.totalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Customer and Payment Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-[#e94560]" />
              Shipping Address
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                {data.shippingAddress?.address1 +
                  " " +
                  (data.shippingAddress?.address2 || "")}
              </p>
              <p>
                {data.shippingAddress?.city}, {data.shippingAddress?.country}
              </p>
              <p className="flex items-center">
                <FaPhoneAlt className="mr-2 text-gray-500 text-sm" />
                {data.user?.phoneNumber || "No phone provided"}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaCreditCard className="mr-2 text-[#e94560]" />
              Payment Information
            </h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    data.paymentInfo?.status === "succeeded" ||
                    data.paymentInfo?.status === "Succeeded"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {data.paymentInfo?.status
                    ? data.paymentInfo.status
                    : "Not Paid"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span>{data.paymentInfo?.type || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Update */}
        {data.status !== "Delivered" && (
          <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Update Order Status
            </h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
                disabled={isSubmitting}
              >
                {getAvailableStatuses().map((option, index) => (
                  <option value={option} key={index}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                className={`w-full sm:w-auto px-6 py-2 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#e94560] hover:bg-[#d03050]"
                } text-white rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e94560]`}
                onClick={orderUpdateHandler}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopOrderDetails;
