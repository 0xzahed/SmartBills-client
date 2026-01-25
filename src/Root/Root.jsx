import React, { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "../Components/Navbar/Navbar";
import Sidebar from "../Components/Sidebar/Sidebar";
import Footer from "../Components/Footer/Footer";
import ChatWidget from "../Components/Chatbot/ChatWidget";

const Root = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <Navbar onMenuToggle={toggleSidebar} />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </div>
  );
};

export default Root;
