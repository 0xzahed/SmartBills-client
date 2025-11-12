import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const ErrorPage = () => {
  return (
    <div
      className="min-h-fit flex items-center justify-center px-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="text-center">
        <div>
          <div className="relative inline-block">
            <h1
              className="text-9xl md:text-[200px] font-bold opacity-20"
              style={{ color: "var(--text-primary)" }}
            >
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaExclamationTriangle className="text-6xl md:text-8xl text-[#E5CBB8] animate-bounce" />
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Page Not Found
          </h2>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            We couldn't find the page you were looking for. It may have been
            moved or just doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#E5CBB8] hover:bg-[#d4b89e] text-black font-semibold rounded-lg transition duration-300 transform hover:scale-105"
          >
            <FaHome />
            Go Back Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#E5CBB8] hover:bg-[#E5CBB8] font-semibold rounded-lg transition duration-300"
            style={{ color: "var(--text-primary)" }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
