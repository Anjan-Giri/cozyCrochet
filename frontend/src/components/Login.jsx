import axios from "axios";
import React, { useEffect, useState } from "react";

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

  //   return (
  //     <div
  //       className="flex justify-center items-center min-h-screen"
  //       // style={{
  //       //   backgroundImage: `url(${d})`,
  //       //   backgroundRepeat: "no-repeat",
  //       //   backgroundSize: "cover",
  //       //   width: "100%",
  //       //   height: "100%",
  //       // }}
  //     >
  //       <div className="bg-white rounded-lg shadow-lg py-10 px-24 w-1/2">
  //         <div className="text-center mb-8">
  //           <h2 className="text-2xl font-bold text-purple-500">Sign In</h2>
  //           <h1 className="text-3xl font-bold text-pink-600">cozyCrochet</h1>
  //         </div>
  //         <form className="space-y-6" onSubmit={handleSubmit}>
  //           <div>
  //             <label
  //               htmlFor="email"
  //               className="block text-sm font-medium text-gray-700"
  //             >
  //               Email Address
  //             </label>
  //             <div className="mt-3">
  //               <input
  //                 type="email"
  //                 name="email"
  //                 autoComplete="email"
  //                 required
  //                 value={email}
  //                 onChange={(e) => setEmail(e.target.value)}
  //                 className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  //               />
  //             </div>
  //           </div>
  //           <div>
  //             <label
  //               htmlFor="password"
  //               className="block text-sm font-medium text-gray-700"
  //             >
  //               Password
  //             </label>
  //             <div className="mt-3 relative">
  //               <input
  //                 type={visible ? "text" : "password"}
  //                 name="password"
  //                 autoComplete="current-password"
  //                 required
  //                 value={password}
  //                 onChange={(e) => setPassword(e.target.value)}
  //                 className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  //               />
  //               {visible ? (
  //                 <AiOutlineEye
  //                   onClick={() => setVisible(false)}
  //                   className="absolute right-3 top-3 cursor-pointer items-center"
  //                   size={25}
  //                 />
  //               ) : (
  //                 <AiOutlineEyeInvisible
  //                   onClick={() => setVisible(true)}
  //                   className="absolute right-3 top-3 cursor-pointer"
  //                   size={25}
  //                 />
  //               )}
  //             </div>
  //           </div>
  //           <div className="flex items-center justify-between">
  //             <div className="flex items-center">
  //               <input
  //                 type="checkbox"
  //                 name="remember-me"
  //                 id="remember-me"
  //                 className="h-4 w-4 text-purple-500 focus:ring-purple-500 rounded"
  //               />
  //               <label
  //                 htmlFor="remember-me"
  //                 className="ml-2 block text-sm text-purple-900"
  //               >
  //                 Remember me
  //               </label>
  //             </div>
  //             <div className="text-sm">
  //               <a
  //                 href=".forgot-password"
  //                 className="font-medium text-purple-600 hover:text-pink-600"
  //               >
  //                 Forgot your password?
  //               </a>
  //             </div>
  //           </div>
  //           <div>
  //             <button
  //               type="submit"
  //               className="group relative w-full h-[40px] flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-700 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-500 hover:text-black hover:border-purple-500"
  //             >
  //               Sign In
  //             </button>
  //           </div>
  //           <div className="flex items-center w-full">
  //             <h4>New here?</h4>
  //             <Link to="/sign-up" className="text-pink-600 pl-2">
  //               Sign Up
  //             </Link>
  //           </div>
  //         </form>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="min-h-screen relative overflow-hidden flex justify-center items-center">
      {/* Floating crochet items background */}
      <CrochetBackground />

      {/* Login form - keeping original width (w-1/2) */}
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

