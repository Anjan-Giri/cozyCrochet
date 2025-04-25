import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../../server";

const ShopForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${server}/shop/forgot-password`, { email });
      toast.success(res.data.message);
      setEmail("");
    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg py-10 px-24 w-1/2 z-10 relative">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-purple-500">
            Forgot Shop Password
          </h2>

          <Link to="/">
            <h1 className="text-3xl font-bold text-pink-600 cursor-pointer">
              cozyCrochet
            </h1>
          </Link>
        </div>

        <p className="text-gray-600 mb-6 text-center">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

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
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full h-[40px] flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-700 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-500 hover:text-black hover:border-purple-500 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>

          <div className="flex items-center justify-center w-full">
            <Link to="/shop-login" className="text-pink-600">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopForgotPassword;
