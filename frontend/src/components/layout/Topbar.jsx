import React from "react";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { FaFacebookF } from "react-icons/fa";   // ✅ Facebook
import { FaTiktok } from "react-icons/fa";      // ✅ TikTok

const Topbar = () => {
  return (
    <div className="bg-rabbit-red text-white">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        {/* Icônes réseaux sociaux */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="hover:text-gray-300">
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <RiTwitterXLine className="h-4 w-4" />
          </a>
          <a href="https://www.facebook.com/share/1AAyn1W8kJ/" className="hover:text-gray-300">
            <FaFacebookF className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <FaTiktok className="h-5 w-5" />
          </a>
        </div>

        {/* Message central */}
        <div className="text-sm text-center flex-grow-0">
          <span> we ship - fast and reliable shipping!</span>
        </div>

        {/* Contact téléphone */}
        <div className="text-sm hidden md:block">
          <a href="tel:+237672030842" className="hover:text-gray-300">
            (+237) 681423149
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
