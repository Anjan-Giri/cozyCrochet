import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { AiOutlineArrowRight } from "react-icons/ai";
import { DataGrid } from "@mui/x-data-grid";
import {
  Area,
  AreaChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  LabelList,
} from "recharts";
import { FaBoxOpen, FaStore, FaUsers, FaChartLine } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { BsFillCalendarCheckFill } from "react-icons/bs";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeOfDayStats, setTimeOfDayStats] = useState([]);
  const navigate = useNavigate();

  // Format NPR currency
  const formatNPR = (amount) => {
    return `Nrs. ${Number(amount).toLocaleString("en-IN")}`;
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data } = await axios.get(`${server}/admin/admin-details`, {
          withCredentials: true,
        });
        setAdmin(data.admin);
        await fetchDashboardStats();
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Please login as admin");
        navigate("/admin-login");
      } finally {
        setLoading(false);
      }
    };

    const fetchDashboardStats = async () => {
      try {
        const { data } = await axios.get(`${server}/admin/dashboard-stats`, {
          withCredentials: true,
        });
        setStats(data.stats);

        // Generate time of day stats if we have orders
        if (data.stats && data.stats.allOrdersForTimeAnalysis) {
          const todStats = generateTimeOfDayStats(
            data.stats.allOrdersForTimeAnalysis
          );
          setTimeOfDayStats(todStats);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Error loading dashboard data");
      }
    };

    fetchAdminData();
  }, [navigate]);

  // Generate time-of-day sales breakdown
  const generateTimeOfDayStats = (orders) => {
    const timeSlots = [
      {
        name: "Morning (6-12)",
        hours: [6, 7, 8, 9, 10, 11],
        sales: 0,
        orders: 0,
      },
      {
        name: "Afternoon (12-17)",
        hours: [12, 13, 14, 15, 16],
        sales: 0,
        orders: 0,
      },
      {
        name: "Evening (17-21)",
        hours: [17, 18, 19, 20],
        sales: 0,
        orders: 0,
      },
      {
        name: "Night (21-6)",
        hours: [21, 22, 23, 0, 1, 2, 3, 4, 5],
        sales: 0,
        orders: 0,
      },
    ];

    // Use all orders from the system for more accurate data
    orders.forEach((order) => {
      try {
        const orderDate = new Date(order.createdAt);
        const hour = orderDate.getHours();

        // Find the matching time slot
        const slot = timeSlots.find((slot) => slot.hours.includes(hour));
        if (slot) {
          slot.sales += order.totalPrice || 0;
          slot.orders += 1;
        }
      } catch (error) {
        console.error("Error processing order time:", error);
      }
    });

    // Calculate average order value
    return timeSlots.map((slot) => ({
      ...slot,
      averageOrder: slot.orders > 0 ? slot.sales / slot.orders : 0,
    }));
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

  // Sort monthly data chronologically
  const sortMonthlyData = (monthlyData) => {
    // First convert to objects with date objects for proper sorting
    const withDates = monthlyData.map((item) => {
      const month = new Date(Date.parse(`${item.year}-${item.month}-01`));
      return {
        ...item,
        dateObj: month,
      };
    });

    // Sort by date (oldest to newest)
    return withDates.sort((a, b) => a.dateObj - b.dateObj);
  };

  // Chart Components
  const UserGrowthChart = () => {
    if (!stats?.monthlyRevenue) return null;

    // Sort months chronologically
    const sortedMonths = sortMonthlyData([...stats.monthlyRevenue]);

    // Create progressive user growth data
    const userData = sortedMonths.map((item, index, array) => {
      // Calculate a progressive user count based on the current position in the array
      const progress = (index + 1) / array.length;
      const users = stats?.userCount
        ? Math.floor(stats.userCount * progress)
        : 0;

      return {
        name: `${item.name} ${item.year}`,
        users,
      };
    });

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={userData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="users"
              name="Total Users"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const ShopGrowthChart = () => {
    if (!stats?.monthlyRevenue) return null;

    // Sort months chronologically
    const sortedMonths = sortMonthlyData([...stats.monthlyRevenue]);

    // Create progressive shop growth data
    const shopData = sortedMonths.map((item, index, array) => {
      const progress = (index + 1) / array.length;
      const shops = stats?.shopCount
        ? Math.floor(stats.shopCount * progress)
        : 0;

      return {
        name: `${item.name} ${item.year}`,
        shops,
      };
    });

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={shopData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="shops" name="Total Shops" fill="#4caf50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const TimeOfDayChart = () => {
    if (!timeOfDayStats || timeOfDayStats.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center">
          No time data available
        </div>
      );
    }

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={timeOfDayStats}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barSize={30}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              scale="point"
              padding={{ left: 30, right: 30 }}
            />
            <YAxis yAxisId="left" orientation="left" stroke="#ff9800" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Sales" || name === "Average Order Value")
                  return [formatNPR(value), name];
                return [value, name];
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="sales" name="Sales" fill="#ff9800" />
            <Bar
              yAxisId="right"
              dataKey="orders"
              name="Orders"
              fill="#82ca9d"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const RevenueChart = () => {
    if (!stats?.monthlyRevenue) return null;

    // Sort months chronologically
    const sortedMonths = sortMonthlyData([...stats.monthlyRevenue]);

    const revenueData = sortedMonths.map((item) => {
      return {
        name: `${item.name} ${item.year}`,
        revenue: item.total || 0,
        orders: item.count || 0,
      };
    });

    if (revenueData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center">
          No revenue data available
        </div>
      );
    }

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={revenueData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#ff7300" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Revenue") return [formatNPR(value), name];
                return [value, name];
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              fill="#ff7300"
              stroke="#ff7300"
              fillOpacity={0.3}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="#82ca9d"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // DataGrid columns for recent orders
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "customer",
      headerName: "Customer",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
    },
  ];

  // Prepare rows for DataGrid
  const rows = [];
  if (stats?.recentOrders && stats.recentOrders.length > 0) {
    stats.recentOrders.forEach((order) => {
      rows.push({
        id: order._id,
        customer: order.user?.name || "Unknown",
        amount: formatNPR(order.totalPrice || 0),
        status: order.status,
      });
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader admin={admin} />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <h3 className="text-[26px] font-Poppins font-semibold text-gray-800 pb-4">
            Admin Dashboard Overview
          </h3>

          {/* Stats Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white shadow rounded-lg px-6 py-6 border-l-4 border-[#8884d8]">
              <div className="flex items-center justify-between">
                <FaUsers size={45} fill="#8884d8" />
                <div className="text-end">
                  <h3 className="text-gray-500 text-sm font-medium">
                    Total Users
                  </h3>
                  <h5 className="text-[24px] font-bold text-gray-800">
                    {stats?.userCount || 0}
                  </h5>
                </div>
              </div>
              <Link to="/admin/users">
                <h5 className="mt-4 text-[#8884d8] font-medium hover:text-[#6654c1] transition-colors flex items-center">
                  View Users <AiOutlineArrowRight className="ml-1" />
                </h5>
              </Link>
            </div>

            <div className="bg-white shadow rounded-lg px-6 py-6 border-l-4 border-[#4caf50]">
              <div className="flex items-center justify-between">
                <FaStore size={45} fill="#4caf50" />
                <div className="text-end">
                  <h3 className="text-gray-500 text-sm font-medium">
                    Total Shops
                  </h3>
                  <h5 className="text-[24px] font-bold text-gray-800">
                    {stats?.shopCount || 0}
                  </h5>
                </div>
              </div>
              <Link to="/admin/sellers">
                <h5 className="mt-4 text-[#4caf50] font-medium hover:text-[#3b9a40] transition-colors flex items-center">
                  View Shops <AiOutlineArrowRight className="ml-1" />
                </h5>
              </Link>
            </div>

            <div className="bg-white shadow rounded-lg px-6 py-6 border-l-4 border-[#f44336]">
              <div className="flex items-center justify-between">
                <FaBoxOpen size={45} fill="#f44336" />
                <div className="text-end">
                  <h3 className="text-gray-500 text-sm font-medium">
                    Total Products
                  </h3>
                  <h5 className="text-[24px] font-bold text-gray-800">
                    {stats?.productCount || 0}
                  </h5>
                </div>
              </div>
              <Link to="/admin/products">
                <h5 className="mt-4 text-[#f44336] font-medium hover:text-[#d32f2f] transition-colors flex items-center">
                  View Products <AiOutlineArrowRight className="ml-1" />
                </h5>
              </Link>
            </div>

            <div className="bg-white shadow rounded-lg px-4 py-6 border-l-4 border-[#ff9800]">
              <div className="flex items-center justify-between">
                <GiMoneyStack size={45} fill="#ff9800" />
                <div className="text-end">
                  <h3 className="text-gray-500 text-sm font-medium">
                    Total Revenue
                  </h3>
                  <h5 className="text-[22px] font-bold text-gray-800">
                    {formatNPR(stats?.totalRevenue || 0)}
                  </h5>
                </div>
              </div>
              <Link to="/admin/orders">
                <h5 className="mt-4 text-[#ff9800] font-medium hover:text-[#f57c00] transition-colors flex items-center">
                  View Orders <AiOutlineArrowRight className="ml-1" />
                </h5>
              </Link>
            </div>
          </div>

          {/* Revenue Chart - Full Width */}
          <div className="mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <FaChartLine className="mr-2" fill="#ff7300" />
                Revenue & Orders Trend
              </h3>
              <RevenueChart />
            </div>
          </div>

          {/* Charts Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <FaUsers className="mr-2" fill="#8884d8" />
                User Growth
              </h3>
              <UserGrowthChart />
            </div>

            {/* Shop Growth Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <FaStore className="mr-2" fill="#4caf50" />
                Shop Growth
              </h3>
              <ShopGrowthChart />
            </div>
          </div>

          {/* Time of Day Orders Chart */}
          <div className="mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <BsFillCalendarCheckFill className="mr-2" fill="#ff9800" />
                Orders by Time of Day
              </h3>
              <TimeOfDayChart />
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Latest Orders
              </h3>
              <Link to="/admin/orders">
                <button className="px-4 py-2 bg-[#f5f5f5] text-[#f44336] rounded-md hover:bg-[#f44336] hover:text-white transition duration-300 flex items-center">
                  View All <AiOutlineArrowRight className="ml-1" />
                </button>
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {rows.length > 0 ? (
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  autoHeight
                  sx={{
                    "& .MuiDataGrid-cell:focus": {
                      outline: "none",
                    },
                    "& .greenColor": {
                      color: "green",
                      fontWeight: "500",
                    },
                    "& .redColor": {
                      color: "#f44336",
                      fontWeight: "500",
                    },
                  }}
                />
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No recent orders found
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
