import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "./CardContext";
import { useAuth } from "./AuthContext";

function Header() {
  const { totalCount, wishlist, toast, setToast } = useContext(CartContext);
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/signin");
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md py-3 shadow-xs border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          {/* Brand Logo: Zelo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition transform">
              Z
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-amber-600 transition">
              Zelo<span className="text-amber-500">.</span>
            </span>
          </Link>

          {/* Right Action Icons: Wishlist, Cart & Profile Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Wishlist Icon — always visible, badge shown when items exist */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-200 text-gray-400 hover:text-red-500 transition duration-200 flex items-center justify-center"
              title={
                wishlist && wishlist.length > 0
                  ? `${wishlist.length} item(s) in Wishlist`
                  : "Wishlist"
              }
            >
              <svg
                className="w-5 h-5"
                fill={wishlist && wishlist.length > 0 ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {wishlist && wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-black text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-md ring-2 ring-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Styled Luxury Shopping Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-300 transition duration-200 group flex items-center justify-center cursor-pointer shadow-2xs"
              title="Shopping Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-800 group-hover:text-amber-600 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-md animate-bounce ring-2 ring-white">
                  {totalCount}
                </span>
              )}
            </Link>

            {/* Profile Icon with Dropdown Menu (Directly next to Cart) */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 border border-transparent hover:border-gray-200 transition cursor-pointer"
                  title="Account Menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-xs font-semibold text-gray-800 hidden md:inline-block max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Card */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-scale-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-[11px] text-gray-400 font-medium">Signed in as</p>
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {currentUser.name}
                      </p>
                    </div>

                    <div className="py-1">
                      {/* 1. Profile Option */}
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 hover:text-amber-600 transition font-medium"
                      >
                        <span className="text-sm">👤</span>
                        <span>Profile</span>
                      </Link>

                      {/* 2. Log Out Option */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition font-medium cursor-pointer"
                      >
                        <span className="text-sm">🚪</span>
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/signin"
                  className="text-xs font-bold bg-amber-400 hover:bg-amber-500 text-gray-900 px-3.5 py-2 rounded-xl shadow-2xs transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-xs font-semibold text-gray-700 hover:text-gray-900 hidden sm:inline-block px-2.5 py-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-gray-700 animate-slide-up max-w-sm">
          <div className="p-2 rounded-xl bg-amber-400 text-gray-900 shrink-0">
            {toast.type === "success" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            ) : (
              <span className="text-sm">ℹ️</span>
            )}
          </div>
          <div className="flex-1 text-xs">
            <p className="font-semibold">{toast.message}</p>
          </div>
          <Link
            to="/cart"
            onClick={() => setToast(null)}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline shrink-0"
          >
            View Cart
          </Link>
          <button
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-white text-xs shrink-0 cursor-pointer ml-1"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}

export default Header;
