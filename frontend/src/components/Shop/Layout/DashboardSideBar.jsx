import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineCreate, MdOutlineCreateNewFolder } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { BiSolidOffer } from "react-icons/bi";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaShoppingBasket } from "react-icons/fa";
import { TbPackages } from "react-icons/tb";
import { RiCoupon3Line } from "react-icons/ri";

const menuItems = [
  {
    id: 1,
    label: "Dashboard",
    path: "/dashboard",
    icon: <LuLayoutDashboard size={25} />,
  },
  {
    id: 2,
    label: "All Orders",
    path: "/dashboard-orders",
    icon: <TbPackages size={25} />,
  },
  {
    id: 3,
    label: "All Products",
    path: "/dashboard-products",
    icon: <FaShoppingBasket size={25} />,
  },
  {
    id: 4,
    label: "Create Product",
    path: "/dashboard-create-product",
    icon: <MdOutlineCreateNewFolder size={25} />,
  },
  {
    id: 5,
    label: "All Offers",
    path: "/dashboard-offer",
    icon: <BiSolidOffer size={25} />,
  },
  {
    id: 6,
    label: "Create Offer",
    path: "/dashboard-create-offer",
    icon: <MdOutlineCreate size={25} />,
  },
  {
    id: 7,
    label: "Discount Codes",
    path: "/dashboard-coupon",
    icon: <RiCoupon3Line size={25} />,
  },
  {
    id: 8,
    label: "Settings",
    path: "/settings",
    icon: <CiSettings size={30} />,
  },
];

const DashboardSideBar = ({ active }) => {
  return (
    <div className="w-full min-h-screen bg-white shadow-md sticky top-0 left-0 z-10">
      {menuItems.map((item) => (
        <div key={item.id} className="w-full flex items-center p-4">
          <Link to={item.path} className="w-full flex items-center">
            <div
              className={`${
                active === item.id ? "text-[#a92121] font-semibold" : ""
              } sm:size-[25px]`}
            >
              {item.icon}
            </div>
            <h5
              className={`pl-6 ${
                active === item.id ? "text-[#4c035f] font-semibold" : ""
              } 800px:block hidden`}
            >
              {item.label}
            </h5>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DashboardSideBar;
