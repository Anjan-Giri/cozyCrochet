import React from "react";
import { RxPerson } from "react-icons/rx";
import { CiShoppingBasket } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";
import { FaRegAddressCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GiVelociraptorTracks } from "react-icons/gi";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { IoKeySharp } from "react-icons/io5";

const menuItems = [
  { id: 1, label: "Profile", Icon: RxPerson },
  { id: 2, label: "Orders", Icon: CiShoppingBasket },
  // { id: 3, label: "Refunds", Icon: RiRefund2Line },
  { id: 3, label: "Password", Icon: IoKeySharp },
  { id: 4, label: "Tracking", Icon: GiVelociraptorTracks },
  //   { id: 6, label: "Payments", Icon: MdOutlinePayments },
  { id: 5, label: "Address", Icon: FaRegAddressCard },
  { id: 6, label: "Log Out", Icon: AiOutlineLogout },
];

const ProfileSide = ({ active, setActive }) => {
  const navigate = useNavigate();

  const handleClick = (id, route) => {
    if (id === 6) {
      logoutHandler();
    } else {
      setActive(id);
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
    <div className="w-full h-full bg-white shadow-md p-6 pt-8 pb-1">
      {menuItems.map(({ id, label, Icon }) => (
        <div
          key={id}
          className="flex items-center w-full mb-10 cursor-pointer text-[#4c035f]"
          onClick={() => handleClick(id)}
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
