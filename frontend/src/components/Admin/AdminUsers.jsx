import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backend_url, server } from "../../server";
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
import { FaTrash, FaUserAlt } from "react-icons/fa";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data } = await axios.get(`${server}/admin/admin-details`, {
          withCredentials: true,
        });
        setAdmin(data.admin);
        fetchUsers();
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Please login as admin");
        navigate("/admin-login");
      }
    };

    fetchAdminData();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/admin/all-users`, {
        withCredentials: true,
      });
      setUsers(data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
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

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${server}/admin/delete-user/${userToDelete}`, {
        withCredentials: true,
      });
      toast.success("User deleted successfully");
      fetchUsers();
      handleDeleteClose();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "User ID",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
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
      field: "role",
      headerName: "Role",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => {
        return (
          <div
            className={`${
              params.value === "admin" ? "text-red-600 font-semibold" : ""
            }`}
          >
            {params.value}
          </div>
        );
      },
    },
    {
      field: "joinedAt",
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
      minWidth: 120,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteClick(params.id)}
          >
            <FaTrash size={20} />
          </Button>
        );
      },
    },
  ];

  const rows = [];
  users &&
    users.forEach((user) => {
      rows.push({
        id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        role: user.role,
        joinedAt: user.createdAt,
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
              User Management
            </h2>
            <p className="text-gray-600">
              View and manage all registered users
            </p>
          </div>

          {/* Users DataGrid */}
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
              {"Confirm User Deletion"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this user? This action cannot be
                undone.
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
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
