import React from "react";
import {
  Mail,
  Phone,
  Linkedin,
  Youtube,
  Send,
  ShieldCheck
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <img src="/banners/logo.png" alt="logo" className="h-8 w-auto" />
            <span className="text-white text-xl font-bold">Smart Shikshak</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail size={18} />
            <span>rajpootharsh895@gmail.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone size={18} />
            <span>+91 6202401870</span>
          </div>
          <div className="flex space-x-4 pt-2">
            <a href="#" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="#" aria-label="YouTube">
              <Youtube size={20} />
            </a>
            <a href="#" aria-label="Telegram">
              <Send size={20} />
            </a>
          </div>
          <div className="pt-4">
            <div className="inline-flex items-center px-3 py-1 bg-white text-black rounded-full">
              <ShieldCheck size={16} className="mr-2" />
              ISO CERTIFIED
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="text-sm space-y-2">
          <h3 className="text-white font-semibold text-lg border-b border-red-400 pb-1 w-fit">Company</h3>
          <p><a href="#">About us</a></p>
          <p><a href="#">FAQ</a></p>
          <p><a href="#">Privacy policy</a></p>
          <p><a href="#">Smart Shikshak IOI</a></p>
          <p><a href="#">Contact us</a></p>
          <p><a href="#">Career Services</a></p>
          <p><a href="#">Terms and Conditions</a></p>
        </div>

        {/* Right Section */}
        <div className="text-sm space-y-2">
          <h3 className="text-white font-semibold text-lg border-b border-red-400 pb-1 w-fit">Products</h3>
          <p><a href="#">Experience Portal</a></p>
          <p><a href="#">Hall of Fame</a></p>
          <p><a href="#">Become an Affiliate</a></p>
          <p><a href="#">Blog</a></p>
        </div>
      </div>

      {/* Floating Chat Icon */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-red-400 hover:bg-red-500 text-white p-3 rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h6m4 8H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
