import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserOrders } from "../../redux/actions/order";
import { useParams, Link } from "react-router-dom";
import { BsFillBagFill } from "react-icons/bs";
import { GiPaperPlane } from "react-icons/gi";
import { MdLocalShipping, MdLocationCity } from "react-icons/md";
import { FaMapMarkerAlt, FaCheck, FaWarehouse } from "react-icons/fa";
import Loader from "../Layout/Loader";

const TrackOrder = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllUserOrders(user._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  const getStepCompleted = (status) => {
    switch (status) {
      case "Processing":
        return 1;
      case "Transferred to delivery partner":
        return 2;
      case "Shipping":
        return 3;
      case "Received":
        return 4;
      case "On the way":
        return 5;
      case "Delivered":
        return 6;
      default:
        return 0;
    }
  };

  const stepCompleted = data ? getStepCompleted(data.status) : 0;

  const getStatusMessage = (status) => {
    switch (status) {
      case "Processing":
        return "Your order is being processed in our warehouse. We're preparing your items for shipment.";
      case "Transferred to delivery partner":
        return "Your order has been packed and transferred to our delivery partner. It will soon begin its journey to you.";
      case "Shipping":
        return "Your order is on its way! Our delivery partner has picked up your package and is transporting it to your city.";
      case "Received":
        return "Your order has arrived in your city and is at the local distribution center. A delivery person will be assigned soon.";
      case "On the way":
        return "Great news! Your order is out for delivery. Our delivery person is on their way to your address.";
      case "Delivered":
        return "Your order has been successfully delivered. We hope you enjoy your purchase!";
      default:
        return "Your order status is being updated. Please check back soon.";
    }
  };

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

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className={`${styles.section} bg-white rounded-lg shadow-md p-6`}>
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center">
            <div className="bg-[#fce1e6] p-3 rounded-full">
              <BsFillBagFill size={24} color="#e94560" />
            </div>
            <h1 className="pl-3 text-2xl font-bold text-gray-800">
              Track Your Order
            </h1>
          </div>
          <Link to={`/user/order/${id}`}>
            <div className="px-6 py-2 bg-[#fce1e6] rounded-md text-[#e94560] font-semibold hover:bg-[#e94560] hover:text-white transition duration-300">
              View Order Details
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

        {/* Status Message */}
        <div className="mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-lg text-gray-700">
            {getStatusMessage(data.status)}
          </p>
        </div>

        {/* Timeline */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Tracking Timeline
          </h2>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-5 h-full w-1 bg-gray-200"></div>

            {/* Steps */}
            <div className="mb-6 relative flex">
              <div
                className={`rounded-full h-12 w-12 flex items-center justify-center z-10 ${
                  stepCompleted >= 1
                    ? "bg-[#e94560] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <FaWarehouse size={20} />
              </div>
              <div className="ml-4">
                <h3
                  className={`font-medium ${
                    stepCompleted >= 1 ? "text-[#e94560]" : "text-gray-500"
                  }`}
                >
                  Processing
                </h3>
                <p className="text-sm text-gray-500">
                  Order confirmed and being prepared
                </p>
              </div>
            </div>

            <div className="mb-6 relative flex">
              <div
                className={`rounded-full h-12 w-12 flex items-center justify-center z-10 ${
                  stepCompleted >= 2
                    ? "bg-[#e94560] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <GiPaperPlane size={20} />
              </div>
              <div className="ml-4">
                <h3
                  className={`font-medium ${
                    stepCompleted >= 2 ? "text-[#e94560]" : "text-gray-500"
                  }`}
                >
                  Transferred to Delivery Partner
                </h3>
                <p className="text-sm text-gray-500">
                  Shipped to our logistics partner
                </p>
              </div>
            </div>

            <div className="mb-6 relative flex">
              <div
                className={`rounded-full h-12 w-12 flex items-center justify-center z-10 ${
                  stepCompleted >= 3
                    ? "bg-[#e94560] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <MdLocalShipping size={20} />
              </div>
              <div className="ml-4">
                <h3
                  className={`font-medium ${
                    stepCompleted >= 3 ? "text-[#e94560]" : "text-gray-500"
                  }`}
                >
                  Shipping
                </h3>
                <p className="text-sm text-gray-500">
                  Your order is in transit
                </p>
              </div>
            </div>

            <div className="mb-6 relative flex">
              <div
                className={`rounded-full h-12 w-12 flex items-center justify-center z-10 ${
                  stepCompleted >= 4
                    ? "bg-[#e94560] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <MdLocationCity size={20} />
              </div>
              <div className="ml-4">
                <h3
                  className={`font-medium ${
                    stepCompleted >= 4 ? "text-[#e94560]" : "text-gray-500"
                  }`}
                >
                  Received
                </h3>
                <p className="text-sm text-gray-500">
                  Package arrived in your city
                </p>
              </div>
            </div>

            <div className="mb-6 relative flex">
              <div
                className={`rounded-full h-12 w-12 flex items-center justify-center z-10 ${
                  stepCompleted >= 5
                    ? "bg-[#e94560] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <FaMapMarkerAlt size={20} />
              </div>
              <div className="ml-4">
                <h3
                  className={`font-medium ${
                    stepCompleted >= 5 ? "text-[#e94560]" : "text-gray-500"
                  }`}
                >
                  On the Way
                </h3>
                <p className="text-sm text-gray-500">
                  Out for delivery to your address
                </p>
              </div>
            </div>

            <div className="relative flex">
              <div
                className={`rounded-full h-12 w-12 flex items-center justify-center z-10 ${
                  stepCompleted >= 6
                    ? "bg-[#e94560] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <FaCheck size={20} />
              </div>
              <div className="ml-4">
                <h3
                  className={`font-medium ${
                    stepCompleted >= 6 ? "text-[#e94560]" : "text-gray-500"
                  }`}
                >
                  Delivered
                </h3>
                <p className="text-sm text-gray-500">
                  Package delivered successfully
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Delivery Section */}
        {data.status !== "Delivered" && (
          <div className="mt-8 p-5 bg-[#fce1e6] rounded-lg">
            <h3 className="text-lg font-semibold text-[#e94560]">
              Estimated Delivery
            </h3>
            <p className="mt-2 text-gray-700">
              We're working to get your order to you as soon as possible.
              {data.estimatedDelivery
                ? ` Expected by ${data.estimatedDelivery}.`
                : " You will receive an update once your order is on its way."}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to={`/user/order/${id}`}>
            <button className="px-6 py-2 bg-[#50007a] text-white rounded-md hover:bg-purple-800 transition duration-300">
              View Order Details
            </button>
          </Link>
          <Link to="/profile">
            <button className="px-6 py-2 border border-[#e94560] text-[#e94560] rounded-md hover:bg-[#e94560] hover:text-white transition duration-300">
              Back to Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
