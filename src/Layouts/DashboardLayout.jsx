import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";
import Navbar from "../Components/Navbar/Navbar";
import {
  MdDashboard,
  MdReceipt,
  MdPerson,
  MdInsights,
  MdPayment,
  MdHome,
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
      path: "/",
      label: "Back to Home",
      icon: <MdHome className="w-5 h-5" />,
    },
    {
      path: "/dashboard",
      label: "Dashboard",
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
  ];

  const sidebarLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
      isActive
        ? "bg-[#E5CBB8] text-black font-semibold"
        : "text-base-content hover:bg-base-300"
    }`;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="flex">
        <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-65px)]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
