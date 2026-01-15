import React from "react";
import Topbar from "../layout/Topbar";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className=" top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
      {/* topbar */}
      <Topbar />
      {/* navbar */}
      <Navbar />
      {/* cart drawer */}
    </header>
  );
};

export default Header;
