import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import ChatWidget from "../Components/Chatbot/ChatWidget";

const Root = () => {
  return (
    <div>
      <div className="p-4">
        <Navbar></Navbar>
      </div>
      <Outlet></Outlet>
      <Footer></Footer>
      <ChatWidget />
    </div>
  );
};

export default Root;
