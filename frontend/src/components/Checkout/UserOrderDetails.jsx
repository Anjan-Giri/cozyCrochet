import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { FaMapMarkerAlt, FaPhoneAlt, FaCreditCard } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserOrders } from "../../redux/actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";

const UserOrderDetails = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllUserOrders(user._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  const reviewHandler = async (e) => {
    try {
      e.preventDefault(); // Prevent default form behavior if called from a form

      // Validate required state
      if (!selectedItem) {
        toast.error("Please select a product to review");
        return;
      }

      if (rating < 1 || rating > 5) {
        toast.error("Please select a rating between 1-5 stars");
        return;
      }

      // Extract IDs from different possible structures
      const productId =
        selectedItem.product?._id || selectedItem.productId || selectedItem._id;

      const cartItemId = selectedItem._id; // This is the cart item's own ID

      if (!productId || !cartItemId) {
        console.error("Missing IDs in selected item:", selectedItem);
        toast.error("Could not identify product for review");
        return;
      }

      // Debug log before submission
      console.log("Submitting review with:", {
        productId,
        cartItemId,
        orderId: id,
        rating,
        comment: comment || "No comment provided",
        user: {
          _id: user._id,
          name: user.name,
        },
      });

      // Submit review
      const response = await axios.put(
        `${server}/product/create-review`,
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          },
          rating,
          comment,
          productId,
          orderId: id,
          cartItemId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        }
      );

      // Handle success
      toast.success(response.data.message || "Review submitted successfully!");

      // Refresh data
      dispatch(getAllUserOrders(user._id));

      // Close modal and reset form
      setOpen(false);
      setSelectedItem(null);
      setRating(1);
      setComment("");

      // Debug log after success
      console.log("Review submitted successfully", {
        productId,
        orderId: id,
        newRating: response.data.product?.ratings,
      });
    } catch (error) {
      // Enhanced error handling
      console.error("Review submission failed:", {
        error: error.response?.data || error.message,
        config: error.config?.data,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit review";

      if (error.response?.status === 400) {
        toast.error(`Validation error: ${errorMessage}`);
      } else if (error.response?.status === 404) {
        toast.error("Product or order not found");
      } else if (error.code === "ECONNABORTED") {
        toast.error("Request timed out - please try again");
      } else {
        toast.error(errorMessage);
      }
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

  // Function to get cart items regardless of data structure
  const getCartItems = () => {
    if (!data) return [];

    // If cart is an array, use it directly
    if (Array.isArray(data.cart)) {
      return data.cart;
    }

    // If cart is an object with items array
    if (data.cart && Array.isArray(data.cart.items)) {
      return data.cart.items;
    }

    // If none of the above, return empty array
    return [];
  };

  const cartItems = getCartItems();

  // Get appropriate badge color for status
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
              Order Details
            </h1>
          </div>
          <Link to="/profile">
            <div className="px-6 py-2 bg-[#fce1e6] rounded-md text-[#e94560] font-semibold hover:bg-[#e94560] hover:text-white transition duration-300">
              Go to Profile
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
                  className={`p-4 flex items-center ${
                    index !== cartItems.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                  key={index}
                >
                  <img
                    src={
                      (item.images && item.images[0]?.url) ||
                      (item.product?.images && item.product.images[0]?.url) ||
                      "/placeholder-image.png"
                    }
                    alt=""
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
                  {item.isReviewed ? null : (
                    <div className="ml-3">
                      {data?.status === "Delivered" && (
                        <span
                          className="w-full h-[50px] flex items-center justify-center text-center text-[50007a] border-2 border-purple-800 rounded-md cursor-pointer mt-10 hover:border-red-900 hover:text-red-900 hover:scale-105 duration-300 p-4"
                          onClick={() => setOpen(true) || setSelectedItem(item)}
                        >
                          Give Review
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No items in this order
              </div>
            )}
          </div>

          {/* review product */}
          {open && selectedItem && (
            <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
              <div className="w-[90%] md:w-[50%] bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header with matching gradient to the rest of the site */}
                <div className="w-full flex justify-between items-center border-b border-gray-200 bg-[#50007a] p-4">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    Product Review
                  </h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-white hover:text-[#fce1e6] transition-colors duration-200"
                  >
                    <RxCross1 size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Product info with matching border style from other components */}
                  <div className="flex items-center p-4 border-2 border-[#50007a] rounded-md bg-white mb-6">
                    <img
                      src={
                        (selectedItem.images && selectedItem.images[0]?.url) ||
                        (selectedItem.product?.images &&
                          selectedItem.product.images[0]?.url) ||
                        "/placeholder-image.png"
                      }
                      alt=""
                      className="w-[80px] h-[80px] object-cover rounded-md border border-gray-200"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-800">
                        {selectedItem.name ||
                          selectedItem.product?.name ||
                          "Product"}
                      </h3>
                      <p className="text-[#e94560] font-medium mt-1">
                        Nrs.{" "}
                        {selectedItem.discountPrice ||
                          selectedItem.price ||
                          selectedItem.product?.discountPrice ||
                          0}{" "}
                        x {selectedItem.qty || selectedItem.quantity || 1}
                      </p>
                    </div>
                  </div>

                  {/* Rating section with matching color scheme */}
                  <div className="mb-6">
                    <h5 className="text-lg font-medium text-[#50007a] mb-2">
                      Your Rating <span className="text-[#e94560]">*</span>
                    </h5>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((i) =>
                        rating >= i ? (
                          <AiFillStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color="#e94560"
                            size={30}
                            onClick={() => setRating(i)}
                          />
                        ) : (
                          <AiOutlineStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color="#50007a"
                            size={30}
                            onClick={() => setRating(i)}
                          />
                        )
                      )}
                      <span className="ml-2 text-gray-500">
                        {rating === 1
                          ? "Poor"
                          : rating === 2
                          ? "Fair"
                          : rating === 3
                          ? "Good"
                          : rating === 4
                          ? "Very Good"
                          : "Excellent"}
                      </span>
                    </div>
                  </div>

                  {/* Comment section with matching form styling */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      Your Review
                      <span className="ml-1 text-sm text-gray-500">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="w-full h-24 p-3 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  {/* Submit button with matching button styling from Address component */}
                  <button
                    onClick={rating >= 1 ? reviewHandler : null}
                    className={`w-[210px] h-[50px] mx-auto flex items-center justify-center text-[#50007a] border-2 font-semibold border-[#50007a] rounded-md cursor-pointer mt-4 hover:border-red-900 hover:text-red-900 hover:scale-105 duration-300 ${
                      rating <= 1
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    disabled={rating <= 1}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Total Price */}
          <div className="flex justify-between mt-4 border-t border-gray-200 pt-4">
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
                    data.paymentInfo?.status === "succeeded"
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
      </div>
    </div>
  );
};

export default UserOrderDetails;
