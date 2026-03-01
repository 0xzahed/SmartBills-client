import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import ChatWidget from "../Components/Chatbot/ChatWidget";

const Root = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - User Mode */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Root;
