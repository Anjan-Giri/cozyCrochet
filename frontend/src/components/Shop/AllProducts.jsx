import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProduct, getAllProductsShop } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import EditProduct from "./EditProduct";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProduct(id));

      window.location.reload();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      setSelectedProduct(product);
      setEditModalVisible(true);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    dispatch(getAllProductsShop(seller._id));
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },

    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        const d = params.row.name;
        const product_name = d.replace(/\s+/g, "-");
        return (
          <>
            <Link to={`/product/${product_name}`}>
              <Button>
                <AiOutlineEye
                  size={20}
                  className="flex justify-center items-center rounded-full w-8 h-8 py-2 text-blue-700 font-semibold hover:scale-125 duration-300"
                />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Edit",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center">
            <Button onClick={() => handleEditClick(params.id)}>
              <AiOutlineEdit
                size={20}
                className="bg-green-500 flex justify-center items-center rounded-full w-8 h-8 py-2 text-white font-semibold hover:bg-white hover:text-green-500 hover:scale-125 duration-300"
              />
            </Button>
          </div>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center">
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete
                size={20}
                className="bg-red-500 flex justify-center items-center rounded-full w-8 h-8 py-2 text-white font-semibold hover:bg-white hover:text-red-500 hover:scale-125 duration-300"
              />
            </Button>
          </div>
        );
      },
    },
  ];

  const row = [];

  products &&
    products.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "Nrs " + item.discountPrice,
        Stock: item.stock,
        sold: item.sold_out || 0,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
          {selectedProduct && (
            <EditProduct
              visible={editModalVisible}
              onClose={handleCloseEditModal}
              product={selectedProduct}
            />
          )}
        </div>
      )}
    </>
  );
};

export default AllProducts;
