import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  MdHome,
  MdDescription,
  MdBusiness,
  MdQuestionAnswer,
  MdInfo,
  MdDashboard,
  MdInsights,
  MdReceipt,
  MdLogin,
  MdPersonAdd,
} from "react-icons/md";
import { AuthContext } from "../../Provider/AuthProvider";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${
      isActive
        ? "bg-[#E5CBB8] text-black"
        : "text-white hover:bg-[#E5CBB8]/20 hover:text-[#E5CBB8]"
    }`;

  const publicLinks = [
    { to: "/", label: "Home", icon: <MdHome className="w-5 h-5" /> },
    {
      to: "/bills",
      label: "Bills",
      icon: <MdDescription className="w-5 h-5" />,
    },
    {
      to: "/providers",
      label: "Providers",
      icon: <MdBusiness className="w-5 h-5" />,
    },
    {
      to: "/faq",
      label: "FAQ",
      icon: <MdQuestionAnswer className="w-5 h-5" />,
    },
    { to: "/about", label: "About", icon: <MdInfo className="w-5 h-5" /> },
  ];

  const authLinks = user
    ? [
        {
          to: "/dashboard",
          label: "Dashboard",
          icon: <MdDashboard className="w-5 h-5" />,
        },
        {
          to: "/insights",
          label: "Insights",
          icon: <MdInsights className="w-5 h-5" />,
        },
        {
          to: "/mybills",
          label: "My Bills",
          icon: <MdReceipt className="w-5 h-5" />,
        },
      ]
    : [
       
      ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-black/95 backdrop-blur-md border-r border-gray-800 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Smart<span className="text-[#E5CBB8]">Bills</span>
            </h2>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {/* Public Links */}
            <div className="space-y-1">
              {publicLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={navLinkStyle}
                  onClick={onClose}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800 my-4"></div>

            {/* Auth Links */}
            <div className="space-y-1">
              {user && (
                <p className="text-xs text-gray-400 uppercase tracking-wider px-4 mb-2">
                  My Account
                </p>
              )}
              {authLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={navLinkStyle}
                  onClick={onClose}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
