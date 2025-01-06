import React from "react";
import { navItems } from "../../stat/data";
import { Link } from "react-router-dom";

const Navbar = ({ active }) => {
  return (
    <div className="pt-24 pb-[120px] 800px:py-4 800px:flex items-center">
      {navItems &&
        navItems.map((i, index) => (
          <div className="flex" key={index}>
            <Link
              to={i.url}
              className={`${
                active === index + 1 ? "text-[#d32c74]" : "text-[#540554]"
              } py-2 800px:py-0 font-semibold px-6 cursor-pointer hover:scale-105 duration-200`}
            >
              {i.title}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Navbar;
