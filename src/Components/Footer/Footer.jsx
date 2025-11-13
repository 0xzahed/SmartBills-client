import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaRegCopyright,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="pt-12 pb-6 mt-16 border-t"
      style={{
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h2
            className="text-2xl font-extrabold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Smart<span className="text-[#E5CBB8]">Bills</span>
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage and pay your monthly utility bills securely and efficiently —
            all in one place. Simple, safe, and smart.
          </p>
        </div>

        <div>
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/"
                className="hover:text-[#E5CBB8] transition duration-300"
                style={{ color: "var(--text-secondary)" }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/bills"
                className="hover:text-[#E5CBB8] transition duration-300"
                style={{ color: "var(--text-secondary)" }}
              >
                Bills
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="hover:text-[#E5CBB8] transition duration-300"
                style={{ color: "var(--text-secondary)" }}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-[#E5CBB8] transition duration-300"
                style={{ color: "var(--text-secondary)" }}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Information
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/about"
                className="hover:text-[#E5CBB8] transition duration-300"
                style={{ color: "var(--text-secondary)" }}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="hover:text-[#E5CBB8] transition duration-300"
                style={{ color: "var(--text-secondary)" }}
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/policy"
                className="hover:text-[#E5CBB8] transition duration-300"
                style={{ color: "var(--text-secondary)" }}
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Connect With Us
          </h3>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              className="p-2 bg-[#E5CBB8]/20 hover:bg-[#E5CBB8] hover:text-black rounded-full transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              className="p-2 bg-[#E5CBB8]/20 hover:bg-[#E5CBB8] hover:text-black rounded-full transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              className="p-2 bg-[#E5CBB8]/20 hover:bg-[#E5CBB8] hover:text-black rounded-full transition"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              className="p-2 bg-[#E5CBB8]/20 hover:bg-[#E5CBB8] hover:text-black rounded-full transition"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div
        className="mt-10 pt-6 text-center text-sm flex flex-col items-center justify-center gap-1"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        <p
          className="flex items-center gap-1 justify-center"
          style={{ color: "var(--text-secondary)" }}
        >
          <FaRegCopyright className="inline-block text-[#E5CBB8]" />
          <span>
            {new Date().getFullYear()}{" "}
            <span className="text-[#E5CBB8] font-semibold">SmartBills</span>.
            All Rights Reserved.
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
