import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "./CardContext";

function Wishlist() {
  const { wishlist, toggleWishlist, addToCart, getPriceNum } =
    useContext(CartContext);
  const navigate = useNavigate();

  // Render star rating
  function Stars({ rating }) {
    const full = Math.floor(rating || 0);
    const half = rating - full >= 0.5;
    return (
      <span className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          if (i < full)
            return (
              <svg
                key={i}
                className="w-3.5 h-3.5 text-amber-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          if (i === full && half)
            return (
              <svg
                key={i}
                className="w-3.5 h-3.5 text-amber-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="#d1d5db" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#half)"
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            );
          return (
            <svg
              key={i}
              className="w-3.5 h-3.5 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </span>
    );
  }

  // ── Empty State ──────────────────────────────────────────────────────────
  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        {/* Heart illustration */}
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6 shadow-inner">
          <svg
            className="w-12 h-12 text-red-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Your Wishlist is Empty
        </h2>
        <p className="text-sm text-gray-500 mb-8 max-w-xs">
          Save items you love by tapping the heart icon on any product.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-sm px-6 py-3 rounded-xl shadow transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Explore Products
        </Link>
      </div>
    );
  }

  // ── Wishlist Grid ────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            My Wishlist
            <span className="ml-2 text-base font-semibold text-gray-400">
              ({wishlist.length} {wishlist.length === 1 ? "item" : "items"})
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Items you've saved for later
          </p>
        </div>
        <Link
          to="/"
          className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Continue Shopping
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {wishlist.map((product) => {
          const price = getPriceNum(product.price);
          const originalPrice =
            product.originalPrice ||
            (product.discountPercentage
              ? Math.round(price / (1 - product.discountPercentage / 100))
              : null);

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden group"
            >
              {/* Product Image — clickable to detail page */}
              <div
                className="relative cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={
                    product.thumbnail ||
                    product.image ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={product.title}
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />

                {/* Discount Badge */}
                {product.discountPercentage > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    -{Math.round(product.discountPercentage)}%
                  </span>
                )}

                {/* Remove from Wishlist (heart filled = in wishlist) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  title="Remove from Wishlist"
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-red-50 transition cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col flex-1 gap-1">
                {/* Category */}
                {product.category && (
                  <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">
                    {product.category}
                  </span>
                )}

                {/* Title */}
                <p
                  className="text-xs font-bold text-gray-900 leading-tight line-clamp-2 cursor-pointer hover:text-amber-700 transition"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.title}
                </p>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Stars rating={product.rating} />
                    <span className="text-[10px] text-gray-400">
                      ({product.rating?.toFixed?.(1)})
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-sm font-black text-gray-900">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-[10px] text-gray-400 line-through">
                      ₹{originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product)}
                  className="mt-auto w-full flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-xs py-2 rounded-xl transition cursor-pointer shadow-sm"
                >
                  <svg
                    className="w-3.5 h-3.5"
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
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Move All to Cart */}
      {wishlist.length > 1 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              wishlist.forEach((p) => addToCart(p));
            }}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-md transition cursor-pointer"
          >
            <svg
              className="w-4 h-4"
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
            Add All to Cart ({wishlist.length} items)
          </button>
        </div>
      )}
    </div>
  );
}

export default Wishlist;

