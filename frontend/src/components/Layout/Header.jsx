import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineClose,
  AiOutlineHeart,
  AiOutlineMenu,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiCategoryAlt } from "react-icons/bi";

import { useSelector } from "react-redux";
import logo from "../../assests/logo.webp";
import styles from "../../styles/styles";
import { categoriesData, productData } from "../../stat/data";
import DropDown from "./DropDown.jsx";
import Navbar from "./Navbar.jsx";

import { backend_url } from "../../server.js";

import Cart from "../cart/Cart.jsx";
import Wishlist from "../wishlist/Wishlist.jsx";

const Header = ({ activeHeading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);

  const [dropDown, setDropDown] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [openCart, setOpenCart] = useState(false);

  const [openWishlist, setOpenWishlist] = useState(false);

  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  // const { user, isAuthenticated, error } = useSelector((state) => state.user);

  // useEffect(() => {
  //   console.log(
  //     "User:",
  //     user,
  //     "Authenticated:",
  //     isAuthenticated,
  //     "Error:",
  //     error
  //   );
  // }, [user, isAuthenticated, error]);

  console.log(user);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      productData &&
      productData.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );

    setSearchData(filteredProducts);
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  return (
    <>
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div>
            <Link to="/">
              <img src={logo} width={60} alt="logo" />
            </Link>
          </div>
          <div className="w-[50%] relative">
            <input
              type="text"
              placeholder="search for product..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full h-[40px] px-2 border-[#86006b] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {searchData && searchData.length !== 0 ? (
              <div className="w-full absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4">
                {searchData &&
                  searchData.map((i, index) => {
                    const d = i.name;

                    const Product_name = d.replace(/\s+/g, "-");

                    return (
                      <Link to={`/product/${Product_name}`}>
                        <div className="w-full flex items-start py-3">
                          <img
                            src={i.image_Url[0].url}
                            alt="product"
                            className="w-[40px] h-[40px] mr-[10px] rounded-md"
                          />
                        </div>
                        <h1 className="text-gray-800">{i.name}</h1>
                      </Link>
                    );
                  })}
              </div>
            ) : null}
          </div>

          <div className="w-[200px] h-[55px] bg-gradient-to-tr from-pink-700 to-purple-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-gradient-to-tr hover:from-purple-700 hover:to-pink-700 hover:scale-105 duration-300">
            <Link to="/shop-create">
              <h1 className="text-white flex items-center">
                Become a Seller <IoIosArrowForward className="ml-2" />{" "}
              </h1>
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-[999]" : null
        } transition hidden 800px:flex items-center justify-between w-full bg-gray-50`}
        // bg-gradient-to-br from-[#c9b1df] to-[#8b6293]
      >
        <div
          className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
        >
          <div onClick={() => setDropDown(!dropDown)}>
            <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
              <BiCategoryAlt size={30} className="absolute top-1 left-2" />
              <button
                className={`h-[100%] w-full flex justify-between items-center pl-12 pb-5 text-lg font-semibold select-none rounded-t-md`}
              >
                Categories
              </button>

              <IoIosArrowDown
                size={30}
                className="absolute left-36 top-1 cursor-pointer"
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
          </div>
          <div className="flex items-center">
            <Navbar active={activeHeading} />
          </div>

          <div className="flex">
            <div className="flex items-center">
              <div
                className="cursor-pointer relative mr-[15px] hover:scale-105 duration-200"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={30} className="text-red-800" />
                <span className="absolute right-0 top-0 rounded-full bg-red-300 w-4 h-4 top right font-semibold text-purple-800 text-xs leading-tight text-center">
                  0
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div
                className="cursor-pointer relative mr-[15px] hover:scale-105 duration-200"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart size={30} className="text-red-800" />
                <span className="absolute right-0 top-0 rounded-full bg-red-300 w-4 h-4 top right font-semibold text-purple-800 text-xs leading-tight text-center">
                  0
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="cursor-pointer relative mr-[15px] hover:scale-105 duration-200">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={`${backend_url}${user.avatar}`}
                      alt="avatar"
                      className="w-[40px] h-[40px] rounded-full"
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={30} className="text-red-800" />
                  </Link>
                )}
              </div>
            </div>

            {/* cart */}

            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

            {/* wishlist */}

            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div
        className={`${
          active ? "fixed top-0 left-0 z-50 w-full shadow-md bg-white" : ""
        } flex items-center justify-between p-4 800px:hidden`}
      >
        <div onClick={() => setOpenMobileMenu(!openMobileMenu)}>
          {openMobileMenu ? (
            <AiOutlineClose size={30} className="text-red-800" />
          ) : (
            <AiOutlineMenu size={30} className="text-red-800" />
          )}
        </div>
        <Link to="/">
          <img src={logo} width={50} alt="logo" />
        </Link>
        <div
          className="cursor-pointer relative mr-[15px] hover:scale-105 duration-200"
          onClick={() => setOpenCart(true)}
        >
          <AiOutlineShoppingCart size={30} className="mx-3 text-red-800" />
          <span className="absolute right-2 top-0 rounded-full bg-red-300 w-4 h-4 top right font-semibold text-purple-800 text-xs leading-tight text-center">
            0
          </span>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {openMobileMenu && (
        <>
          <div className="absolute pt-2 z-50">
            <div
              className="cursor-pointer relative mr-[15px] hover:scale-105 duration-200 mx-2"
              onClick={() => setOpenWishlist(true)}
            >
              <AiOutlineHeart size={30} className="text-red-800" />
              <span className="absolute right-54 top-0 rounded-full bg-red-300 w-4 h-4 top right font-semibold text-purple-800 text-xs leading-tight text-center">
                0
              </span>
            </div>
            <div className="w-[70%] px-3 pb-2 pt-4 relative">
              <input
                type="text"
                placeholder="search..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full h-[40px] px-2 border-[#86006b] border-[2px] rounded-md"
              />
              <AiOutlineSearch
                size={25}
                className="absolute right-4 top-6 cursor-pointer"
              />
              {searchData && searchData.length !== 0 ? (
                <div className="w-full left-0 absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4">
                  {searchData &&
                    searchData.map((i, index) => {
                      const d = i.name;

                      const Product_name = d.replace(/\s+/g, "-");

                      return (
                        <Link to={`/product/${Product_name}`}>
                          <div className="w-full flex items-start py-3">
                            <img
                              src={i.image_Url[0].url}
                              alt="product"
                              className="w-[40px] h-[40px] mr-[10px] rounded-md"
                            />
                          </div>
                          <h1 className="text-gray-800">{i.name}</h1>
                        </Link>
                      );
                    })}
                </div>
              ) : null}
            </div>
          </div>
          <div className="absolute top-[70px] left-0 w-3/6 h-auto bg-white shadow-md z-40 py-4 flex flex-col 800px:hidden">
            <Navbar active={activeHeading} />
            <div className="absolute bottom-3 left-2 w-[140px] h-[45px] bg-gradient-to-tr from-pink-700 to-purple-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-gradient-to-tr hover:from-purple-700 hover:to-pink-700 hover:scale-105 duration-300">
              <Link to="/shop-create">
                <h1 className="text-white text-[12px] flex items-center">
                  Become a Seller <IoIosArrowForward className="ml-2" />{" "}
                </h1>
              </Link>
            </div>
            <div className="flex absolute left-16 bottom-20">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={`${backend_url}${user.avatar}`}
                    alt="avatar"
                    className="w-[35px] h-[35px] rounded-full"
                  />
                </Link>
              ) : (
                <Link to="/login">
                  <CgProfile size={30} />
                </Link>
              )}
            </div>
          </div>
        </>
      )}

      {/* Cart & Wishlist Modals */}
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  );
};

export default Header;
