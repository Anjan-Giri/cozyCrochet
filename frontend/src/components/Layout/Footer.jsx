import React from "react";

import {
  AiFillFacebook,
  AiOutlineInstagram,
  AiOutlineTikTok,
  AiOutlineX,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footerCompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../stat/data";
import logo from "../../assests/logo.png";

const Footer = () => {
  return (
    <div className="bg-[#000000] text-white">
      <div className="grid grid-cols-1 sm:gird-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-12 sm:text-center">
        <ul className="px-5 text-center sm:text-start flex sm:block flex-col items-center">
          <img
            src={logo}
            alt="logo"
            className="w-[90px] h-[90px]"
            // style={{ filter: "brightness(0) invert(1)" }}
          />
          <br />
          <p>Go to place for crochet accesories and products.</p>
          <div className="flex items-center mt-[25px]">
            <a
              href="https://www.facebook.com/anjan.giri.425696/"
              target="_blank"
            >
              <AiFillFacebook size={25} className="cursor-pointer" />{" "}
            </a>
            <a href="https://x.com/Anjan75531097" target="_blank">
              <AiOutlineX
                size={25}
                style={{ marginLeft: "15px", cursor: "pointer" }}
              />
            </a>
            <a href="https://www.instagram.com/handcrafts2024" target="_blank">
              <AiOutlineInstagram
                size={25}
                style={{ marginLeft: "15px", cursor: "pointer" }}
              />
            </a>
            <a href="https://www.tiktok.com/@handcrafts_1" target="_blank">
              <AiOutlineTikTok
                size={25}
                style={{ marginLeft: "15px", cursor: "pointer" }}
              />
            </a>
          </div>
        </ul>

        <ul className="text-center sm:text-start pt-12">
          <h1 className="mb-1 font-semibold">Company</h1>
          {footerCompanyLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
               text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start pt-12">
          <h1 className="mb-1 font-semibold">Shop</h1>
          {footerProductLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
               text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start pt-12">
          <h1 className="mb-1 font-semibold">Support</h1>
          {footerSupportLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
               text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center text-center pt-2 text-gray-400 text-sm pb-8 justify-center">
        <span>© 2024 cozyCrochet</span>
      </div>
    </div>
  );
};

export default Footer;