// Component for crochet background with larger elements
const CrochetBackground = () => {
  // Array of colors for yarn balls
  const yarnColors = [
    "#f472b6", // Pink
    "#a855f7", // Purple
    "#60a5fa", // Blue
    "#34d399", // Green
    "#fbbf24", // Yellow
    "#fb923c", // Orange
    "#f87171", // Red
    "#d8b4fe", // Lavender
    "#c4b5fd", // Light purple
    "#bae6fd", // Light blue
  ];

  // Generate SVG elements for large yarn balls and hooks
  const generateCrochetItems = () => {
    const items = [];

    // Generate 8 large yarn balls with different colors
    for (let i = 0; i < 8; i++) {
      const color = yarnColors[Math.floor(Math.random() * yarnColors.length)];
      const darkColor = adjustColorBrightness(color, -30); // Darker shade for details

      // Large yarn ball
      items.push({
        element: (
          <svg
            key={`yarn-${i}`}
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="60" cy="60" r="50" fill={color} fillOpacity="0.8" />
            <path
              d="M30,60 Q60,20 90,60"
              stroke={darkColor}
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M30,60 Q60,100 90,60"
              stroke={darkColor}
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M40,50 Q60,30 80,50"
              stroke={darkColor}
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M40,70 Q60,90 80,70"
              stroke={darkColor}
              strokeWidth="2"
              fill="none"
            />
          </svg>
        ),
        type: "yarn",
      });
    }

    // Generate 4 large crochet hooks
    for (let i = 0; i < 4; i++) {
      const hookColor = "#9333ea"; // Purple hook color

      // Large crochet hook
      items.push({
        element: (
          <svg
            key={`hook-${i}`}
            width="200"
            height="50"
            viewBox="0 0 200 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="10"
              y="20"
              width="160"
              height="10"
              rx="5"
              fill={hookColor}
            />
            <path
              d="M170,25 Q190,25 180,40"
              stroke={hookColor}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
            />
            <rect
              x="10"
              y="15"
              width="50"
              height="20"
              rx="5"
              fill={adjustColorBrightness(hookColor, 20)}
            />
          </svg>
        ),
        type: "hook",
      });
    }

    return items;
  };

  // Helper function to adjust color brightness
  const adjustColorBrightness = (hex, percent) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;

    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 0 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  // Generate random positions for each item
  const [items, setItems] = useState([]);

  useEffect(() => {
    const crochetItems = generateCrochetItems();
    const newItems = [];

    crochetItems.forEach((item, i) => {
      // Different positioning logic depending on item type
      let left, top, rotation, duration, delay, scale;

      if (item.type === "yarn") {
        // Yarn balls positioning
        left = 5 + Math.random() * 90; // 5-95%
        top = 5 + Math.random() * 90; // 5-95%
        rotation = Math.random() * 360;
        duration = 30 + Math.random() * 20; // 30-50s
        delay = Math.random() * 10;
        scale = 0.8 + Math.random() * 0.4; // 0.8-1.2
      } else {
        // Hook positioning
        left = 10 + Math.random() * 80; // 10-90%
        top = 10 + Math.random() * 80; // 10-90%
        rotation = Math.random() * 180;
        duration = 35 + Math.random() * 15; // 35-50s
        delay = Math.random() * 10;
        scale = 0.7 + Math.random() * 0.3; // 0.7-1.0
      }

      newItems.push({
        element: item.element,
        style: {
          position: "absolute",
          left: `${left}%`,
          top: `${top}%`,
          transform: `rotate(${rotation}deg) scale(${scale})`,
          opacity: 0.7,
          animation: `float-${i} ${duration}s infinite ease-in-out ${delay}s`,
          zIndex: Math.floor(Math.random() * 5),
        },
        keyframes: `
          @keyframes float-${i} {
            0% {
              transform: translate(0, 0) rotate(${rotation}deg) scale(${scale});
            }
            33% {
              transform: translate(${Math.random() * 30 - 15}px, ${
          Math.random() * 30 - 15
        }px) rotate(${rotation + 5}deg) scale(${scale});
            }
            66% {
              transform: translate(${Math.random() * 30 - 15}px, ${
          Math.random() * 30 - 15
        }px) rotate(${rotation - 5}deg) scale(${scale});
            }
            100% {
              transform: translate(0, 0) rotate(${rotation}deg) scale(${scale});
            }
          }
        `,
      });
    });

    setItems(newItems);
  }, []);

  return (
    <>
      <style>{items.map((item) => item.keyframes).join("\n")}</style>
      <div className="absolute inset-0 overflow-hidden">
        {items.map((item, index) => (
          <div key={index} style={item.style}>
            {item.element}
          </div>
        ))}
      </div>
    </>
  );
};

export default Login;
