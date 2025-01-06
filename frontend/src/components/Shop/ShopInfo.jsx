import React from "react";
import { useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { Link } from "react-router-dom";
import axios from "axios";

const ShopInfo = ({ isOwner }) => {
  const { seller } = useSelector((state) => state.seller);

  const logoutHandler = async () => {
    axios.get(`${server}/shop/logout`, {
      withCredentials: true,
    });
    window.location.reload();
  };

  return (
    <div>
      <div className="w-full py-6">
        <div className="w-full flex item-center justify-center">
          <img
            src={`${backend_url}${seller?.avatar}`}
            alt="shop"
            className="w-[150px] h-[150px] object-cover rounded-full"
          />
        </div>
        <h3 className="text-center py-2 text-[20px] text-[#550265] font-semibold">
          {seller.name}
        </h3>
        <p className="text-[16px] text-[#3b0057] p-[10px] flex items-center">
          {/* {seller.description} */} Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Quasi, corporis maiores repudiandae modi illum
          tenetur consequuntur assumenda vel qui. Cupiditate, quisquam quidem
          reiciendis quas aut at consequuntur inventore tempora dolorum.
        </p>
      </div>
      <div className="flex items-center justify-between px-8">
        <div className="p-3">
          <h5 className="font-[600] text-[#480000]">Address</h5>
          <h4 className="text-[#440044]">{seller.address}</h4>
        </div>
        <div className="p-3">
          <h5 className="font-[600] text-[#480000]">Phone Number</h5>
          <h4 className="text-[#440044]">{seller.phoneNumber}</h4>
        </div>
        <div className="p-3">
          <h5 className="font-[600] text-[#480000]">Total Products</h5>
          <h4 className="text-[#440044]">
            {/* {products && products.length} */} 10
          </h4>
        </div>
        <div className="p-3">
          <h5 className="font-[600] text-[#480000]">Ratings</h5>
          <h4 className="text-[#440044]">{/* {averageRating}/5 */} 4</h4>
        </div>
        <div className="p-3">
          <h5 className="font-[600] text-[#480000]">Joined On</h5>
          <h4 className="text-[#440044]">{seller.createdAt.slice(0, 10)}</h4>
        </div>
      </div>
      {isOwner && (
        <div className="py-3 px-8 flex flex-col items-end">
          <Link
            to="/settings"
            className="w-[25%] bg-gradient-to-r from-gray-900 to-gray-600 text-white font-bold hover:cursor-pointer hover:bg-gradient-to-l hover:from-gray-900 hover:to-gray-600 hover:text-gray-200 duration-300 ease-in-out rounded-lg flex items-center py-3 px-4 justify-center my-2"
          >
            <span className="text-white">Edit Shop</span>
          </Link>
          <Link
            className="w-[25%] bg-gradient-to-r from-gray-900 to-gray-600 text-white font-bold hover:cursor-pointer hover:bg-gradient-to-l hover:from-gray-900 hover:to-gray-600 hover:text-gray-200 duration-300 ease-in-out rounded-lg flex items-center py-3 px-4 justify-center my-2"
            onClick={logoutHandler}
          >
            <span className="text-white">Log Out</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ShopInfo;
