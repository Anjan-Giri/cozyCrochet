import React from "react";
import { FaUserAlt } from "react-icons/fa";
import logo from "../../assests/logo.png";
import { Link } from "react-router-dom";

const AdminHeader = ({ admin }) => {
  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="px-4 py-4 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Link to="/">
            <img src={logo} width={60} alt="logo" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
            <p className="text-xs text-gray-500">{admin?.email}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <FaUserAlt className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
