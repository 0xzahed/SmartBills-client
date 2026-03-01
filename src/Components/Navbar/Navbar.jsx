import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { AuthContext } from "../../Provider/AuthProvider";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const { user, logOut } = useContext(AuthContext);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

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

  // Navigation Links
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/bills", label: "Bills" },
    { to: "/providers", label: "Providers" },
    { to: "/faq", label: "FAQ" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const navLinkStyle = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
      isActive
        ? "bg-[#E5CBB8] text-black"
        : "text-white hover:bg-[#E5CBB8]/20 hover:text-[#E5CBB8]"
    }`;

  return (
    <>
      <nav
        className="sticky top-0 z-40 backdrop-blur-md border-b border-gray-800 shadow-md px-4 sm:px-6 py-3 bg-black"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Smart<span className="text-[#E5CBB8]">Bills</span>
              </h2>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={navLinkStyle}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right: Theme Toggle + Profile */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="flex items-center gap-2 text-white hover:text-[#E5CBB8] transition-colors duration-300"
                  title={user.name || user.displayName || "User Profile"}
                >
                  <img
                    src={
                      user.photoURL ||
                      "https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=128"
                    }
                    alt="User Avatar"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#E5CBB8] object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=128";
                    }}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-black/95 text-white border border-[#E5CBB8] rounded-lg shadow-lg z-50">
                    <ul className="p-2">
                      <li>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#E5CBB8] hover:text-black rounded-md transition"
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
                          className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-red-600 hover:text-white rounded-md transition"
                        >
                          <FiLogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="px-4 py-2 bg-[#E5CBB8] text-black font-medium rounded-lg hover:bg-[#d4b89f] transition-colors duration-300"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden text-white hover:text-[#E5CBB8] transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenuAlt3 className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={navLinkStyle}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
