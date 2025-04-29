import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { backend_url, server } from "../../../server";

const Support = () => {
  const [topShops, setTopShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTopShops = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get(`${server}/shop/top-shops`, {
          withCredentials: true,
        });

        if (data.success) {
          const sortedShops = data.shops
            .sort((a, b) => b.productCount - a.productCount)
            .slice(0, 3);
          setTopShops(sortedShops);
        } else {
          setError("Failed to load shops");
        }
      } catch (error) {
        console.error("Error loading top shops:", error);
        setError(error.response?.data?.message || "Failed to load shops");
      } finally {
        setLoading(false);
      }
    };

    getTopShops();
  }, []);

  const getAvatarUrl = (shop) => {
    if (!shop.avatar) return "/default-avatar.png";

    if (
      typeof shop.avatar === "string" &&
      (shop.avatar.startsWith("http://") || shop.avatar.startsWith("https://"))
    ) {
      return shop.avatar;
    }

    const avatarPath =
      typeof shop.avatar === "object" ? shop.avatar.url : shop.avatar;

    const cleanPath = avatarPath.replace(/^\/?(uploads\/)?/, "");

    const baseUrl = backend_url.replace("/api/v2", "");

    return `${baseUrl}uploads/${cleanPath}`;
  };

  const getPlaceholderCount = () => {
    return Math.max(0, 3 - topShops.length);
  };

  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-10 px-4">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-[#f4f0dd] py-10 px-4 sm:px-8 md:px-16 my-12 rounded-xl">
      <h2 className="text-center text-2xl font-semibold text-[#550265] mb-8">
        Featured Shops
      </h2>

      <div className="flex flex-wrap justify-center gap-6 px-4 md:gap-8 lg:justify-between">
        {loading ? (
          <>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex flex-col items-center justify-center w-full sm:w-auto"
              >
                <div className="w-64 h-48 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="h-5 w-32 bg-gray-200 animate-pulse mt-3 rounded"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            {topShops.map((shop) => (
              <Link
                to={`/shop-preview/${shop._id}`}
                key={shop._id}
                className="flex flex-col items-center justify-center w-full sm:w-auto group"
              >
                <div className="relative overflow-hidden rounded-lg bg-white p-4 shadow-md transition-transform duration-300 group-hover:shadow-lg group-hover:scale-105">
                  <img
                    src={getAvatarUrl(shop)}
                    alt={`${shop.name} Logo`}
                    className="w-64 h-48 object-contain"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 text-center">
                  <h3 className="font-medium text-[#550265]">{shop.name}</h3>
                  <p className="text-sm text-gray-600">
                    {shop.productCount} Products
                  </p>
                </div>
              </Link>
            ))}

            {Array.from({ length: getPlaceholderCount() }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="flex flex-col items-center justify-center w-full sm:w-auto opacity-50"
              >
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="w-64 h-48 bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-400">Shop Coming Soon</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-400">
                  Join our marketplace
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Support;
