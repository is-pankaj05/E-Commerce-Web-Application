import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-gray-300 text-xs">
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 py-3 text-center text-xs font-semibold tracking-wider transition cursor-pointer"
      >
        ▲ Back to top
      </button>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-xs">
            Get to Know Zelo
          </h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition">About Zelo</a></li>
            <li><a href="#" className="hover:text-white transition">Careers at Zelo</a></li>
            <li><a href="#" className="hover:text-white transition">Press Releases</a></li>
            <li><a href="#" className="hover:text-white transition">Zelo Science & Tech</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-xs">
            Connect with Us
          </h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition">Facebook</a></li>
            <li><a href="#" className="hover:text-white transition">Twitter / X</a></li>
            <li><a href="#" className="hover:text-white transition">Instagram</a></li>
            <li><a href="#" className="hover:text-white transition">YouTube</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-xs">
            Sell & Partner
          </h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition">Sell on Zelo</a></li>
            <li><a href="#" className="hover:text-white transition">Zelo Global Selling</a></li>
            <li><a href="#" className="hover:text-white transition">Become an Affiliate</a></li>
            <li><a href="#" className="hover:text-white transition">Fulfillment by Zelo</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-xs">
            Let Us Help You
          </h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition">Your Account</a></li>
            <li><a href="#" className="hover:text-white transition">Zelo Returns Center</a></li>
            <li><a href="#" className="hover:text-white transition">100% Purchase Protection</a></li>
            <li><a href="#" className="hover:text-white transition">Help & Customer Support</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">Zelo Store</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">Conditions of Use & Sale · Privacy Notice</span>
          </div>
          <p className="text-gray-400">
            © {new Date().getFullYear()} Zelo Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
