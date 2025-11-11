import React, { useState, useEffect } from "react";
import { BsSun, BsMoonStars } from "react-icons/bs";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = savedTheme === "dark";

    setIsDark(prefersDark);
    document.documentElement.setAttribute(
      "data-theme",
      prefersDark ? "dark" : "light"
    );
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    localStorage.setItem("theme", newTheme ? "dark" : "light");

    document.documentElement.setAttribute(
      "data-theme",
      newTheme ? "dark" : "light"
    );
  };

  return (
    <div className="flex items-center">
      <div
        className="theme-toggle"
        onClick={toggleTheme}
        role="button"
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <div className="theme-toggle-switch">
          {isDark ? <BsMoonStars size={12} /> : <BsSun size={12} />}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
