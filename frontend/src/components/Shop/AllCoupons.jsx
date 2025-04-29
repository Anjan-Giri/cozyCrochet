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
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState("");
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

        setCoupons(response.data.codes || []);
        setIsLoading(false);
      } catch (error) {
        toast.error("Error loading coupons");
        setIsLoading(false);
        setCoupons([]);
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
          selectedProducts,
          value,
          shopId: seller._id,
        },
        { withCredentials: true }
      );

      toast.success("Coupon code created successfully!");
      setOpen(false);
      setCoupons([...coupons, response.data.code]);

      setName("");
      setValue(null);
      setMinAmount(null);
      setMaxAmount(null);
      setSelectedProducts("");
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
      field: "minAmount",
      headerName: "Min Amount",
      minWidth: 120,
      flex: 0.6,
      renderCell: (params) => {
        return params.value > 0 ? `Nrs. ${params.value}` : "No minimum";
      },
    },
    {
      field: "maxAmount",
      headerName: "Max Discount",
      minWidth: 120,
      flex: 0.6,
      renderCell: (params) => {
        return params.value > 0 ? `Nrs. ${params.value}` : "No limit";
      },
    },
    {
      field: "product",
      headerName: "Product",
      minWidth: 150,
      flex: 0.8,
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
    minAmount: item.minAmount || 0,
    maxAmount: item.maxAmount || 0,
    product: item.selectedProducts || "All Products",
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
              <div className="w-[90%] 800px:w-[50%] bg-white rounded-md shadow-lg p-6 max-h-[90vh] overflow-y-auto">
                <div className="w-full flex justify-end">
                  <RxCross1
                    size={30}
                    className="cursor-pointer text-[#50007a] hover:text-red-500"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h1 className="text-[25px] text-center font-semibold text-[#50007a] pb-4">
                  Create Coupon Code
                </h1>
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="w-full pb-3">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter code name..."
                    />
                  </div>

                  <div className="w-full pb-3">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      Discount Percentage{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="value"
                      value={value}
                      required
                      className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter discount percentage..."
                    />
                  </div>

                  <div className="w-full 800px:flex block pb-3">
                    <div className="w-[100%] 800px:w-[50%] 800px:pr-2">
                      <label className="block text-sm font-medium text-[#50007a] py-2">
                        Min Amount (Nrs.)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="minAmount"
                          value={minAmount}
                          className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          onChange={(e) => setMinAmount(e.target.value)}
                          placeholder="Minimum purchase amount..."
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          (0 = no minimum)
                        </div>
                      </div>
                    </div>
                    <div className="w-[100%] 800px:w-[50%] 800px:pl-2 mt-3 800px:mt-0">
                      <label className="block text-sm font-medium text-[#50007a] py-2">
                        Max Discount (Nrs.)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="maxAmount"
                          value={maxAmount}
                          className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          onChange={(e) => setMaxAmount(e.target.value)}
                          placeholder="Maximum discount amount..."
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          (0 = no limit)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full pb-3">
                    <label className="block text-sm font-medium text-[#50007a] py-2">
                      Apply to Product (Optional)
                    </label>
                    <select
                      className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={selectedProducts}
                      onChange={(e) => setSelectedProducts(e.target.value)}
                    >
                      <option value="">All Products</option>
                      {products &&
                        products.map((i) => (
                          <option value={i.name} key={i.name}>
                            {i.name}
                          </option>
                        ))}
                    </select>
                    <div className="text-xs text-gray-500 mt-1">
                      Leave empty to apply to all products from your shop
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <button
                      type="submit"
                      className="w-[210px] h-[50px] text-center text-[#50007a] border-2 font-semibold border-[#50007a] rounded-md cursor-pointer mt-6 hover:border-red-900 hover:text-red-900 hover:scale-105 duration-300"
                    >
                      Create Coupon
                    </button>
                  </div>
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
