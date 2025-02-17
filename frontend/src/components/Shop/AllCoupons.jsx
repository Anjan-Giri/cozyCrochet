// import React, { useEffect, useState } from "react";
// import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import Loader from "../Layout/Loader";
// import { DataGrid } from "@mui/x-data-grid";
// import { Button } from "@mui/material";
// import axios from "axios";
// import styles from "../../styles/styles";
// import { toast } from "react-toastify";
// import { server } from "../../server";
// import { RxCross1 } from "react-icons/rx";

// const AllCoupons = () => {
//   const [open, setOpen] = useState(false);
//   const [name, setName] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [coupons, setCoupons] = useState([]);
//   const [minAmount, setMinAmount] = useState(null);
//   const [maxAmount, setMaxAmount] = useState(null);
//   const [selectedProducts, setSelectedProducts] = useState(null);
//   const [value, setValue] = useState(null);
//   const { seller } = useSelector((state) => state.seller);
//   const { products } = useSelector((state) => state.products);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     setIsLoading(true);
//     axios
//       .get(`${server}/code/get-code/${seller._id}`, {
//         withCredentials: true,
//       })
//       .then((res) => {
//         setIsLoading(false);
//         setCoupons(res.data);
//       })
//       .catch((error) => {
//         setIsLoading(false);
//       });
//   }, [dispatch]);

//   const handleDelete = async (id) => {
//     axios
//       .delete(`${server}/code/delete-coupon/${id}`, { withCredentials: true })
//       .then((res) => {
//         toast.success("Coupon code deleted succesfully!");
//       });
//     window.location.reload();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     await axios
//       .post(
//         `${server}/code/create-code`,
//         {
//           name,
//           minAmount,
//           maxAmount,
//           selectedProducts,
//           value,
//           shopId: seller._id,
//         },
//         { withCredentials: true }
//       )
//       .then((res) => {
//         toast.success("Coupon code created successfully!");
//         setOpen(false);
//         window.location.reload();
//       })
//       .catch((error) => {
//         toast.error(error.response.data.message);
//       });
//   };

//   const columns = [
//     { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
//     {
//       field: "name",
//       headerName: "Name",
//       minWidth: 180,
//       flex: 1.4,
//     },
//     {
//       field: "price",
//       headerName: "Price",
//       minWidth: 100,
//       flex: 0.6,
//     },

//     {
//       field: "Delete",
//       flex: 0.8,
//       minWidth: 120,
//       headerName: "",
//       type: "number",
//       sortable: false,
//       renderCell: (params) => {
//         return (
//           <div className="flex items-center justify-center">
//             <Button onClick={() => handleDelete(params.id)}>
//               <AiOutlineDelete
//                 size={20}
//                 className="bg-red-500 flex justify-center items-center rounded-full w-8 h-8 py-2 text-white font-semibold hover:bg-white hover:text-red-500 hover:scale-125 duration-300"
//               />
//             </Button>
//           </div>
//         );
//       },
//     },
//   ];

//   const row = [];

//   coupons &&
//     coupons.forEach((item) => {
//       row.push({
//         id: item._id,
//         name: item.name,
//         price: item.value + " %",
//       });
//     });

//   return (
//     <>
//       {isLoading ? (
//         <Loader />
//       ) : (
//         <div className="w-full mx-8 pt-1 mt-10 bg-white">
//           <div className="w-full flex justify-end">
//             <div
//               className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
//               onClick={() => setOpen(true)}
//             >
//               <span className="text-white">Create Coupon Code</span>
//             </div>
//           </div>
//           <DataGrid
//             rows={row}
//             columns={columns}
//             pageSize={10}
//             disableSelectionOnClick
//             autoHeight
//           />
//           {open && (
//             <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
//               <div className="w-[90%] 800px:w-[40%] h-[80vh] bg-white rounded-md shadow p-4">
//                 <div className="w-full flex justify-end">
//                   <RxCross1
//                     size={30}
//                     className="cursor-pointer"
//                     onClick={() => setOpen(false)}
//                   />
//                 </div>
//                 <h5 className="text-[30px] font-Poppins text-center">
//                   Create Coupon code
//                 </h5>
//                 {/* /* create coupoun code */}
//                 <form onSubmit={handleSubmit} aria-required={true}>
//                   <br />
//                   <div>
//                     <label className="pb-2">
//                       Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       required
//                       value={name}
//                       className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       onChange={(e) => setName(e.target.value)}
//                       placeholder="Enter code name..."
//                     />
//                   </div>
//                   <br />
//                   <div>
//                     <label className="pb-2">
//                       Discount Percentage
//                       <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="value"
//                       value={value}
//                       required
//                       className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       onChange={(e) => setValue(e.target.value)}
//                       placeholder="Enter code value..."
//                     />
//                   </div>
//                   <br />
//                   <div>
//                     <label className="pb-2">Min Amount</label>
//                     <input
//                       type="number"
//                       name="value"
//                       value={minAmount}
//                       className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       onChange={(e) => setMinAmount(e.target.value)}
//                       placeholder="Enter code min amount..."
//                     />
//                   </div>
//                   <br />
//                   <div>
//                     <label className="pb-2">Max Amount</label>
//                     <input
//                       type="number"
//                       name="value"
//                       value={maxAmount}
//                       className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       onChange={(e) => setMaxAmount(e.target.value)}
//                       placeholder="Enter code max amount..."
//                     />
//                   </div>
//                   <br />
//                   <div>
//                     <label className="pb-2">Selected Product</label>
//                     <select
//                       className="w-full mt-2 border h-[35px] rounded-[5px]"
//                       value={selectedProducts}
//                       onChange={(e) => setSelectedProducts(e.target.value)}
//                     >
//                       <option value="Choose your selected products">
//                         Choose a selected product
//                       </option>
//                       {products &&
//                         products.map((i) => (
//                           <option value={i.name} key={i.name}>
//                             {i.name}
//                           </option>
//                         ))}
//                     </select>
//                   </div>
//                   <br />
//                   <input
//                     type="submit"
//                     value="Create"
//                     className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer"
//                   />
//                   <div></div>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default AllCoupons;

