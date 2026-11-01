import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useContext } from "react";
import { CartContext } from "./CardContext";

function Profile() {
  const { currentUser, updateProfile, logout } = useAuth();
  const { wishlist, cart } = useContext(CartContext);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "+91 98765 43210");
  const [address, setAddress] = useState(
    currentUser?.address || "221B Baker Street, New Delhi, India"
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) {
    return null;
  }

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name, phone, address });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-amber-600 transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">My Account & Profile</span>
        </nav>

        {savedSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-semibold flex items-center justify-between">
            <span>✓ Profile details updated successfully!</span>
            <button
              onClick={() => setSavedSuccess(false)}
              className="text-green-800 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Card Sidebar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-md mb-4 ring-4 ring-amber-100">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{currentUser.name}</h2>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              {currentUser.identifier}
            </p>
            <span className="mt-3 text-[11px] font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Zelo Prime Member
            </span>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 w-full mt-6 pt-6 border-t border-gray-100">
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-lg font-bold text-gray-900">
                  {cart.length}
                </span>
                <p className="text-[10px] text-gray-500 uppercase font-semibold">
                  Cart Items
                </p>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-lg font-bold text-gray-900">
                  {wishlist.length}
                </span>
                <p className="text-[10px] text-gray-500 uppercase font-semibold">
                  Wishlist
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full mt-6 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer"
            >
              Sign Out from Device
            </button>
          </div>

          {/* Account Details Box */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Personal Information
                </h3>
                <p className="text-xs text-gray-500">
                  Manage your personal details and delivery addresses
                </p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Edit Profile ✏️
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Default Shipping Address
                  </label>
                  <textarea
                    rows="3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-[11px] font-bold text-gray-400 uppercase block">
                      Name
                    </span>
                    <span className="font-semibold text-gray-900">
                      {currentUser.name}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-[11px] font-bold text-gray-400 uppercase block">
                      User ID / Email
                    </span>
                    <span className="font-semibold text-gray-900 font-mono text-xs">
                      {currentUser.identifier}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-[11px] font-bold text-gray-400 uppercase block">
                      Phone Number
                    </span>
                    <span className="font-semibold text-gray-900">
                      {currentUser.phone || "+91 98765 43210"}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-[11px] font-bold text-gray-400 uppercase block">
                      Member Since
                    </span>
                    <span className="font-semibold text-gray-900">
                      {currentUser.memberSince || "Nov 2026"}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-[11px] font-bold text-gray-400 uppercase block">
                    Default Delivery Address
                  </span>
                  <p className="font-semibold text-gray-900 mt-1">
                    {currentUser.address || "221B Baker Street, New Delhi, India"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

