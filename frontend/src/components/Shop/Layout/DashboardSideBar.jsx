// import React from "react";
// import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
// import { FiPackage, FiShoppingBag } from "react-icons/fi";
// import { MdOutlineLocalOffer } from "react-icons/md";
// import { RxDashboard } from "react-icons/rx";
// import { VscNewFile } from "react-icons/vsc";
// import { CiMoneyBill, CiSettings } from "react-icons/ci";
// import { Link } from "react-router-dom";
// import { BiMessageSquareDetail } from "react-icons/bi";
// import { HiOutlineReceiptRefund } from "react-icons/hi";

// const DashboardSideBar = ({ active }) => {
//   return (
//     <div>
//       <div className="w-full h-[110vh] bg-white shadow-md sticky top-0 left-0 z-10">
//         {/* single item */}
//         <div className="w-full flex items-center p-4">
//           <Link to="/dashboard" className="w-full flex items-center">
//             <RxDashboard
//               size={30}
//               color={`${
//                 active === 1 ? "text-[#a92121] font-semibold" : ""
//               } sm:size-[25px]}`}
//             />
//             <h5
//               className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
//                 active === 1 ? "text-[#4c035f] font-semibold" : ""
//               } 800px:block hidden"
//               }`}
//             >
//               Dashboard
//             </h5>
//           </Link>
//         </div>

//         <div className="w-full flex items-center p-4">
//           <Link to="/dashboard-orders" className="w-full flex items-center">
//             <FiShoppingBag
//               size={30}
//               color={`${active === 2 ? "crimson" : "#555"}`}
//             />
//             <h5
//               className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
//                 active === 2 ? "text-[crimson]" : "text-[#555]"
//               }`}
//             >
//               All Orders
//             </h5>
//           </Link>
//         </div>

//         <div className="w-full flex items-center p-4">
//           <Link to="/dashboard-products" className="w-full flex items-center">
//             <FiPackage
//               size={30}
//               color={`${active === 3 ? "crimson" : "#555"}`}
//             />
//             <h5
//               className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
//                 active === 3 ? "text-[crimson]" : "text-[#555]"
//               }`}
//             >
//               All Products
//             </h5>
//           </Link>
//         </div>

//         <div className="w-full flex items-center p-4">
//           <Link
//             to="/dashboard-create-product"
//             className="w-full flex items-center"
//           >
//             <AiOutlineFolderAdd
//               size={30}
//               color={`${active === 4 ? "crimson" : "#555"}`}
//             />
//             <h5
//               className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
//                 active === 4 ? "text-[crimson]" : "text-[#555]"
//               }`}
//             >
//               Create Product
//             </h5>
//           </Link>
//         </div>

//         <div className="w-full flex items-center p-4">
//           <Link to="/dashboard-events" className="w-full flex items-center">
//             <MdOutlineLocalOffer
//               size={30}
//               color={`${active === 5 ? "crimson" : "#555"}`}
//             />
//             <h5
//               className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
//                 active === 5 ? "text-[crimson]" : "text-[#555]"
//               }`}
//             >
//               All Events
//             </h5>
//           </Link>
//         </div>

//         <div className="w-full flex items-center p-4">
//           <Link
//             to="/dashboard-create-event"
//             className="w-full flex items-center"
//           >
//             <VscNewFile
//               size={30}
//               color={`${active === 6 ? "crimson" : "#555"}`}
//             />
//             <h5
//               className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
//                 active === 6 ? "text-[crimson]" : "text-[#555]"
//               }`}
//             >
//               Create Event
//             </h5>
//           </Link>
//         </div>

//         <div className="w-full flex items-center p-4">
//           <Link
//             to="/dashboard-withdraw-money"
//             className="w-full flex items-center"
//           >
//             <CiMoneyBill
//               size={30}
//               color={`${active === 7 ? "crimson" : "#555"}`}
//             />
//             <h5
//               className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
//                 active === 7 ? "text-[crimson]" : "text-[#555]"
//               }`}
//             >
//               Withdraw Money
//             </h5>
//           </Link>
//         </div>

//         <div className="w-full flex items-center p-4">
//           <Link to="/dashboard-messages" className="w-full flex items-center">
//             <BiMessageSquareDetail
//               size={30}
//               color={`${active === 8 ? "crimson" : "#555"}`}
//             />
//             <h5
//               className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
//                 active === 8 ? "text-[crimson]" : "text-[#555]"
//               }`}
//             >
//               Shop Inbox
//             </h5>
//           </Link>
//         </div>

//         <div className="w-full flex items-center p-4">
//           <Link to="/dashboard-coupouns" className="w-full flex items-center">
//             <AiOutlineGift
//               size={30}
//               color={`${active === 9 ? "crimson" : "#555"}`}
//             />
//             <h5
//               className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
//                 active === 9 ? "text-[crimson]" : "text-[#555]"
//               }`}
//             >
//               Discount Codes
//             </h5>
//           </Link>
//         </div>

//         <div className="w-full flex items-center p-4">
//           <Link to="/dashboard-refunds" className="w-full flex items-center">
//             <HiOutlineReceiptRefund
//               size={30}
//               color={`${active === 10 ? "crimson" : "#555"}`}
//             />
//             <h5
//               className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
//                 active === 10 ? "text-[crimson]" : "text-[#555]"
//               }`}
//             >
//               Refunds
//             </h5>
//           </Link>
//         </div>

//         <div className="w-full flex items-center p-4">
//           <Link to="/settings" className="w-full flex items-center">
//             <CiSettings
//               size={30}
//               color={`${active === 11 ? "crimson" : "#555"}`}
//             />
//             <h5
//               className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
//                 active === 11 ? "text-[crimson]" : "text-[#555]"
//               }`}
//             >
//               Settings
//             </h5>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardSideBar;

import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import {
  MdOutlineCreate,
  MdOutlineCreateNewFolder,
  MdOutlineLocalOffer,
} from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import {
  CiDiscount1,
  CiMoneyBill,
  CiMoneyCheck1,
  CiSettings,
} from "react-icons/ci";
import { BiMessageSquareDetail, BiSolidOffer } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

import { LuLayoutDashboard } from "react-icons/lu";
import { FaShoppingBasket } from "react-icons/fa";
import { TbPackages } from "react-icons/tb";
import { TiMessages } from "react-icons/ti";

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
    label: "Withdraw Money",
    path: "/dashboard-withdraw-money",
    icon: <CiMoneyCheck1 size={25} />,
  },
  {
    id: 8,
    label: "Shop Inbox",
    path: "/dashboard-messages",
    icon: <TiMessages size={25} />,
  },
  {
    id: 9,
    label: "Discount Codes",
    path: "/dashboard-coupon",
    icon: <CiDiscount1 size={25} />,
  },
  {
    id: 10,
    label: "Refunds",
    path: "/dashboard-refunds",
    icon: <HiOutlineReceiptRefund size={25} />,
  },
  {
    id: 11,
    label: "Settings",
    path: "/settings",
    icon: <CiSettings size={30} />,
  },
];

const DashboardSideBar = ({ active }) => {
  return (
    <div className="w-full h-auto bg-white shadow-md sticky top-0 left-0 z-10">
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