import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Layout/Loader";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import axios from "axios";
import styles from "../../styles/styles";
import { toast } from "react-toastify";
import { server } from "../../server";
import { RxCross1 } from "react-icons/rx";

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [minAmount, setMinAmount] = useState(null); // Fixed typo
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [value, setValue] = useState(null);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${server}/code/get-code/${seller._id}`,
          {
            withCredentials: true,
          }
        );

        // Ensure we're setting an array, even if empty
        setCoupons(response.data.codes || []);
        setIsLoading(false);

        console.log("Current products:", products);
      } catch (error) {
        toast.error("Error loading coupons");
        setIsLoading(false);
        setCoupons([]); // Set empty array on error
      }
    };

    fetchCoupons();
  }, [seller._id]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${server}/code/delete-code/${id}`, {
        withCredentials: true,
      });
      toast.success("Coupon code deleted successfully!");
      // Refresh coupons instead of page reload
      setCoupons(coupons.filter((coupon) => coupon._id !== id));
    } catch (error) {
      toast.error("Error deleting coupon");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${server}/code/create-code`,
        {
          name,
          minAmount,
          maxAmount,
          selectedProduct: selectedProducts, // Match schema field name
          value,
          shopId: seller._id,
        },
        { withCredentials: true }
      );

      toast.success("Coupon code created successfully!");
      setOpen(false);
      // Add new coupon to state instead of page reload
      setCoupons([...coupons, response.data.code]);

      // Reset form
      setName("");
      setValue(null);
      setMinAmount(null);
      setMaxAmount(null);
      setSelectedProducts(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating coupon");
    }
  };

  const columns = [
    { field: "id", headerName: "Coupon Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "value",
      headerName: "Discount",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        return (
          <Button onClick={() => handleDelete(params.id)}>
            <AiOutlineDelete
              size={20}
              className="bg-red-500 flex justify-center items-center rounded-full w-8 h-8 py-2 text-white font-semibold hover:bg-white hover:text-red-500 hover:scale-125 duration-300"
            />
          </Button>
        );
      },
    },
  ];

  const rows = coupons.map((item) => ({
    id: item._id,
    name: item.name,
    value: `${item.value}%`,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white">Create Coupon Code</span>
            </div>
          </div>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] h-[80vh] bg-white rounded-md shadow p-4">
                <div className="w-full flex justify-end">
                  <RxCross1
                    size={30}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h5 className="text-[30px] font-Poppins text-center">
                  Create Coupon code
                </h5>
                <form onSubmit={handleSubmit} aria-required={true}>
                  <br />
                  <div>
                    <label className="pb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter code name..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">
                      Discount Percentage
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="value"
                      value={value}
                      required
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter discount percentage..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Min Amount</label>
                    <input
                      type="number"
                      name="minAmount"
                      value={minAmount}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="Enter minimum amount..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Max Amount</label>
                    <input
                      type="number"
                      name="maxAmount"
                      value={maxAmount}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="Enter maximum amount..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Selected Product</label>
                    <select
                      className="w-full mt-2 border h-[35px] rounded-[5px]"
                      value={selectedProducts}
                      onChange={(e) => setSelectedProducts(e.target.value)}
                    >
                      <option value="">Choose a selected product</option>
                      {products &&
                        products.map((i) => (
                          <option value={i.name} key={i.name}>
                            {i.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <br />
                  <button
                    type="submit"
                    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Create
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;
