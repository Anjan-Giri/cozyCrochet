import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiSolidOffer } from "react-icons/bi";
import { RiCoupon3Line } from "react-icons/ri";
import { FaShoppingBasket } from "react-icons/fa";
import { TbPackages } from "react-icons/tb";
import logo from "../../../assests/logo.png";
import { backend_url } from "../../../server";
import { IoSettings } from "react-icons/io5";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  const [imageError, setImageError] = useState(false);

  const getAvatarUrl = (avatar) => {
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
  };

  const avatarUrl = imageError
    ? "/default-avatar.png"
    : getAvatarUrl(seller?.avatar);

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/">
          <img src={logo} width={60} alt="logo" />
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <div className="cursor-pointer relative mr-[15px] hover:scale-105 duration-200">
            <Link to="/dashboard-coupon" className="800px:block hidden">
              {/* <AiOutlineGift */}
              <RiCoupon3Line
                size={25}
                className="mx-5 cursor-pointer text-purple-800"
              />
            </Link>
          </div>
          <div className="cursor-pointer relative mr-[15px] hover:scale-105 duration-200">
            <Link to="/dashboard-offer" className="800px:block hidden">
              <BiSolidOffer
                size={25}
                className="mx-5 cursor-pointer text-purple-800"
              />
            </Link>
          </div>
          <div className="cursor-pointer relative mr-[15px] hover:scale-105 duration-200">
            <Link to="/dashboard-products" className="800px:block hidden">
              <FaShoppingBasket
                size={25}
                className="mx-5 cursor-pointer text-purple-800"
              />
            </Link>
          </div>
          <div className="cursor-pointer relative mr-[15px] hover:scale-105 duration-200">
            <Link to="/dashboard-orders" className="800px:block hidden">
              <TbPackages
                size={25}
                className="mx-5 cursor-pointer text-purple-800"
              />
            </Link>
          </div>
          <div className="cursor-pointer relative mr-[15px] hover:scale-105 duration-200">
            <Link to="/dashboard-messages" className="800px:block hidden">
              <IoSettings
                size={25}
                className="mx-5 cursor-pointer text-purple-800"
              />
            </Link>
          </div>
          <div className="cursor-pointer relative mr-[15px] hover:scale-105 duration-200">
            <Link to={`/shop/${seller._id}`}>
              <img
                src={avatarUrl}
                alt="Shop Avatar"
                className="w-[40px] h-[40px] rounded-full object-cover"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
