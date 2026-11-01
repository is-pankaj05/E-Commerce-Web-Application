import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ForgotPassword() {
  const { findUserByEmail, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Multi-step state: 1 = Email, 2 = OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);

  // Form states
  const [email, setEmail] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Feedback states
  const [error, setError] = useState("");
  const [emailPreviewUrl, setEmailPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // Email format validation regex
  const isValidEmail = (emailStr) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr.trim());
  };

  // Resend countdown timer
  useEffect(() => {
    let interval = null;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // STEP 1: Handle Email Submit (Calls server API /api/send-otp)
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address (e.g. user@example.com).");
      return;
    }

    setLoading(true);

    // Verify user exists in Zelo
    const existingUser = findUserByEmail(email);
    if (!existingUser) {
      setLoading(false);
      setError(
        "No Zelo account found with this email. Please check your email address or create a new account."
      );
      return;
    }

    try {
      // Dispatch via server backend
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        if (data.previewUrl) {
          setEmailPreviewUrl(data.previewUrl);
        }
        setResendTimer(60);
        setStep(2);
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      console.error("API error:", err);
      setError("Failed to connect to server. Please ensure server is running.");
    }
  };

  // STEP 2: Handle OTP Verification (Calls server API /api/verify-otp)
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!enteredOtp.trim()) {
      setError("Please enter the 6-digit OTP code received.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: enteredOtp.trim(),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        // OTP verified successfully by server -> proceed to reset password
        setStep(3);
      } else {
        setError(
          data.message ||
            "Incorrect OTP code! Please check your email or terminal and enter the exact 6-digit code."
        );
      }
    } catch (err) {
      setLoading(false);
      console.error("Verification error:", err);
      setError("Error verifying OTP with server. Please try again.");
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        if (data.previewUrl) {
          setEmailPreviewUrl(data.previewUrl);
        }
        setResendTimer(60);
      } else {
        setError(data.message || "Failed to resend code.");
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to connect to server.");
    }
  };

  // STEP 3: Handle Password Reset
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match! Please verify both fields.");
      return;
    }

    setLoading(true);
    const result = resetPassword({
      email: email.trim().toLowerCase(),
      newPassword: newPassword,
    });
    setLoading(false);

    if (result.success) {
      setStep(4);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-8 relative">
      {/* Brand Logo */}
      <Link to="/" className="mb-6 flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-2xl shadow-md group-hover:scale-105 transition transform">
          Z
        </div>
        <span className="text-3xl font-black tracking-tight text-gray-900">
          Zelo<span className="text-amber-500">.</span>
        </span>
      </Link>

      {/* Main Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 text-xs">
          <div className="flex items-center gap-1.5 font-bold">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                step >= 1
                  ? "bg-amber-400 text-gray-900"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              1
            </span>
            <span className={step === 1 ? "text-gray-900" : "text-gray-400"}>
              Email
            </span>
          </div>
          <span className="text-gray-300">──</span>
          <div className="flex items-center gap-1.5 font-bold">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                step >= 2
                  ? "bg-amber-400 text-gray-900"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              2
            </span>
            <span className={step === 2 ? "text-gray-900" : "text-gray-400"}>
              Verify OTP
            </span>
          </div>
          <span className="text-gray-300">──</span>
          <div className="flex items-center gap-1.5 font-bold">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                step >= 3
                  ? "bg-amber-400 text-gray-900"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              3
            </span>
            <span className={step === 3 ? "text-gray-900" : "text-gray-400"}>
              Reset
            </span>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-lg space-y-0.5">
            <div className="font-bold">Attention</div>
            <div>{error}</div>
          </div>
        )}

        {/* ================= STEP 1: ENTER REGISTERED EMAIL ================= */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Forgot Password?
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Enter your registered email address. The server will dispatch a secure 6-digit OTP code to verify your identity.
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1 tracking-wider">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="e.g. user@example.com"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-gray-900 font-bold py-3 px-4 rounded-xl shadow-sm transition text-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? "Connecting to Server & Sending OTP..." : "Send OTP to My Email →"}
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 2: VERIFY OTP ================= */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Verify OTP Code
            </h2>
            <p className="text-xs text-gray-500 mb-3">
              A 6-digit verification code has been dispatched for{" "}
              <strong className="text-gray-800">{email}</strong>.
            </p>

            {/* Email Inbox Link or Terminal Notice */}
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <span>📧</span>
                <span>OTP Dispatched Successfully!</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Check your terminal (where you ran <code className="bg-white px-1 py-0.5 rounded font-mono font-bold">npm run dev</code>) to view the OTP code, or click below to open the live email preview:
              </p>
              {emailPreviewUrl && (
                <a
                  href={emailPreviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-900 font-bold px-3 py-1.5 rounded-xl border border-amber-300 text-xs shadow-2xs transition"
                >
                  <span>📬 Open Live Email Inbox</span>
                  <span>↗</span>
                </a>
              )}
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1 tracking-wider">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength="6"
                  value={enteredOtp}
                  onChange={(e) => {
                    setEnteredOtp(e.target.value.replace(/\D/g, ""));
                    if (error) setError("");
                  }}
                  placeholder="• • • • • •"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-center font-mono font-bold text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-gray-900 font-bold py-3 px-4 rounded-xl shadow-sm transition text-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? "Verifying with Server..." : "Verify OTP & Proceed →"}
              </button>

              <div className="flex justify-between items-center text-xs pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError("");
                  }}
                  className="text-gray-500 hover:underline cursor-pointer"
                >
                  ← Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || loading}
                  className={`font-semibold ${
                    resendTimer > 0 || loading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-amber-600 hover:underline cursor-pointer"
                  }`}
                >
                  {resendTimer > 0
                    ? `Resend in ${resendTimer}s`
                    : "Resend Code"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 3: ENTER NEW PASSWORD ================= */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Reset Your Password
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Create a new secure password for your Zelo account.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    New Password
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
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1 tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Re-enter your new password"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-gray-900 font-bold py-3 px-4 rounded-xl shadow-sm transition text-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? "Updating Password..." : "Update Password & Finish"}
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 4: SUCCESS ================= */}
        {step === 4 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-xs">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Password Reset Successfully!
            </h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Your password has been securely updated. You can now sign in to your Zelo account using your new credentials.
            </p>
            <Link
              to="/signin"
              className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-xl shadow-sm transition text-sm"
            >
              Sign In with New Password →
            </Link>
          </div>
        )}

        {/* Back to Sign In Link */}
        {step !== 4 && (
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <Link
              to="/signin"
              className="text-xs font-semibold text-gray-600 hover:text-amber-600 transition"
            >
              ← Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
