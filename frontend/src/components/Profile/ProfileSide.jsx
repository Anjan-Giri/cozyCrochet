import React from "react";
import { RxPerson } from "react-icons/rx";
import { CiShoppingBasket } from "react-icons/ci";
import { AiOutlineLogout, AiOutlineMessage } from "react-icons/ai";
// import { MdOutlinePayments } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GiVelociraptorTracks } from "react-icons/gi";
import { RiRefund2Line } from "react-icons/ri";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const menuItems = [
  { id: 1, label: "Profile", Icon: RxPerson },
  { id: 2, label: "Orders", Icon: CiShoppingBasket },
  { id: 3, label: "Refunds", Icon: RiRefund2Line },
  { id: 4, label: "Inbox", Icon: AiOutlineMessage, route: "/inbox" },
  { id: 5, label: "Tracking", Icon: GiVelociraptorTracks },
  //   { id: 6, label: "Payments", Icon: MdOutlinePayments },
  { id: 6, label: "Address", Icon: FaRegAddressCard },
  { id: 7, label: "Log Out", Icon: AiOutlineLogout },
];

const ProfileSide = ({ active, setActive }) => {
  const navigate = useNavigate();

  const handleClick = (id, route) => {
    // If it's the logout item (id 7), call logoutHandler
    if (id === 7) {
      logoutHandler();
    } else {
      // For other items, set active and navigate if route exists
      setActive(id);
      if (route) navigate(route);
    }
  };

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="w-full bg-white shadow-md p-6 pt-8 pb-1">
      {menuItems.map(({ id, label, Icon, route }) => (
        <div
          key={id}
          className="flex items-center w-full mb-10 cursor-pointer text-[#4c035f]"
          onClick={() => handleClick(id, route)}
        >
          <Icon
            size={25}
            className={`${
              active === id ? "text-[#a92121] font-semibold" : ""
            } sm:size-[25px]`}
          />
          <span
            className={`pl-6 ${
              active === id ? "text-[#4c035f] font-semibold" : ""
            } 800px:block hidden`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProfileSide;
