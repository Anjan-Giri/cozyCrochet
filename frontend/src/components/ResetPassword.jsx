import axios from "axios";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate, useParams } from "react-router-dom";
import { server } from "../server";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${server}/user/reset-password/${token}`, {
        password,
        confirmPassword,
      });

      toast.success(res.data.message);

      // Redirect to login page after successful password reset
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg py-10 px-24 w-1/2 z-10 relative">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-purple-500">Reset Password</h2>
          <Link to="/">
            <h1 className="text-3xl font-bold text-pink-600 cursor-pointer">
              cozyCrochet
            </h1>
          </Link>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="mt-3 relative">
              <input
                type={visible ? "text" : "password"}
                name="password"
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <div className="mt-3 relative">
              <input
                type={confirmVisible ? "text" : "password"}
                name="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {confirmVisible ? (
                <AiOutlineEye
                  onClick={() => setConfirmVisible(false)}
                  className="absolute right-3 top-3 cursor-pointer items-center"
                  size={25}
                />
              ) : (
                <AiOutlineEyeInvisible
                  onClick={() => setConfirmVisible(true)}
                  className="absolute right-3 top-3 cursor-pointer"
                  size={25}
                />
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full h-[40px] flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-700 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-500 hover:text-black hover:border-purple-500 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </div>

          <div className="flex items-center justify-center w-full">
            <Link to="/login" className="text-purple-600 hover:text-pink-600">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
