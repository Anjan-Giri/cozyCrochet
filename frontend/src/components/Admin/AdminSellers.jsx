import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server, backend_url } from "../../server";
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
import { FaTrash, FaStore, FaEye } from "react-icons/fa";

const AdminSellers = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shopToDelete, setShopToDelete] = useState(null);
  const [shopDetailsOpen, setShopDetailsOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const navigate = useNavigate();

  // Function to get proper avatar URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;

    // If the avatar is already a full URL
    if (
      typeof avatar === "string" &&
      (avatar.startsWith("http://") || avatar.startsWith("https://"))
    ) {
      return avatar;
    }

    // If avatar is an object with url property
    const avatarPath = typeof avatar === "object" ? avatar.url : avatar;

    // Remove any leading slashes and 'uploads/'
    const cleanPath = avatarPath.replace(/^\/?(uploads\/)?/, "");

    // Construct the full URL using the backend_url
    return `${backend_url}uploads/${cleanPath}`;
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data } = await axios.get(`${server}/admin/admin-details`, {
          withCredentials: true,
        });
        setAdmin(data.admin);
        fetchShops();
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Please login as admin");
        navigate("/admin-login");
      }
    };

    fetchAdminData();
  }, [navigate]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/admin/all-shops`, {
        withCredentials: true,
      });
      setShops(data.shops);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shops:", error);
      toast.error("Failed to load shops");
      setLoading(false);
    }
  };

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

  const handleDeleteClick = (shopId) => {
    setShopToDelete(shopId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setShopToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${server}/admin/delete-shop/${shopToDelete}`, {
        withCredentials: true,
      });
      toast.success("Shop deleted successfully");
      fetchShops();
      handleDeleteClose();
    } catch (error) {
      console.error("Error deleting shop:", error);
      toast.error("Failed to delete shop");
    }
  };

  const handleViewDetails = (shop) => {
    setSelectedShop(shop);
    setShopDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setShopDetailsOpen(false);
    setSelectedShop(null);
  };

  const columns = [
    {
      field: "id",
      headerName: "Shop ID",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "avatar",
      headerName: "Shop Logo",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => {
        const avatarUrl = getAvatarUrl(params.value);
        return (
          <div className="flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Shop"
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
            ) : (
              <FaStore className="w-6 h-6 text-gray-400" />
            )}
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "Shop Name",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "createdAt",
      headerName: "Joined On",
      minWidth: 150,
      flex: 0.7,
      renderCell: (params) => {
        return new Date(params.value).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 180,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex gap-2">
            <Button
              variant="contained"
              color="info"
              onClick={() => handleViewDetails(params.row)}
            >
              <FaEye size={20} />
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDeleteClick(params.id)}
            >
              <FaTrash size={20} />
            </Button>
          </div>
        );
      },
    },
  ];

  const rows = [];
  shops &&
    shops.forEach((shop) => {
      rows.push({
        id: shop._id,
        avatar: shop.avatar,
        name: shop.name,
        email: shop.email,
        address: shop.address,
        phone: shop.phoneNumber,
        createdAt: shop.createdAt,
        description: shop.description,
        zipCode: shop.zipCode,
        fullShopData: shop,
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

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Seller Management
            </h2>
            <p className="text-gray-600">
              View and manage all registered shop sellers
            </p>
          </div>

          {/* Sellers DataGrid */}
          <div className="bg-white rounded-lg shadow p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 20, 50]}
                disableSelectionOnClick
                autoHeight
                getRowHeight={() => "auto"}
                getEstimatedRowHeight={() => 70}
                sx={{
                  "& .MuiDataGrid-cell": {
                    padding: "16px",
                  },
                  "& .MuiDataGrid-cell:focus": {
                    outline: "none",
                  },
                }}
              />
            )}
          </div>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Confirm Shop Deletion"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this shop? This action will also
                delete all products belonging to this shop and cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Shop Details Dialog */}
          {selectedShop && (
            <Dialog
              open={shopDetailsOpen}
              onClose={handleDetailsClose}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>Shop Details</DialogTitle>
              <DialogContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex justify-center md:justify-start">
                    {selectedShop.avatar ? (
                      <img
                        src={getAvatarUrl(selectedShop.avatar)}
                        alt={selectedShop.name}
                        className="w-32 h-32 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaStore className="text-4xl text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">
                      {selectedShop.name}
                    </h3>
                    <p className="text-gray-600">
                      <strong>Email:</strong> {selectedShop.email}
                    </p>
                    <p className="text-gray-600">
                      <strong>Phone:</strong>{" "}
                      {selectedShop.phone || "Not provided"}
                    </p>
                    <p className="text-gray-600">
                      <strong>Address:</strong>{" "}
                      {selectedShop.address || "Not provided"}
                      {selectedShop.zipCode && `, ${selectedShop.zipCode}`}
                    </p>
                    <p className="text-gray-600">
                      <strong>Joined:</strong>{" "}
                      {new Date(selectedShop.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-medium mb-2">Description</h4>
                  <p className="text-gray-700 border p-3 rounded bg-gray-50">
                    {selectedShop.description || "No description provided."}
                  </p>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDetailsClose} color="primary">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleDetailsClose();
                    handleDeleteClick(selectedShop.id);
                  }}
                  color="error"
                >
                  Delete Shop
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminSellers;
