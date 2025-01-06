import axios from "axios";
import React, { useState } from "react";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

import { server } from "../server";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //try {
    //   const response = await axios.post(
    //     `${server}/user/login-user`,
    //     { email, password },
    //     { withCredentials: true } // Ensure credentials are sent if needed
    //   );
    //   if (response.data.token) {
    //     // Save the token to localStorage (or sessionStorage)
    //     localStorage.setItem("authToken", response.data.token);
    //     toast.success("Login Successful!");
    //     navigate("/"); // Redirect to home page or dashboard
    //   } else {
    //     toast.error("Token missing in response!");
    //   }
    // } catch (err) {
    //   toast.error(
    //     err.response?.data?.message || "Login failed. Please try again."
    //   );
    // }
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
    <div
      className="flex justify-center items-center min-h-screen"
      // style={{
      //   backgroundImage: `url(${d})`,
      //   backgroundRepeat: "no-repeat",
      //   backgroundSize: "cover",
      //   width: "100%",
      //   height: "100%",
      // }}
    >
      <div className="bg-white rounded-lg shadow-lg py-10 px-24 w-1/2">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-purple-500">Sign In</h2>
          <h1 className="text-3xl font-bold text-pink-600">cozyCrochet</h1>
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
              <a
                href=".forgot-password"
                className="font-medium text-purple-600 hover:text-pink-600"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full h-[40px] flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-700 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-500 hover:text-black hover:border-purple-500"
            >
              Sign In
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
