import React, { useEffect, useState } from "react";
import { backend_url, server } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import styles from "../../styles/styles";

import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { MdOutlineTrackChanges } from "react-icons/md";
import {
  deleteUserAddress,
  updateUserAddress,
  updateUserInfo,
} from "../../redux/actions/user";
import { toast } from "react-toastify";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { Country, State } from "country-state-city";
import { getAllUserOrders } from "../../redux/actions/order";

const ProfileC = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);

  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, dispatch, successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInfo(email, password, phoneNumber, name));
  };

  const getAvatarUrl = () => {
    if (!user || !user.avatar) return "/default-avatar.png";

    // If avatar is an object with a URL property
    if (typeof user.avatar === "object" && user.avatar.url) {
      return user.avatar.url.startsWith("http")
        ? user.avatar.url
        : `${backend_url
            .replace("/api/v2", "")
            .replace(/\/$/, "")}/uploads/${user.avatar.url.replace(
            /^\/?(uploads\/)?/,
            ""
          )}`;
    }

    // If avatar is a string
    if (typeof user.avatar === "string") {
      return user.avatar.startsWith("http")
        ? user.avatar
        : `${backend_url
            .replace("/api/v2", "")
            .replace(/\/$/, "")}/uploads/${user.avatar.replace(
            /^\/?(uploads\/)?/,
            ""
          )}`;
    }

    return "/default-avatar.png";
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    await axios
      .put(`${server}/user/update-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="w-full">
      {
        // profile
        active === 1 && (
          <>
            <div className="flex items-center justify-center w-full">
              <div className="relative">
                <img
                  src={getAvatarUrl()}
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
            </div>
            <div className="w-full px-6 pt-12">
              <form onSubmit={handleSubmit} aria-required={true}>
                <div className="w-full 800px:flex block pb-3">
                  <div className=" w-[100%] 800px:w-[50%] px-8">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className=" w-[100%] 800px:w-[50%] px-8">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="w-full 800px:flex block pb-3">
                  <div className=" w-[100%] 800px:w-[50%] px-8">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      Contact
                    </label>
                    <input
                      type="number"
                      className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <div className=" w-[100%] 800px:w-[50%] px-8">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      Enter Password
                    </label>
                    <input
                      type="password"
                      className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
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
          </>
        )
      }

      {
        // order
        active === 2 && (
          <div>
            <AllOrders />
          </div>
        )
      }
      {
        // refund
        active === 3 && (
          <div>
            <AllRefunds />
          </div>
        )
      }

      {
        // password
        active === 4 && (
          <div>
            <ChangePassword />
          </div>
        )
      }

      {
        // track
        active === 5 && (
          <div>
            <TrackOrder />
          </div>
        )
      }
      {
        // address
        active === 6 && (
          <div>
            <Address />
          </div>
        )
      }
    </div>
  );
};

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUserOrders(user._id));
  }, [dispatch]);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      // Remove cellClassName and use a custom cell rendering if needed
      renderCell: (params) => {
        const status = params.row.status;
        return (
          <span className={status === "Delivered" ? "greenColor" : "redColor"}>
            {status}
          </span>
        );
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/user/order/${params.row.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];

  const rows = orders.map((item) => ({
    id: item._id,
    itemsQty: item.cart.length,
    total: `Nrs ${item.totalPrice}`,
    status: item.status,
  }));

  return (
    <div className="pl-12 pt-4" style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const AllRefunds = () => {
  const orders = [
    {
      _id: "764dgsdhw743248932",
      orderItems: [
        {
          name: "Crochet Teddy",
        },
      ],
      totalPrice: 20000,
      orderStatus: "Processing",
    },
  ];

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => {
        const status = params.row.status;
        return (
          <span className={status === "Delivered" ? "greenColor" : "redColor"}>
            {status}
          </span>
        );
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "actions",
      headerName: "",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/user/order/${params.row.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];

  const rows = orders.map((item) => ({
    id: item._id,
    itemsQty: item.orderItems.length,
    total: "Nrs " + item.totalPrice,
    status: item.orderStatus, // Changed from item.status to item.orderStatus
  }));

  return (
    <div className="pl-12 pt-4" style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const TrackOrder = () => {
  const orders = [
    {
      _id: "764dgsdhw743248932",
      orderItems: [
        {
          name: "Crochet Teddy",
        },
      ],
      totalPrice: 20000,
      orderStatus: "Processing",
    },
  ];

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => {
        const status = params.row.status;
        return (
          <span className={status === "Delivered" ? "greenColor" : "redColor"}>
            {status}
          </span>
        );
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "",
      headerName: "",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/user/order/${params.row.id}`}>
            <Button>
              <MdOutlineTrackChanges size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];

  const rows = orders.map((item) => ({
    id: item._id,
    itemsQty: item.orderItems.length,
    total: "Nrs " + item.totalPrice,
    status: item.orderStatus, // Changed from item.status to item.orderStatus
  }));

  return (
    <div className="pl-12 pt-4">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePasswordHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/user/update-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="w-full px-5">
      <h1 className="text-[25px] text-center font-semibold text-[#50007a] pb-4">
        Change Password
      </h1>
      <div className="w-full">
        <form
          onSubmit={changePasswordHandler}
          aria-required={true}
          className="flex flex-col items-center"
        >
          <div className="w-full 800px:w-[50%] px-8 pb-3">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Enter Old Password
            </label>
            <input
              type="password"
              className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="w-full 800px:w-[50%] px-8 pb-3">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Enter New Password
            </label>
            <input
              type="password"
              className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="w-full 800px:w-[50%] px-8 pb-3">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("NP");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Home",
    },
    {
      name: "Office",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      dispatch(
        updateUserAddress(
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType
        )
      );
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode(null);
      setAddressType("");
    }
  };

  const handleDelete = (item) => {
    if (item && item._id) {
      dispatch(deleteUserAddress(item._id));
    } else {
      toast.error("Invalid address selected");
    }
  };

  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center ">
          <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-center text-[25px] font-Poppins">
              Add New Address
            </h1>
            <div className="w-full">
              <form aria-required onSubmit={handleSubmit} className="w-full">
                <div className="w-full block p-4 flex-col items-center justify-center">
                  {/* <div className="w-full pb-3">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      Country
                    </label>
                    <select
                      name=""
                      id=""
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="block w-[95%] px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="" className="block pb-2">
                        Choose your country
                      </option>
                      {Country &&
                        Country.getAllCountries().map((item) => (
                          <option
                            className="block pb-2"
                            key={item.isoCode}
                            value={item.isoCode}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div> */}
                  <div className="w-full pb-3">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value="Nepal"
                      className="block w-[95%] px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      disabled
                    />
                    <input type="hidden" value={country} />
                  </div>
                  <div className="w-full pb-3">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      Choose your State
                    </label>
                    <select
                      name=""
                      id=""
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="block w-[95%] px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="" className="block pb-2">
                        Choose your city
                      </option>
                      {State &&
                        State.getStatesOfCountry(country).map((item) => (
                          <option
                            className="block pb-2"
                            key={item.isoCode}
                            value={item.isoCode}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="w-full pb-3">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      City
                    </label>
                    <input
                      type="address"
                      className="block w-[95%] px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-3">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      Street / Landmarks / Area
                    </label>
                    <input
                      type="address"
                      className="block w-[95%] px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-3">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      Zip Code
                    </label>
                    <input
                      type="number"
                      className="block w-[95%] px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-3">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      Address Type
                    </label>
                    <select
                      name=""
                      id=""
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="block w-[95%] px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="" className="block pb-2">
                        Choose your Address Type
                      </option>
                      {addressTypeData &&
                        addressTypeData.map((item) => (
                          <option
                            className="block pb-2"
                            key={item.name}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-center">
                    <input
                      type="submit"
                      value="Add Address"
                      required
                      className="w-[210px] h-[50px] text-center text-[#50007a] border-2 font-semibold border-[#50007a] rounded-md cursor-pointer mt-10 hover:border-red-900 hover:text-red-900 hover:scale-105 duration-300"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
          My Addresses
        </h1>
        <div
          className={`${styles.button} !rounded-md`}
          onClick={() => setOpen(true)}
        >
          <span className="text-[#fff]">Add New</span>
        </div>
      </div>
      <br />
      {user &&
        user.addresses.map((item, index) => (
          <div
            className="w-full bg-white h-min 800px:h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-5"
            key={index}
          >
            <div className="flex items-center">
              <h5 className="pl-5 font-[600]">{item.addressType}</h5>
            </div>
            <div className="pl-8 flex items-center">
              <h6 className="text-[12px] 800px:text-[unset]">
                {item.address1}, {item.address2}
              </h6>
            </div>
            <div className="pl-8 flex items-center">
              <h6 className="text-[12px] 800px:text-[unset]">
                {user && user.phoneNumber}
              </h6>
            </div>
            <div className="min-w-[10%] flex items-center justify-between pl-8">
              <AiOutlineDelete
                size={25}
                className="cursor-pointer"
                onClick={() => handleDelete(item)}
              />
            </div>
          </div>
        ))}

      {user && user.addresses.length === 0 && (
        <h5 className="text-center pt-8 text-[18px]">No saved address!!!</h5>
      )}
    </div>
  );
};

export default ProfileC;
