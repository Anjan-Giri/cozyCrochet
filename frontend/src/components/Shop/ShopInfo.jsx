import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Layout/Loader";

const ShopInfo = ({ isOwner }) => {
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [shopProductCount, setShopProductCount] = useState(0);
  const [shopRating, setShopRating] = useState("No ratings yet");
  const [shopStatsLoading, setShopStatsLoading] = useState(false);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        if (isOwner && seller) {
          setShopData(seller);
        } else if (id) {
          const { data } = await axios.get(
            `${server}/shop/get-shop-info/${id}`
          );
          setShopData(data.shop);
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [isOwner, seller, id]);

  useEffect(() => {
    const fetchShopStats = async () => {
      if (shopData?._id) {
        try {
          setShopStatsLoading(true);

          const response = await axios.get(
            `${server}/product/get-all-products-shop/${shopData._id}`
          );

          if (response.data.success) {
            const productsArray = response.data.products || [];
            setShopProductCount(productsArray.length);

            // Calculate average rating
            let ratingSum = 0;
            let ratingCount = 0;

            productsArray.forEach((product) => {
              if (product.reviews && product.reviews.length > 0) {
                product.reviews.forEach((review) => {
                  if (review.rating) {
                    ratingSum += review.rating;
                    ratingCount++;
                  }
                });
              }
            });

            if (ratingCount > 0) {
              const avgRating = (ratingSum / ratingCount).toFixed(1);
              setShopRating(`${avgRating} / 5 (${ratingCount} reviews)`);
            } else {
              setShopRating("No ratings yet");
            }
          }
        } catch (error) {
          console.error("Error fetching shop stats:", error);
          setShopProductCount(0);
          setShopRating("No ratings yet");
        } finally {
          setShopStatsLoading(false);
        }
      }
    };

    fetchShopStats();
  }, [shopData]);

  const logoutHandler = async () => {
    try {
      dispatch({ type: "LogoutRequest" });
      const { data } = await axios.get(`${server}/shop/logout`, {
        withCredentials: true,
      });

      if (data.success) {
        dispatch({ type: "LogoutSuccess" });
        navigate("/login");
      }
    } catch (error) {
      dispatch({
        type: "LogoutFailed",
        payload: error.response?.data?.message || "Logout failed",
      });
    }
  };

  const getAvatarUrl = React.useCallback((avatar) => {
    if (!avatar) return "/default-avatar.png";

    if (
      typeof avatar === "string" &&
      (avatar.startsWith("http://") || avatar.startsWith("https://"))
    ) {
      return avatar;
    }

    const avatarPath = typeof avatar === "object" ? avatar.url : avatar;

    const cleanPath = avatarPath.replace(/^\/?(uploads\/)?/, "");

    return `${backend_url}uploads/${cleanPath}`;
  }, []);

  const avatarUrl = React.useMemo(() => {
    return imageError ? "/default-avatar.png" : getAvatarUrl(shopData?.avatar);
  }, [shopData?.avatar, imageError, getAvatarUrl]);

  if (loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading shop information...</div>
      </div>
    );
  }

  if (!shopData) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div className="w-full py-6">
        <div className="w-full flex item-center justify-center">
          <img
            src={avatarUrl}
            alt={`${shopData.name}'s shop`}
            className="w-[150px] h-[150px] object-cover rounded-full"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
        <h3 className="text-center py-2 text-[20px] text-[#550265] font-semibold">
          {shopData.name}
        </h3>
        <p className="text-[16px] text-[#3b0057] p-[10px] flex items-center justify-center">
          {shopData.description || "No description available"}
        </p>
      </div>
      <div className="flex items-center justify-between px-8 flex-wrap">
        <div className="p-3">
          <h5 className="font-[600] text-[#480000]">Address</h5>
          <h4 className="text-[#440044]">{shopData.address}</h4>
        </div>
        <div className="p-3">
          <h5 className="font-[600] text-[#480000]">Phone Number</h5>
          <h4 className="text-[#440044]">{shopData.phoneNumber}</h4>
        </div>
        <div className="p-3">
          <h5 className="font-[600] text-[#480000]">Total Products</h5>
          <h4 className="text-[#440044]">
            {shopStatsLoading ? "Loading..." : shopProductCount}
          </h4>
        </div>
        <div className="p-3">
          <h5 className="font-[600] text-[#480000]">Ratings</h5>
          <h4 className="text-[#440044]">
            {shopStatsLoading ? "Loading..." : shopRating}
          </h4>
        </div>
        <div className="p-3">
          <h5 className="font-[600] text-[#480000]">Joined On</h5>
          <h4 className="text-[#440044]">
            {shopData.createdAt
              ? new Date(shopData.createdAt).toLocaleDateString()
              : "Not available"}
          </h4>
        </div>
      </div>
      {isOwner && (
        <div className="py-3 px-8 flex flex-col items-end">
          <Link
            to="/settings"
            className="w-full md:w-[25%] bg-gradient-to-r from-gray-900 to-gray-600 text-white font-bold hover:cursor-pointer hover:bg-gradient-to-l hover:from-gray-900 hover:to-gray-600 hover:text-gray-200 duration-300 ease-in-out rounded-lg flex items-center py-3 px-4 justify-center my-2"
          >
            <span className="text-white">Edit Shop</span>
          </Link>
          <button
            className="w-full md:w-[25%] bg-gradient-to-r from-gray-900 to-gray-600 text-white font-bold hover:cursor-pointer hover:bg-gradient-to-l hover:from-gray-900 hover:to-gray-600 hover:text-gray-200 duration-300 ease-in-out rounded-lg flex items-center py-3 px-4 justify-center my-2"
            onClick={logoutHandler}
          >
            <span className="text-white">Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopInfo;
