import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "./CardContext";
import { useAuth } from "./AuthContext";

function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
    subtotal,
    getPriceNum,
  } = useContext(CartContext);
  const { currentUser } = useAuth();

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi"); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState(null);

  // Address fields
  const [shippingAddress, setShippingAddress] = useState({
    name: currentUser?.name || "John Doe",
    phone: currentUser?.phone || "+91 98765 43210",
    address: currentUser?.address || "221B Baker Street, New Delhi, India",
    city: "New Delhi",
    pin: "110001",
  });

  // Card form state
  const [cardData, setCardData] = useState({
    number: "4532 •••• •••• 8892",
    name: currentUser?.name || "John Doe",
    expiry: "12/28",
    cvv: "892",
  });

  // UPI form state
  const [upiId, setUpiId] = useState("user@okhdfcbank");
  const [selectedUpiApp, setSelectedUpiApp] = useState("GPay");

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  // Free delivery threshold
  const freeShippingThreshold = 50;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 5.0;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Apply Coupon Logic
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    const code = coupon.trim().toUpperCase();

    if (code === "SAVE10") {
      setAppliedCoupon({ code, discountPercent: 10 });
      setCoupon("");
    } else if (code === "WELCOME20") {
      setAppliedCoupon({ code, discountPercent: 20 });
      setCoupon("");
    } else {
      setCouponError("Invalid coupon code! Try 'SAVE10' or 'WELCOME20'.");
    }
  };

  const discountAmount = appliedCoupon
    ? (subtotal * appliedCoupon.discountPercent) / 100
    : 0;

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Trigger payment execution
  const handleProcessPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setOrderReceipt({
        orderId: `ZELO-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        amount: grandTotal.toFixed(2),
        paymentMethod:
          paymentMethod === "upi"
            ? `UPI (${selectedUpiApp} - ${upiId})`
            : paymentMethod === "card"
            ? `Credit/Debit Card (Ending in ${cardData.number.slice(-4)})`
            : paymentMethod === "netbanking"
            ? `Net Banking (${selectedBank})`
            : "Cash on Delivery (COD)",
        address: `${shippingAddress.address}, ${shippingAddress.city} - ${shippingAddress.pin}`,
        itemsCount: cart.reduce((sum, i) => sum + (i.qty || 1), 0),
      });
      clearCart();
    }, 1800);
  };

  const handleFinishOrder = () => {
    setOrderReceipt(null);
    setShowPaymentModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Title & Breadcrumbs */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Shopping Cart
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Review items and proceed to secure payment on Zelo
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-red-600 hover:text-red-800 font-semibold hover:underline cursor-pointer"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 && !orderReceipt ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs max-w-2xl mx-auto my-8">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Your Zelo Cart is Empty
            </h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              Looks like you haven't added anything to your cart yet. Explore our
              wide selection of products and special deals!
            </p>
            <Link
              to="/"
              className="inline-block bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-8 py-3 rounded-xl shadow-sm transition transform hover:-translate-y-0.5"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Progress Meter */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                {remainingForFreeShipping > 0 ? (
                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-2">
                      <span>
                        🚚 Add{" "}
                        <strong className="text-amber-600">
                          ${remainingForFreeShipping.toFixed(2)}
                        </strong>{" "}
                        more to qualify for <strong>FREE Delivery</strong>!
                      </span>
                      <span>
                        ${subtotal.toFixed(2)} / ${freeShippingThreshold}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-amber-400 h-2.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            (subtotal / freeShippingThreshold) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-700 text-xs font-bold">
                    <span>🎉</span>
                    <span>
                      Congratulations! You have unlocked <strong>FREE Standard Delivery</strong>.
                    </span>
                  </div>
                )}
              </div>

              {/* Items Table / Cards */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden divide-y divide-gray-100">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:bg-gray-50/50 transition"
                  >
                    {/* Thumbnail & Title */}
                    <div className="flex gap-4 items-center flex-1">
                      <Link
                        to={`/product/${item.id}`}
                        className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-200"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 uppercase">
                          {item.category}
                        </span>
                        <Link to={`/product/${item.id}`}>
                          <h3 className="font-semibold text-gray-900 text-sm hover:text-amber-600 transition line-clamp-1">
                            {item.title}
                          </h3>
                        </Link>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Unit Price:{" "}
                          <span className="font-semibold text-gray-800">
                            ${getPriceNum(item.price).toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-500 hover:text-red-700 mt-2 font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <span>🗑️</span>
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center justify-between sm:justify-center gap-4">
                      <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                        <button
                          type="button"
                          onClick={() => decreaseQty(item.id)}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition cursor-pointer"
                          title="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-bold text-gray-900 text-xs">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQty(item.id)}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition cursor-pointer"
                          title="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Total for this product */}
                      <div className="text-right sm:w-24">
                        <div className="text-sm font-extrabold text-gray-900">
                          ${(getPriceNum(item.price) * item.qty).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Back to Shopping Button */}
              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-amber-600 transition"
                >
                  <span>←</span>
                  <span>Continue Shopping on Zelo</span>
                </Link>
              </div>
            </div>

            {/* RIGHT: Order Summary Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs sticky top-24 space-y-6">
                <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
                  Order Summary
                </h2>

                {/* Promo Code Box */}
                <div>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. SAVE10)"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      className="bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>

                  {couponError && (
                    <p className="text-[11px] text-red-600 mt-1.5 font-medium">
                      {couponError}
                    </p>
                  )}

                  {appliedCoupon && (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 p-2 rounded-lg mt-2 text-xs text-green-800">
                      <span>
                        ✓ Code <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.discountPercent}% OFF)
                      </span>
                      <button
                        onClick={() => setAppliedCoupon(null)}
                        className="text-red-500 font-bold hover:underline cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">
                    Try coupon code <strong>SAVE10</strong> or <strong>WELCOME20</strong>
                  </p>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 text-xs text-gray-600 pt-3 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-700 font-semibold">
                      <span>Discount ({appliedCoupon.discountPercent}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-green-600 font-bold">FREE</span>
                      ) : (
                        `$${shippingFee.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <hr className="border-gray-200 my-2" />

                  <div className="flex justify-between items-baseline text-gray-900 font-extrabold text-base">
                    <span>Grand Total</span>
                    <span className="text-xl text-amber-600">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Proceed to Payment CTA */}
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-gray-900 font-extrabold py-3.5 px-4 rounded-xl shadow-sm transition text-sm flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>Proceed to Payment</span>
                  <span>💳</span>
                </button>

                {/* Safety Guarantee */}
                <div className="text-center text-[11px] text-gray-400 space-y-1">
                  <p>🔒 256-Bit SSL Encrypted Checkout</p>
                  <p>All Standard Payment Methods Supported</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FULL FEATURED E-COMMERCE PAYMENT MODAL */}
        {showPaymentModal && !orderReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden my-8 animate-scale-in">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span>Zelo Secure Checkout</span>
                    <span className="text-xs font-normal bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                      SSL Encrypted
                    </span>
                  </h3>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Total Amount to Pay:{" "}
                    <span className="font-extrabold text-amber-400 text-sm">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-white text-lg cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleProcessPayment} className="p-6 space-y-6">
                {/* 1. Delivery Address Preview */}
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>📍</span>
                    <span>Shipping Address</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                    <div>
                      <span className="text-gray-400 text-[10px] block">Full Name</span>
                      <input
                        type="text"
                        value={shippingAddress.name}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, name: e.target.value })
                        }
                        className="font-semibold text-gray-800 bg-transparent w-full focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block">Phone Number</span>
                      <input
                        type="text"
                        value={shippingAddress.phone}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, phone: e.target.value })
                        }
                        className="font-semibold text-gray-800 bg-transparent w-full focus:outline-none"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-400 text-[10px] block">Street & Locality</span>
                      <input
                        type="text"
                        value={shippingAddress.address}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, address: e.target.value })
                        }
                        className="font-semibold text-gray-800 bg-transparent w-full focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Choose Payment Method */}
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span>💳</span>
                    <span>Select Payment Option</span>
                  </h4>

                  {/* Payment Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                        paymentMethod === "upi"
                          ? "border-amber-500 bg-amber-50 text-amber-900 shadow-xs"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-xl">📱</span>
                      <span>UPI / QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                        paymentMethod === "card"
                          ? "border-amber-500 bg-amber-50 text-amber-900 shadow-xs"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-xl">💳</span>
                      <span>Cards</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("netbanking")}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                        paymentMethod === "netbanking"
                          ? "border-amber-500 bg-amber-50 text-amber-900 shadow-xs"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-xl">🏦</span>
                      <span>Net Banking</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                        paymentMethod === "cod"
                          ? "border-amber-500 bg-amber-50 text-amber-900 shadow-xs"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-xl">💵</span>
                      <span>Cash on Delivery</span>
                    </button>
                  </div>

                  {/* Payment Details Form Panels */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
                    {/* OPTION 1: UPI */}
                    {paymentMethod === "upi" && (
                      <div className="space-y-3">
                        <span className="font-bold text-gray-800 block">
                          Instant UPI Payment (PhonePe, Google Pay, Paytm)
                        </span>
                        <div className="flex gap-2">
                          {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                            <button
                              key={app}
                              type="button"
                              onClick={() => setSelectedUpiApp(app)}
                              className={`px-3 py-1.5 rounded-lg font-bold border transition cursor-pointer ${
                                selectedUpiApp === app
                                  ? "bg-amber-400 border-amber-500 text-gray-900"
                                  : "bg-white border-gray-200 text-gray-700"
                              }`}
                            >
                              {app}
                            </button>
                          ))}
                        </div>
                        <div>
                          <label className="text-gray-500 block mb-1">
                            Enter UPI ID
                          </label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="username@okhdfcbank"
                            required
                          />
                        </div>
                        <p className="text-[11px] text-gray-400">
                          A payment request will be sent to your UPI app.
                        </p>
                      </div>
                    )}

                    {/* OPTION 2: CREDIT / DEBIT CARD */}
                    {paymentMethod === "card" && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-gray-500 block mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardData.number}
                            onChange={(e) =>
                              setCardData({ ...cardData, number: e.target.value })
                            }
                            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                            placeholder="4532 0000 0000 8892"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-gray-500 block mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              value={cardData.expiry}
                              onChange={(e) =>
                                setCardData({ ...cardData, expiry: e.target.value })
                              }
                              className="w-full bg-white px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                              placeholder="MM/YY"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-gray-500 block mb-1">
                              CVV / CVC
                            </label>
                            <input
                              type="password"
                              maxLength="4"
                              value={cardData.cvv}
                              onChange={(e) =>
                                setCardData({ ...cardData, cvv: e.target.value })
                              }
                              className="w-full bg-white px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                              placeholder="•••"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* OPTION 3: NET BANKING */}
                    {paymentMethod === "netbanking" && (
                      <div className="space-y-3">
                        <label className="font-bold text-gray-800 block">
                          Choose Popular Bank
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "HDFC Bank",
                            "State Bank of India",
                            "ICICI Bank",
                            "Axis Bank",
                            "Kotak Bank",
                            "Punjab National Bank",
                          ].map((b) => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => setSelectedBank(b)}
                              className={`p-2 rounded-lg border text-left font-semibold transition cursor-pointer ${
                                selectedBank === b
                                  ? "bg-amber-400 border-amber-500 text-gray-900"
                                  : "bg-white border-gray-200 text-gray-700"
                              }`}
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* OPTION 4: CASH ON DELIVERY */}
                    {paymentMethod === "cod" && (
                      <div className="space-y-2">
                        <span className="font-bold text-gray-800 block">
                          Cash on Delivery (COD)
                        </span>
                        <p className="text-gray-600">
                          Pay in cash or UPI directly to the courier executive upon
                          package delivery at your doorstep.
                        </p>
                        <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[11px] font-semibold">
                          ℹ️ Please keep exact change ready to ensure smooth contactless delivery.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Payment CTA */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-gray-900 font-black py-3.5 px-4 rounded-xl shadow-md transition text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Payment Securely...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ${grandTotal.toFixed(2)} & Place Order</span>
                      <span>🔒</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ORDER RECEIPT & SUCCESS MODAL */}
        {orderReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl border border-gray-100 animate-scale-in">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                ✓
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">
                Payment Successful!
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Thank you for ordering with Zelo. Your payment has been authorized and order is confirmed.
              </p>

              {/* Receipt Details Box */}
              <div className="bg-gray-50 rounded-2xl p-5 text-xs text-gray-700 text-left space-y-2.5 mb-6 border border-gray-200">
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-500">Order ID:</span>
                  <span className="font-mono font-bold text-gray-900">
                    #{orderReceipt.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-500">Total Paid:</span>
                  <span className="font-extrabold text-gray-900 text-sm">
                    ${orderReceipt.amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-500">Payment Mode:</span>
                  <span className="font-medium text-gray-900">
                    {orderReceipt.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-500">Delivery Address:</span>
                  <span className="font-medium text-gray-900 text-right max-w-[200px] truncate">
                    {orderReceipt.address}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-500">Estimated Delivery:</span>
                  <span className="font-bold text-green-600">
                    Within 2 - 3 Days
                  </span>
                </div>
              </div>

              <button
                onClick={handleFinishOrder}
                className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3.5 rounded-xl transition cursor-pointer"
              >
                Back to Zelo Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
