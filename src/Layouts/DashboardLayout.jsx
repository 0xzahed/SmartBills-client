import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import {
  MdDashboard,
  MdReceipt,
  MdPerson,
  MdInsights,
  MdPayment,
} from "react-icons/md";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import ThemeToggle from "../Components/ThemeToggle/ThemeToggle";

const DashboardLayout = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

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
            navigate("/");
          })
          .catch(() => {
            toast.error("Logout failed! Please try again.");
          });
      }
    });
  };

  const sidebarLinks = [
    {
      path: "/dashboard",
      label: "Dashboard Home",
      icon: <MdDashboard className="w-5 h-5" />,
    },
    {
      path: "/mybills",
      label: "My Bills",
      icon: <MdReceipt className="w-5 h-5" />,
    },
    {
      path: "/insights",
      label: "Insights",
      icon: <MdInsights className="w-5 h-5" />,
    },
    {
      path: "/bills",
      label: "Pay Bills",
      icon: <MdPayment className="w-5 h-5" />,
    },
    {
      path: "/profile",
      label: "Profile",
      icon: <MdPerson className="w-5 h-5" />,
    },
  ];

  const sidebarLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
      isActive
        ? "bg-[#E5CBB8] text-black font-semibold"
        : "text-base-content hover:bg-base-300"
    }`;

  return (
    <div className="min-h-screen bg-base-100">
      {/* Top Navbar */}
      <div
        className="sticky top-0 z-50 border-b border-gray-800 shadow-md"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      >
        <div className="navbar max-w-full px-4 lg:px-6">
          <div className="flex-1">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="btn btn-ghost btn-circle lg:hidden"
            >
              {isSidebarOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
            <Link to="/" className="text-2xl font-extrabold ml-2">
              Smart<span className="text-[#E5CBB8]">Bills</span>
            </Link>
          </div>

          <div className="flex-none gap-2">
            <ThemeToggle />

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full ring ring-[#E5CBB8] ring-offset-base-100 ring-offset-2">
                  <img
                    src={
                      user?.photoURL ||
                      "https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=128"
                    }
                    alt="User Avatar"
                    onError={(e) => {
                      e.target.src =
                        "https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=128";
                    }}
                  />
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-base-100 border border-base-300 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-base-300">
                    <p className="font-semibold text-sm">
                      {user?.displayName || "User"}
                    </p>
                    <p className="text-xs text-base-content/70 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <ul className="p-2">
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-base-200 rounded-md transition"
                      >
                        <MdPerson className="w-4 h-4" />
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-base-200 rounded-md transition"
                      >
                        <MdDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 rounded-md transition"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-[65px] left-0 h-[calc(100vh-65px)] w-64 border-r border-gray-800 z-40 transform transition-transform duration-300 lg:transform-none ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        >
          <div className="p-4 h-full overflow-y-auto">
            <nav className="space-y-2">
              {sidebarLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={sidebarLinkStyle}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base-content hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-all duration-300 mt-4"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-65px)] max-w-[calc(100vw-256px)] lg:max-w-none">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
