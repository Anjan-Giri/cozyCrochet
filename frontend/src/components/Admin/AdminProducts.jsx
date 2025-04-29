import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FaTrashAlt } from "react-icons/fa";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [admin, setAdmin] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data } = await axios.get(`${server}/admin/admin-details`, {
          withCredentials: true,
        });
        setAdmin(data.admin);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Please login as admin");
        navigate("/admin-login");
      }
    };

    fetchAdminData();
  }, [navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${server}/admin/all-products`, {
          withCredentials: true,
        });
        setProducts(data.products);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching products");
        if (error.response?.status === 401) {
          navigate("/admin-login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.get(`${server}/admin/logout`, {
        withCredentials: true,
      });
      toast.success("Logout successful");
      navigate("/admin-login");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setDeleteConfirm(true);
  };

  const closeDeleteDialog = () => {
    setDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${server}/admin/delete-product/${deleteId}`, {
        withCredentials: true,
      });
      toast.success("Product deleted successfully");
      setProducts(products.filter((product) => product._id !== deleteId));
      closeDeleteDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting product");
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.png";

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    const baseUrl = server.replace("/api/v2", "").replace(/\/$/, "");
    const imagePath = imageUrl.replace(/^\/?(uploads\/)?/, "");

    return `${baseUrl}/uploads/${imagePath}`;
  };

  const columns = [
    {
      field: "id",
      headerName: "Product ID",
      minWidth: 200,
      flex: 0.7,
      headerClassName: "bg-gray-100",
    },
    {
      field: "image",
      headerName: "Image",
      minWidth: 100,
      flex: 0.5,
      headerClassName: "bg-gray-100",
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center w-full h-full">
            <img
              src={params.row.imageUrl}
              alt="Product"
              className="w-10 h-10 object-cover rounded-md"
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
            />
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1,
      headerClassName: "bg-gray-100",
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 120,
      flex: 0.6,
      headerClassName: "bg-gray-100",
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 100,
      flex: 0.5,
      headerClassName: "bg-gray-100",
      renderCell: (params) => {
        return (
          <div
            className={params.row.stock === 0 ? "text-red-500 font-medium" : ""}
          >
            {params.row.stock}
          </div>
        );
      },
    },
    {
      field: "seller",
      headerName: "Seller",
      minWidth: 150,
      flex: 0.8,
      headerClassName: "bg-gray-100",
    },
    {
      field: "sold",
      headerName: "Sold Units",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      headerClassName: "bg-gray-100",
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 80,
      flex: 0.5,
      headerClassName: "bg-gray-100",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center w-full py-3">
            <Button
              onClick={() => openDeleteDialog(params.row.id)}
              className="text-red-600 hover:text-red-800"
            >
              <FaTrashAlt size={18} className="text-red-600" />
            </Button>
          </div>
        );
      },
    },
  ];

  const rows = [];
  products &&
    products.forEach((product) => {
      rows.push({
        id: product._id,
        name: product.name,
        price: `Nrs. ${product.discountPrice || product.originalPrice}`,
        stock: product.stock,
        sold: product.sold_out || 0,
        seller: product.shop?.name || "Unknown Shop",
        imageUrl:
          product.images && product.images.length > 0
            ? getImageUrl(product.images[0].url)
            : "/placeholder.png",
      });
    });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader admin={admin} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              All Products
            </h1>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 20, 50]}
                disableSelectionOnClick
                autoHeight
                sx={{
                  "& .MuiDataGrid-cell:focus": {
                    outline: "none",
                  },
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
