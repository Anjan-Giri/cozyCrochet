import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUsers, FaStore, FaBoxOpen, FaClipboardList } from "react-icons/fa";
import { MdDashboard, MdLogout } from "react-icons/md";

const AdminSidebar = ({ handleLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-gray-800 text-white transition-all duration-300 ease-in-out h-screen sticky top-0 overflow-hidden`}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        {isSidebarOpen ? (
          <h2 className="text-xl font-bold">Admin Panel</h2>
        ) : (
          <div className="w-full flex justify-center">
            <MdDashboard className="text-2xl" />
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
        >
          {isSidebarOpen ? "←" : "→"}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6">
        <ul className="space-y-2 px-2">
          <li>
            <Link
              to="/admin-dashboard"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive("/admin-dashboard")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <MdDashboard
                className={`${isSidebarOpen ? "mr-3" : "mx-auto"} text-2xl`}
              />
              {isSidebarOpen && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive("/admin/users")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <FaUsers
                className={`${isSidebarOpen ? "mr-3" : "mx-auto"} text-2xl`}
              />
              {isSidebarOpen && <span>Users</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/sellers"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive("/admin/sellers")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <FaStore
                className={`${isSidebarOpen ? "mr-3" : "mx-auto"} text-2xl`}
              />
              {isSidebarOpen && <span>Sellers</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/products"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive("/admin/products")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <FaBoxOpen
                className={`${isSidebarOpen ? "mr-3" : "mx-auto"} text-2xl`}
              />
              {isSidebarOpen && <span>Products</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/orders"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive("/admin/orders")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <FaClipboardList
                className={`${isSidebarOpen ? "mr-3" : "mx-auto"} text-2xl`}
              />
              {isSidebarOpen && <span>Orders</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Buttonn */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <MdLogout
            className={`${
              isSidebarOpen ? "mr-3" : "mx-auto"
            } text-2xl text-red-400`}
          />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
