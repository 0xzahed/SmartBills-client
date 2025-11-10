import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinkStyle = ({ isActive }) =>
    `px-[15px] py-[10px] rounded-md font-medium transition-colors duration-300 ${
      isActive
        ? "bg-[#DAC6BD] text-[#121212]"
        : "text-[#DAC6BD] hover:bg-[#DAC6BD] hover:text-[#121212]"
    }`;

  const registerLinkStyle = ({ isActive }) =>
    `px-[15px] py-[10px] rounded-md font-medium transition-colors duration-300 ${
      isActive
        ? "bg-white text-black font-semibold"
        : "bg-white text-black hover:bg-gray-200"
    }`;

  const links = (
    <>
      <li>
        <NavLink to="/" className={navLinkStyle}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/bills" className={navLinkStyle}>
          Bills
        </NavLink>
      </li>
      <li>
        <Link to="/auth/login" className={navLinkStyle}>
          Login
        </Link>
      </li>
      <li>
        <Link to="/auth/register" className={registerLinkStyle}>
          Register
        </Link>
      </li>
    </>
  );

  return (
    <nav className="w-full bg-[#121212] text-white py-3 px-8 flex justify-between items-center shadow-md sticky top-0 z-50">
      <Link
        to="/"
        className="text-2xl font-bold tracking-tight text-white hover:text-white transition-colors duration-300"
      >
        SmartBills
      </Link>

      <ul className="hidden md:flex items-center gap-6 text-[15px] font-medium">
        {links}
      </ul>

      <button
        onClick={toggleMenu}
        className="md:hidden text-[#DAC6BD] hover:text-white transition-colors duration-300 p-2"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
      </button>

      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#121212] border-t border-gray-700 md:hidden">
          <ul
            className="flex flex-col items-start px-6 py-4 space-y-3"
            onClick={toggleMenu}
          >
            {links}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
