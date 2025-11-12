import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const ErrorPage = () => {
  return (
    <div
      className="min-h-fit flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="text-center">
        <div>
          <div className="relative inline-block">
            <h1
              className="text-7xl sm:text-8xl md:text-9xl lg:text-[200px] font-bold opacity-20"
              style={{ color: "var(--text-primary)" }}
            >
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaExclamationTriangle className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-[#E5CBB8] animate-bounce" />
            </div>
          </div>
        </div>
        <div className="mb-6 sm:mb-8">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Page Not Found
          </h2>
          <p
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-2"
            style={{ color: "var(--text-secondary)" }}
          >
            We couldn't find the page you were looking for. It may have been
            moved or just doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-[#E5CBB8] hover:bg-[#d4b89e] text-black font-semibold rounded-lg transition duration-300 transform hover:scale-105 w-full sm:w-auto justify-center"
          >
            <FaHome />
            Go Back Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-[#E5CBB8] hover:bg-[#E5CBB8] font-semibold rounded-lg transition duration-300 w-full sm:w-auto justify-center"
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
