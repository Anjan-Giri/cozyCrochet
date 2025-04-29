import axios from "axios";
import React, { useEffect, useState } from "react";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

import { server } from "../server";
import { toast } from "react-toastify";
import CrochetBackground from "./CrochetBackground";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await axios
      .post(
        `${server}/user/login-user`,
        { email, password },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Login Successful!");

        navigate("/");

        window.location.reload(true);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex justify-center items-center">
      <CrochetBackground />

      {/* Login form */}
      <div className="bg-white rounded-lg shadow-lg py-10 px-24 w-1/2 z-10 relative">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-purple-500">Sign In</h2>

          <Link to="/">
            <h1 className="text-3xl font-bold text-pink-600  cursor-pointer">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="remember-me"
                id="remember-me"
                className="h-4 w-4 text-purple-500 focus:ring-purple-500 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-purple-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-purple-600 hover:text-pink-600"
              >
                Forgot your password?
              </Link>
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
          <div className="flex items-center w-full">
            <h4>New here?</h4>
            <Link to="/sign-up" className="text-pink-600 pl-2">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
