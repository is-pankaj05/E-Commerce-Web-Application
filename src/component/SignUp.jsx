import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function SignUp() {
  const { currentUser, signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    identifier: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to home
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.identifier.trim()) {
      setError("Please enter your Email or User ID.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    const result = signup({
      name: formData.name,
      identifier: formData.identifier,
      password: formData.password,
    });
    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-8">
      {/* Zelo Brand Logo */}
      <Link to="/" className="mb-6 flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-2xl shadow-md group-hover:scale-105 transition transform">
          Z
        </div>
        <span className="text-3xl font-black tracking-tight text-gray-900">
          Zelo<span className="text-amber-500">.</span>
        </span>
      </Link>

      {/* Sign Up Box */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Zelo Account</h1>
        <p className="text-xs text-gray-500 mb-6">
          Sign up to unlock special member deals and track your orders
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-lg">
            <div className="font-semibold">Registration Error</div>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="First and last name"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="identifier"
              className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider"
            >
              Email or User ID
            </label>
            <input
              id="identifier"
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="e.g. user@example.com or username"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-blue-600 hover:underline cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              ℹ Passwords must be at least 6 characters.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-gray-900 font-bold py-3 px-4 rounded-xl shadow-sm transition text-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs text-gray-500 uppercase">
            <span className="bg-white px-3 font-semibold">Already have an account?</span>
          </div>
        </div>

        <Link
          to="/signin"
          className="w-full block text-center bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl text-sm transition"
        >
          Sign In with your ID & Password
        </Link>
      </div>

      <div className="mt-6 text-xs text-gray-500 max-w-md text-center">
        By creating an account, you agree to Zelo's Conditions of Use and Privacy Notice.
      </div>
    </div>
  );
}

export default SignUp;
