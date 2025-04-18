import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import CrochetBackground from "../CrochetBackground";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${server}/admin/login-admin`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Admin login successful!");
        navigate("/admin-dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex justify-center items-center">
      {/* Matching background animation */}
      <CrochetBackground />

      {/* Admin Login form with exact same styling as user login */}
      <div className="bg-white rounded-lg shadow-lg py-10 px-24 w-1/2 z-10 relative">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-purple-500">Admin Sign In</h2>
          <Link to="/">
            <h1 className="text-3xl font-bold text-pink-600 cursor-pointer">
              cozyCrochet
            </h1>
          </Link>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="mt-3">
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-3 relative">
              <input
                type={visible ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {visible ? (
                <AiOutlineEye
                  onClick={() => setVisible(false)}
                  className="absolute right-3 top-3 cursor-pointer items-center"
                  size={25}
                />
              ) : (
                <AiOutlineEyeInvisible
                  onClick={() => setVisible(true)}
                  className="absolute right-3 top-3 cursor-pointer"
                  size={25}
                />
              )}
            </div>
          </div>

          {/* Sign in button with exact same styling */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full h-[40px] flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-700 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-500 hover:text-black hover:border-purple-500 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Admin Sign In"}
            </button>
          </div>

          <div className="flex items-center w-full">
            <h4>Need user access?</h4>
            <Link to="/login" className="text-pink-600 pl-2">
              User Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
