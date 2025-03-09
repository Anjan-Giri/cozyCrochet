import React, { useState } from "react";
import { backend_url } from "../../server";
import { useSelector } from "react-redux";
import { AiOutlineArrowRight, AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";

import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { MdOutlineTrackChanges } from "react-icons/md";

const ProfileC = ({ active }) => {
  const { user } = useSelector((state) => state.user);

  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNo, setPhoneNo] = useState();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
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
                  <AiOutlineCamera />
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
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                    />
                  </div>
                  <div className=" w-[100%] 800px:w-[50%] px-8">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      ZIP Code
                    </label>
                    <input
                      type="number"
                      className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="w-full 800px:flex block pb-3">
                  <div className=" w-[100%] 800px:w-[50%] px-8">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      Address 1
                    </label>
                    <input
                      type="address"
                      className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>
                  <div className=" w-[100%] 800px:w-[50%] px-8">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      Address 2
                    </label>
                    <input
                      type="address"
                      className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
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
    itemsQty: item.orderItems.length,
    total: `Nrs ${item.totalPrice}`,
    status: item.orderStatus,
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

const Address = () => {
  return <div className="w-full flex items-center justify-center">Address</div>;
};

export default ProfileC;

// import React from "react";
// import { backend_url } from "../../server";
// import { useSelector } from "react-redux";

// const ProfileC = ({ active }) => {
//   const { user, loading, isAuthenticated } = useSelector((state) => state.user);

//   // Extensive logging to understand the state
//   console.log("User state:", { user, loading, isAuthenticated });

//   // Handle loading state
//   if (loading) {
//     return (
//       <div className="w-full flex justify-center items-center">
//         <div className="w-[40px] h-[40px] rounded-full bg-gray-200 animate-pulse"></div>
//       </div>
//     );
//   }

//   // Check if user is authenticated and active is 1
//   if (!isAuthenticated || active !== 1 || !user) {
//     return null;
//   }

//   // More defensive avatar handling
//   const avatarUrl =
//     user && user.avatar && user.avatar.url
//       ? `${backend_url}${user.avatar.url}`
//       : "/default-avatar.png";

//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-center w-full">
//         <div className="relative">
//           <img
//             src={avatarUrl}
//             alt={user?.name || "User avatar"}
//             className="w-[40px] h-[40px] rounded-full object-cover"
//             onError={(e) => {
//               console.error("Image load error");
//               e.target.onerror = null;
//               e.target.src = "/default-avatar.png";
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileC;
