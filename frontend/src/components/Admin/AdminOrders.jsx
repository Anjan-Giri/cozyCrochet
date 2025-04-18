import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Chip, MenuItem, Select, FormControl } from "@mui/material";
import { AiOutlineArrowRight } from "react-icons/ai";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
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
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${server}/admin/all-orders`, {
          withCredentials: true,
        });
        setOrders(data.orders);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching orders");
        if (error.response?.status === 401) {
          navigate("/admin-login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(
        `${server}/admin/update-order-status/${orderId}`,
        { status },
        { withCredentials: true }
      );
      toast.success("Order status updated successfully");
      // Update the order status in the local state
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating order status"
      );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format NPR currency
  const formatNPR = (amount) => {
    return `Nrs. ${Number(amount).toLocaleString("en-IN")}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Transferred to delivery partner":
        return "bg-purple-100 text-purple-800";
      case "Shipping":
        return "bg-yellow-100 text-yellow-800";
      case "Received":
        return "bg-cyan-100 text-cyan-800";
      case "On the way":
        return "bg-indigo-100 text-indigo-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 200,
      flex: 1,
      headerClassName: "bg-gray-100",
    },
    {
      field: "customer",
      headerName: "Customer",
      minWidth: 150,
      flex: 0.8,
      headerClassName: "bg-gray-100",
    },
    {
      field: "date",
      headerName: "Order Date",
      minWidth: 120,
      flex: 0.7,
      headerClassName: "bg-gray-100",
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 120,
      flex: 0.7,
      headerClassName: "bg-gray-100",
    },
    {
      field: "paymentStatus",
      headerName: "Payment",
      minWidth: 110,
      flex: 0.7,
      headerClassName: "bg-gray-100",
      renderCell: (params) => {
        return (
          <div
            className={
              params.value === "Succeeded" || params.value === "succeeded"
                ? "text-green-600"
                : "text-orange-600"
            }
          >
            {params.value}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      flex: 0.8,
      headerClassName: "bg-gray-100",
      renderCell: (params) => {
        const statusClass = getStatusColor(params.value);
        return (
          <div className="flex items-center justify-center py-4">
            <div
              className={`px-2 py-1 rounded-full ${statusClass} text-xs font-medium`}
            >
              {params.value}
            </div>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      flex: 0.7,
      headerClassName: "bg-gray-100",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-between w-full">
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <Select
                value={params.row.status}
                onChange={(e) => handleStatusChange(params.id, e.target.value)}
                className="text-sm"
              >
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Transferred to delivery partner">
                  Transferred
                </MenuItem>
                <MenuItem value="Shipping">Shipping</MenuItem>
                <MenuItem value="Received">Received</MenuItem>
                <MenuItem value="On the way">On the way</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
              </Select>
            </FormControl>
            <Link to={`/admin/order/${params.id}`}>
              <Button className="text-blue-600 hover:text-blue-800 ml-2">
                <AiOutlineArrowRight size={18} />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  const rows = [];
  orders &&
    orders.forEach((order) => {
      rows.push({
        id: order._id,
        customer: order.user?.name || "Unknown",
        date: formatDate(order.createdAt),
        amount: formatNPR(order.totalPrice),
        paymentStatus: order.paymentInfo?.status || "Pending",
        status: order.status,
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
            <h1 className="text-2xl font-semibold text-gray-800">All Orders</h1>
          </div>

          {/* Orders Table */}
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
    </div>
  );
};

export default AdminOrders;
