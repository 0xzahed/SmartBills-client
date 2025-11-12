import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "../../Provider/AuthProvider";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const { user, logOut } = useContext(AuthContext);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut()
          .then(() => {
            toast.success("Logged out successfully!");
            Swal.fire({
              title: "Logged Out!",
              text: "You have been logged out successfully.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
          })
          .catch(() => {
            toast.error("Logout failed! Please try again.");
            Swal.fire({
              title: "Error!",
              text: "Logout failed. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      }
    });
  };

  const navLinkStyle = ({ isActive }) =>
    `relative px-2 sm:px-3 md:px-4 py-2 text-sm sm:text-[15px] font-medium tracking-wide transition-all duration-300 
     ${
       isActive
         ? "text-[#E5CBB8] after:w-full"
         : "text-white hover:text-[#E5CBB8]"
     }
     after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#E5CBB8] after:transition-all after:duration-300
     hover:after:w-full after:w-0`;

  const registerLinkStyle = ({ isActive }) =>
    `relative px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 text-sm sm:text-base font-semibold rounded-md border transition-all duration-300 ${
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
      <li>
        <NavLink to="/about" className={navLinkStyle}>
          About Us
        </NavLink>
      </li>
      <li>
        <NavLink to="/contact" className={navLinkStyle}>
          Contact Us
        </NavLink>
      </li>

      {user ? (
        <li>
          <NavLink to="/mybills" className={navLinkStyle}>
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
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border border-gray-800 shadow-md rounded-xl mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 flex items-center justify-between"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <Link
        to="/"
        className="text-xl sm:text-2xl font-extrabold text-white tracking-tight hover:text-[#E5CBB8] transition-all duration-300"
      >
        Smart<span className="text-[#E5CBB8]">Bills</span>
      </Link>
      <div className="hidden lg:flex items-center gap-6 xl:gap-8">
        <ul className="flex items-center gap-6 xl:gap-8">{links}</ul>

        <ThemeToggle />

        {user ? (
          <>
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfile}
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

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-black/90 text-white border border-[#E5CBB8] rounded-lg shadow-lg z-10">
                  <ul className="p-2">
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-2 sm:px-3 py-2 text-sm hover:bg-[#E5CBB8] hover:text-black rounded-md transition"
                      >
                        <CiUser className="w-4 h-4" />
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-2 sm:px-3 py-2 text-sm hover:bg-red-600 hover:text-white rounded-md transition"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      <button
        onClick={toggleMenu}
        className="lg:hidden text-white hover:text-[#E5CBB8] transition-colors duration-300"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <FiX className="h-5 w-5 sm:h-6 sm:w-6" />
        ) : (
          <FiMenu className="h-5 w-5 sm:h-6 sm:w-6" />
        )}
      </button>

      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-md border-t border-gray-800 lg:hidden">
          <ul
            className="flex flex-col items-start px-4 sm:px-6 py-3 sm:py-4 space-y-2 sm:space-y-3"
            onClick={toggleMenu}
          >
            {links}

            <li className="w-full">
              <div className="text-white">
                <ThemeToggle />
              </div>
            </li>

            {user && (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-sm sm:text-base text-white hover:text-[#E5CBB8] transition"
                  >
                    <CiUser className="w-4 h-4 sm:w-5 sm:h-5" /> Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm sm:text-base text-white hover:text-red-500 transition"
                  >
                    <FiLogOut className="w-4 h-4 sm:w-5 sm:h-5" /> Logout
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
