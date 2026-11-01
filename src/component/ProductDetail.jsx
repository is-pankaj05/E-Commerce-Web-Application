import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "./CardContext";
import products from "./productData";

function ProductDetail({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useContext(CartContext);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate("/cart");
  };

  const isFav = isInWishlist(product.id);

  // Suggested products from same or different category
  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-amber-600 transition">Home</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{product.category}</span>
        <span>/</span>
        <span className="text-gray-900 font-semibold truncate">{product.title}</span>
      </nav>

      {/* Main Product Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-6 md:p-8 flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Left: Product Image */}
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center group">
            {product.sale && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                Sale!
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-sm transition hover:scale-110 cursor-pointer"
              title={isFav ? "Remove from wishlist" : "Add to wishlist"}
            >
              <span className={`text-xl ${isFav ? "text-red-500" : "text-gray-400"}`}>
                {isFav ? "❤️" : "🤍"}
              </span>
            </button>
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <span className="inline-block text-xs uppercase tracking-wider font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full mb-3">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex text-amber-500 text-base">
                {"★".repeat(Math.min(5, Math.floor(product.rating || 5)))}
                {"☆".repeat(Math.max(0, 5 - Math.floor(product.rating || 5)))}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {product.rating || 4.8}
              </span>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                {product.reviewsCount || 120} ratings & reviews
              </span>
            </div>

            {/* Price Box */}
            <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900">
                {product.price}
              </span>
              {product.oldPrice && (
                <span className="text-base text-gray-400 line-through">
                  {product.oldPrice}
                </span>
              )}
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full">
                Special Offer
              </span>
            </div>

            {/* Description */}
            <p className="mt-5 text-gray-600 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>

            {/* Perks / Benefits */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-base">🚚</span>
                <span>Free Express Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">🔄</span>
                <span>7 Days Easy Replacement</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">🛡️</span>
                <span>100% Genuine Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">🔒</span>
                <span>Safe & Secure Payments</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-base transition"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center font-semibold text-gray-800 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQty((prev) => prev + 1)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-base transition"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-green-600 font-semibold">✓ In Stock</span>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className={`py-3 px-6 rounded-xl font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer ${added
                  ? "bg-green-600 text-white"
                  : "bg-amber-400 hover:bg-amber-500 text-gray-900"
                  }`}
              >
                {added ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-900"
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
                )}
                <span>{added ? "Added to Cart! ✓" : "Add to Cart"}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3 px-6 rounded-xl font-bold text-sm bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⚡</span>
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Products Section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>Similar Products You Might Like</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relatedProducts.map((p) => (
            <Link
              to={`/product/${p.id}`}
              key={p.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition group"
            >
              <div className="h-44 rounded-lg overflow-hidden bg-gray-50 mb-3">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <p className="text-xs text-amber-700 uppercase font-semibold">
                {p.category}
              </p>
              <h3 className="font-semibold text-gray-800 text-sm mt-1 truncate">
                {p.title}
              </h3>
              <p className="font-bold text-gray-900 mt-2">{p.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
