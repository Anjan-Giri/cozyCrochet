import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import axios from "axios";
import { loadSeller, updateSellerInfo } from "../../redux/actions/user";
import { toast } from "react-toastify";

const ShopSettings = () => {
  const { seller, error, successMessage } = useSelector(
    (state) => state.seller
  );
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(
    seller && seller.description ? seller.description : ""
  );
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [zipCode, setZipcode] = useState(seller && seller.zipCode);
  const [hasUpdated, setHasUpdated] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    // Clear messages when component mounts
    dispatch({ type: "clearMessages" });
    dispatch({ type: "clearErrors" });
  }, [dispatch]);

  useEffect(() => {
    if (error && hasUpdated) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
      setHasUpdated(false);
    }

    if (successMessage && hasUpdated) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
      setHasUpdated(false);
    }
  }, [error, successMessage, dispatch, hasUpdated]);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(file);
    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.put(`${server}/shop/update-shop-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      dispatch(loadSeller());
      toast.success("Avatar updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Avatar update failed");
    }
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    setHasUpdated(true);
    dispatch(
      updateSellerInfo(name, description, address, phoneNumber, zipCode)
    );
  };

  const getAvatarUrl = () => {
    if (!seller || !seller.avatar) return "/default-avatar.png";

    if (typeof seller.avatar === "object" && seller.avatar.url) {
      return seller.avatar.url.startsWith("http")
        ? seller.avatar.url
        : `${backend_url
            .replace("/api/v2", "")
            .replace(/\/$/, "")}/uploads/${seller.avatar.url.replace(
            /^\/?(uploads\/)?/,
            ""
          )}`;
    }

    if (typeof seller.avatar === "string") {
      return seller.avatar.startsWith("http")
        ? seller.avatar
        : `${backend_url
            .replace("/api/v2", "")
            .replace(/\/$/, "")}/uploads/${seller.avatar.replace(
            /^\/?(uploads\/)?/,
            ""
          )}`;
    }

    return "/default-avatar.png";
  };

  return (
    <div className="w-full px-5">
      <h1 className="text-[25px] text-center font-semibold text-[#50007a] pb-4">
        Shop Settings
      </h1>
      <div className="w-full flex flex-col items-center">
        <div className="relative">
          <img
            src={avatar ? URL.createObjectURL(avatar) : getAvatarUrl()}
            alt="avatar"
            className="w-[100px] h-[100px] rounded-full object-cover border-2 border-[#ece3e3]"
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
          <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={handleImage}
            />
            <label htmlFor="image" className="cursor-pointer">
              <AiOutlineCamera />
            </label>
          </div>
        </div>

        <form
          onSubmit={updateHandler}
          aria-required={true}
          className="w-full flex flex-col items-center"
        >
          <div className="w-full 800px:flex block pb-3">
            <div className="w-[100%] 800px:w-[50%] px-8">
              <label className="block text-sm font-medium text-[#50007a] py-2">
                Shop Name
              </label>
              <input
                type="text"
                className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-[100%] 800px:w-[50%] px-8">
              <label className="block text-sm font-medium text-[#50007a] py-2">
                Shop Description
              </label>
              <input
                type="text"
                className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full 800px:flex block pb-3">
            <div className="w-[100%] 800px:w-[50%] px-8">
              <label className="block text-sm font-medium text-[#50007a] py-2">
                Address
              </label>
              <input
                type="text"
                className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="w-[100%] 800px:w-[50%] px-8">
              <label className="block text-sm font-medium text-[#50007a] py-2">
                Phone Number
              </label>
              <input
                type="number"
                className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full 800px:w-[50%] px-8 pb-3">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Zip Code
            </label>
            <input
              type="number"
              className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              value={zipCode}
              onChange={(e) => setZipcode(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center">
            <input
              type="submit"
              value="Update"
              required
              className="w-[210px] h-[50px] text-center text-[#50007a] border-2 font-semibold border-[#50007a] rounded-md cursor-pointer mt-10 hover:border-red-900 hover:text-red-900 hover:scale-105 duration-300"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
