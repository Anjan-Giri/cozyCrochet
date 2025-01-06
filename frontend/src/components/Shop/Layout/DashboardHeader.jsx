import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiSolidOffer } from "react-icons/bi";
import { RiCoupon3Line } from "react-icons/ri";
import { FaShoppingBasket } from "react-icons/fa";
import { TbPackages } from "react-icons/tb";
import { TiMessages } from "react-icons/ti";
import logo from "../../../assests/logo.webp";
import { backend_url } from "../../../server";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/dashboard">
          <img src={logo} width={60} alt="logo" />
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <div className="cursor-pointer relative mr-[15px] hover:scale-105 duration-200">
            <Link to="/dashboard/coupons" className="800px:block hidden">
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
              <TiMessages
                size={25}
                className="mx-5 cursor-pointer text-purple-800"
              />
            </Link>
          </div>
          <div className="cursor-pointer relative mr-[15px] hover:scale-105 duration-200">
            <Link to={`/shop/${seller._id}`}>
              <img
                src={`${backend_url}${seller.avatar}`}
                alt=""
                className="w-[40px] h-[40px] rounded-full object-cover"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
