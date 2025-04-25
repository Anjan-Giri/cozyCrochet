import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { FaBoxes, FaChartLine } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdBorderClear, MdCategory } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import {
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts";
import { categoriesData } from "../../stat/data";

const DashboardMain = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesByTime, setSalesByTime] = useState([]);

  // Format NPR currency
  const formatNPR = (amount) => {
    return `NPR ${Number(amount).toLocaleString("en-IN")}`;
  };

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersShop(seller._id));
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller]);

  // Process order data for charts and recent orders
  useEffect(() => {
    if (orders && orders.length > 0) {
      // Get most recent 5 orders
      const recent = [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentOrders(recent);

      // Generate weekly sales data
      const lastFourWeeks = generateWeeklyData(orders);
      setWeeklyStats(lastFourWeeks);

      // Generate time-of-day sales data
      const timeData = generateTimeOfDaySales(orders);
      setSalesByTime(timeData);
    }
  }, [orders]);

  // Generate category stats from products
  useEffect(() => {
    if (products && products.length > 0) {
      // Count products by category
      const categoryCounts = {};
      const categoryValues = {};

      products.forEach((product) => {
        if (product.category) {
          categoryCounts[product.category] =
            (categoryCounts[product.category] || 0) + 1;

          // Calculate approximate value of inventory in this category
          const value = product.discountPrice || product.originalPrice || 0;
          categoryValues[product.category] =
            (categoryValues[product.category] || 0) + value;
        }
      });

      // Convert to array format for chart
      const categoryStatsArray = Object.keys(categoryCounts).map(
        (category) => ({
          name: category,
          count: categoryCounts[category],
          value: categoryValues[category],
          inventoryValue: categoryValues[category],
        })
      );

      // Sort by count and limit to top categories if needed
      const sortedStats = categoryStatsArray
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Show top 5 categories

      setCategoryStats(sortedStats);
    } else {
      // Fallback to sample data if no products
      const sampleCategories = categoriesData.slice(0, 5).map((cat, index) => ({
        name: cat.title,
        count: 20 - index * 3, // Just sample values decreasing by category
        value: 100 - index * 15,
        inventoryValue: 1000 - index * 150,
      }));
      setCategoryStats(sampleCategories);
    }
  }, [products]);

  // Generate time-of-day sales breakdown
  const generateTimeOfDaySales = (orders) => {
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
      { name: "Evening (17-21)", hours: [17, 18, 19, 20], sales: 0, orders: 0 },
      {
        name: "Night (21-6)",
        hours: [21, 22, 23, 0, 1, 2, 3, 4, 5],
        sales: 0,
        orders: 0,
      },
    ];

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const hour = orderDate.getHours();

      // Find the matching time slot
      const slot = timeSlots.find((slot) => slot.hours.includes(hour));
      if (slot) {
        slot.sales += order.totalPrice;
        slot.orders += 1;
      }
    });

    // Calculate average order value
    return timeSlots.map((slot) => ({
      ...slot,
      averageOrder: slot.orders > 0 ? slot.sales / slot.orders : 0,
    }));
  };

  // Generate weekly data from orders
  const generateWeeklyData = (orders) => {
    // Create data for the last 4 weeks
    const weeks = [];
    const now = new Date();

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7 + 6));

      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - i * 7);

      const weekSales = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= weekStart && orderDate <= weekEnd;
      });

      const totalSales = weekSales.reduce(
        (sum, order) => sum + order.totalPrice,
        0
      );
      const orderCount = weekSales.length;

      // Calculate average order value
      const avgOrderValue = orderCount > 0 ? totalSales / orderCount : 0;

      // Calculate items per order
      const itemsCount = weekSales.reduce((sum, order) => {
        return (
          sum +
          (order.cart ? order.cart.reduce((acc, item) => acc + item.qty, 0) : 0)
        );
      }, 0);

      const avgItemsPerOrder = orderCount > 0 ? itemsCount / orderCount : 0;

      weeks.push({
        name: `Week ${4 - i}`,
        sales: totalSales,
        orders: orderCount,
        avgOrderValue: avgOrderValue,
        itemsPerOrder: avgItemsPerOrder.toFixed(1),
      });
    }
    return weeks;
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
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
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  if (recentOrders && recentOrders.length > 0) {
    recentOrders.forEach((item) => {
      const itemsQty = item.cart
        ? item.cart.reduce((acc, item) => acc + item.qty, 0)
        : 0;

      row.push({
        id: item._id,
        itemsQty: itemsQty,
        total: formatNPR(item.totalPrice),
        status: item.status,
      });
    });
  }

  // Colors for charts - vibrant theme
  const COLORS = [
    "#f44336",
    "#2196f3",
    "#4caf50",
    "#ff9800",
    "#9c27b0",
    "#3f51b5",
  ];

  // Chart Components
  const WeeklySalesChart = () => {
    if (!weeklyStats || weeklyStats.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center">
          Loading chart data...
        </div>
      );
    }

    // Clean up data to avoid NaN values
    const cleanData = weeklyStats.map((week) => ({
      ...week,
      avgOrderValue: isNaN(week.avgOrderValue) ? 0 : week.avgOrderValue,
    }));

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={cleanData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#8884d8"
              label={{
                value: "Sales (NPR)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#ff7300"
              label={{ value: "NPR", angle: 90, position: "insideRight" }}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Total Sales" || name === "Avg Order Value")
                  return [formatNPR(value), name];
                return [value, name];
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              name="Total Sales"
              fill="#8884d8"
              stroke="#8884d8"
              fillOpacity={0.3}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgOrderValue"
              name="Avg Order Value"
              stroke="#ff7300"
              connectNulls={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const TimeOfDayChart = () => {
    if (!salesByTime || salesByTime.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center">
          Loading chart data...
        </div>
      );
    }

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={salesByTime}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barSize={30}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              scale="point"
              padding={{ left: 30, right: 30 }}
            />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Sales" || name === "Avg Order Value")
                  return [formatNPR(value), name];
                return [value, name];
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="sales" name="Sales" fill="#8884d8" />
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

  const CategoryPieChart = () => {
    if (categoryStats.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center">
          Loading chart data...
        </div>
      );
    }

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryStats}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              label={({ name, percent }) =>
                `${name.split(" ").pop()} ${(percent * 100).toFixed(0)}%`
              }
            >
              {categoryStats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => {
                // Safety check to make sure we have a valid index and category
                if (
                  props &&
                  props.payload &&
                  typeof props.payload.index === "number" &&
                  categoryStats[props.payload.index]
                ) {
                  const category = categoryStats[props.payload.index];
                  return [
                    `${value} items (${formatNPR(
                      category.inventoryValue || 0
                    )} inventory)`,
                    name,
                  ];
                }
                // Return a fallback if we can't access the category data
                return [value, name];
              }}
            />
            <Legend
              formatter={(value, entry, index) => {
                // Safety check for index bounds
                if (index >= 0 && index < categoryStats.length) {
                  return `${value} (${categoryStats[index].count} items)`;
                }
                return value;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="w-full p-8">
      {/* Heading */}
      <h3 className="text-[26px] font-Poppins font-semibold text-gray-800 pb-4">
        Dashboard Overview
      </h3>

      {/* Stats Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg px-6 py-5 border-l-4 border-[#f44336]">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-3" fill="#f44336" />
            <div>
              <h3 className="text-gray-500 text-sm font-medium">All Orders</h3>
              <h5 className="text-[24px] font-bold text-gray-800">
                {orders ? orders.length : 0}
              </h5>
            </div>
          </div>
          <Link to="/dashboard-orders">
            <h5 className="mt-4 text-[#f44336] font-medium hover:text-[#d32f2f] transition-colors flex items-center">
              View Orders <AiOutlineArrowRight className="ml-1" />
            </h5>
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg px-6 py-5 border-l-4 border-[#2196f3]">
          <div className="flex items-center">
            <FaBoxes size={30} className="mr-3" fill="#2196f3" />
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                All Products
              </h3>
              <h5 className="text-[24px] font-bold text-gray-800">
                {products ? products.length : 0}
              </h5>
            </div>
          </div>
          <Link to="/dashboard-products">
            <h5 className="mt-4 text-[#2196f3] font-medium hover:text-[#1976d2] transition-colors flex items-center">
              View Products <AiOutlineArrowRight className="ml-1" />
            </h5>
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg px-6 py-5 border-l-4 border-[#4caf50]">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-3" fill="#4caf50" />
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                Total Revenue
              </h3>
              <h5 className="text-[24px] font-bold text-gray-800">
                {formatNPR(
                  orders
                    ? orders
                        .reduce((total, order) => total + order.totalPrice, 0)
                        .toFixed(2)
                    : "0.00"
                )}
              </h5>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg px-6 py-5 border-l-4 border-[#ff9800]">
          <div className="flex items-center">
            <BsFillCalendarCheckFill
              size={30}
              className="mr-3"
              fill="#ff9800"
            />
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                Avg Order Value
              </h3>
              <h5 className="text-[24px] font-bold text-gray-800">
                {formatNPR(
                  orders && orders.length > 0
                    ? (
                        orders.reduce(
                          (total, order) => total + order.totalPrice,
                          0
                        ) / orders.length
                      ).toFixed(2)
                    : "0.00"
                )}
              </h5>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Sales Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <FaChartLine className="mr-2" fill="#8884d8" />
            Weekly Performance
          </h3>
          <WeeklySalesChart />
        </div>

        {/* Product Category Distribution */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <MdCategory className="mr-2" fill="#f44336" />
            Products by Category
          </h3>
          <CategoryPieChart />
        </div>
      </div>

      {/* Time of Day Sales Distribution */}
      <div className="bg-white p-4 rounded-lg shadow mt-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <BsFillCalendarCheckFill className="mr-2" fill="#8884d8" />
          Sales by Time of Day
        </h3>
        <TimeOfDayChart />
      </div>

      {/* Recent Orders Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Latest Orders</h3>
          <Link to="/dashboard-orders">
            <button className="px-4 py-2 bg-[#f5f5f5] text-[#f44336] rounded-md hover:bg-[#f44336] hover:text-white transition duration-300 flex items-center">
              View All <AiOutlineArrowRight className="ml-1" />
            </button>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {recentOrders && recentOrders.length > 0 ? (
            <DataGrid
              rows={row}
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
    </div>
  );
};

export default DashboardMain;
