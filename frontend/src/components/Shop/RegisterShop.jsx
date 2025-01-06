// import axios from "axios";
// import React, { useState } from "react";

// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { Link, useNavigate } from "react-router-dom";

// import { server } from "../../server";
// import { toast } from "react-toastify";
// import { RxAvatar } from "react-icons/rx";
// const RegisterShop = () => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [visible, setVisible] = useState(false);

//   const [name, setName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState();
//   const [address, setAddress] = useState("");
//   const [zipCode, setZipCode] = useState();
//   const [avatar, setAvatar] = useState();

//   const handleFileInputChange = (e) => {
//     const file = e.target.files[0];
//     setAvatar(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     await axios
//       .post(
//         `${server}/user/login-user`,
//         { email, password },
//         { withCredentials: true }
//       )
//       .then((res) => {
//         toast.success("Login Successful!");

//         navigate("/");

//         window.location.reload(true);
//       })
//       .catch((err) => {
//         toast.error(err.response.data.message);
//       });
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div className="bg-white rounded-lg shadow-lg py-10 px-24 w-1/2">
//         <div className="text-center mb-8">
//           <h2 className="text-2xl font-bold text-purple-500">
//             Become a Seller
//           </h2>
//           <h1 className="text-3xl font-bold text-pink-600">cozyCrochet</h1>
//         </div>
//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <div>
//             <label
//               htmlFor="name"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Shop Name
//             </label>
//             <div className="mt-3">
//               <input
//                 type="name"
//                 name="name"
//                 autoComplete="name"
//                 required
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email
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
//               htmlFor="phoneNumber"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Contact
//             </label>
//             <div className="mt-3">
//               <input
//                 type="number"
//                 name="phone-number"
//                 required
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="address"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Address
//             </label>
//             <div className="mt-3">
//               <input
//                 type="address"
//                 name="address"
//                 required
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="zipCode"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Zip Code
//             </label>
//             <div className="mt-3">
//               <input
//                 type="number"
//                 name="zipCode"
//                 required
//                 value={zipCode}
//                 onChange={(e) => setZipCode(e.target.value)}
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

//           <div>
//             <label
//               htmlFor="avatar"
//               className="block text-sm font-medium text-gray-700"
//             ></label>
//             <div className="mt-2 flex items-center">
//               <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
//                 {avatar ? (
//                   <img
//                     src={URL.createObjectURL(avatar)}
//                     alt="avatar"
//                     className="h-full w-full object-cover rounded-full"
//                   />
//                 ) : (
//                   <RxAvatar className="h-8 w-8" />
//                 )}
//               </span>
//               <label
//                 htmlFor="file-input"
//                 className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-purple-100 cursor-pointer"
//               >
//                 <span>Upload a file</span>
//                 <input
//                   type="file"
//                   name="avatar"
//                   id="file-input"
//                   accept=".jpg,.jpeg,.png"
//                   onChange={handleFileInputChange}
//                   className="sr-only"
//                 />
//               </label>
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
//             <h4>Already a seller?</h4>
//             <Link to="/shop-login" className="text-pink-600 pl-2">
//               Sign In
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterShop;

import axios from "axios";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";

const RegisterShop = () => {
  // const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [avatar, setAvatar] = useState(null);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newForm = new FormData();

    // const config = { headers: { "Content-Type": "multipart/form-data" } };

    newForm.append("name", name);
    newForm.append("email", email);
    newForm.append("password", password);
    newForm.append("avatar", avatar);
    newForm.append("zipCode", zipCode);
    newForm.append("address", address);
    newForm.append("phoneNumber", phoneNumber);

    axios
      .post(`${server}/shop/create-shop`, newForm)
      .then((res) => {
        if (res.data.success === true) {
          // navigate("/");
          toast.success(res.data.message);
          setName("");
          setEmail("");
          setPassword("");
          setAvatar();
          setZipCode();
          setAddress("");
          setPhoneNumber();
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-lg shadow-lg py-8 px-6 w-full max-w-2xl md:px-12">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-purple-500">
            Become a Seller
          </h2>
          <h1 className="text-3xl font-bold text-pink-600">cozyCrochet</h1>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Shop Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Contact
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="phone-number"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-gray-700"
            >
              Zip Code
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="zipCode"
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            <div className="mt-1 relative">
              <input
                type={visible ? "text" : "password"}
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {visible ? (
                <AiOutlineEye
                  onClick={() => setVisible(false)}
                  className="absolute right-3 top-3 cursor-pointer"
                  size={20}
                />
              ) : (
                <AiOutlineEyeInvisible
                  onClick={() => setVisible(true)}
                  className="absolute right-3 top-3 cursor-pointer"
                  size={20}
                />
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700"
            ></label>
            <div className="mt-2 flex items-center">
              <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="avatar"
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <RxAvatar className="h-8 w-8" />
                )}
              </span>
              <label
                htmlFor="file-input"
                className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-purple-100 cursor-pointer"
              >
                <span>Upload a file</span>
                <input
                  type="file"
                  name="avatar"
                  id="file-input"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileInputChange}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full h-[40px] flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-700 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-500 hover:text-black hover:border-purple-500"
            >
              Register
            </button>
          </div>

          <div className="flex items-center w-full">
            <h4>Already a seller?</h4>
            <Link to="/shop-login" className="text-pink-600 pl-2">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterShop;
