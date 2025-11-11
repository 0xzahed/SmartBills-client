import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "../../Provider/AuthProvider";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const { user, logOut } = useContext(AuthContext);

  const handleLogout = () => {
    logOut()
      .then(() => toast.success("Logged out successfully!"))
      .catch(() => toast.error("Logout failed! Please try again."));
  };

  const navLinkStyle = ({ isActive }) =>
    `relative px-4 py-2 text-[15px] font-medium tracking-wide transition-all duration-300 
     ${
       isActive
         ? "text-[#E5CBB8] after:w-full"
         : "text-white hover:text-[#E5CBB8]"
     }
     after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#E5CBB8] after:transition-all after:duration-300
     hover:after:w-full after:w-0`;

  const registerLinkStyle = ({ isActive }) =>
    `relative px-5 py-2 font-semibold rounded-md border transition-all duration-300 ${
      isActive
        ? "border-[#E5CBB8] bg-[#E5CBB8] text-black"
        : "border-[#E5CBB8] text-[#E5CBB8] hover:bg-[#E5CBB8] hover:text-black"
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

      {user ? (
        <li>
          <NavLink to="/my-pay-bills" className={navLinkStyle}>
            My Pay Bills
          </NavLink>
        </li>
      ) : (
        <>
          <li>
            <NavLink to="/auth/login" className={navLinkStyle}>
              Login
            </NavLink>
          </li>
          <li>
            <NavLink to="/auth/register" className={registerLinkStyle}>
              Register
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border border-gray-800 shadow-md rounded-xl mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">

      <Link
        to="/"
        className="text-2xl font-extrabold text-white tracking-tight hover:text-[#E5CBB8] transition-all duration-300"
      >
        Smart<span className="text-[#E5CBB8]">Bills</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <ul className="flex items-center gap-8">{links}</ul>
        {user ? (
          <>
            {/* Profile Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-2 text-white hover:text-[#E5CBB8] transition-colors duration-300"
                title={user.displayName || "User Profile"}
              >
                <img
                  src={
                    user.photoURL ||
                    "https://i.postimg.cc/5y8zTvMg/default-avatar.png"
                  }
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border-2 border-[#E5CBB8] object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://i.postimg.cc/5y8zTvMg/default-avatar.png";
                  }}
                />
              </button>

              <div className="absolute right-0 mt-2 w-40 bg-black/90 text-white border border-[#E5CBB8] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                <ul className="p-2">
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 hover:bg-[#E5CBB8] hover:text-black rounded-md transition"
                    >
                      <CiUser className="w-4 h-4" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-red-600 hover:text-white rounded-md transition"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <button
        onClick={toggleMenu}
        className="md:hidden text-white hover:text-[#E5CBB8] transition-colors duration-300"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <FiX className="h-6 w-6" />
        ) : (
          <FiMenu className="h-6 w-6" />
        )}
      </button>

      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-md border-t border-gray-800 md:hidden">
          <ul
            className="flex flex-col items-start px-6 py-4 space-y-3"
            onClick={toggleMenu}
          >
            {links}
            {user && (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-white hover:text-[#E5CBB8] transition"
                  >
                    <CiUser /> Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-white hover:text-red-500 transition"
                  >
                    <FiLogOut /> Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
