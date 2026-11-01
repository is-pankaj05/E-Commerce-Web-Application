import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "./CardContext";

function ProductGrid({
  products,
  currentPage,
  setCurrentPage,
  itemsPerPage = 8,
  onResetFilters,
}) {
  const { addToCart, toggleWishlist, isInWishlist } = useContext(CartContext);
  const [addedIds, setAddedIds] = useState({});

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1);

    // Briefly show 'Added' feedback on that card
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleToggleFav = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 mt-6 shadow-xs">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-bold text-gray-800">No matching products found</h3>
        <p className="text-gray-500 text-sm mt-1 mb-5">
          Try adjusting your search terms or selecting another category.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  // Functional Pagination Logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const section = document.getElementById("products-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 400, behavior: "smooth" });
      }
    }
  };

  // Generate pagination page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="mt-6">
      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {currentProducts.map((p) => {
          const isFav = isInWishlist(p.id);
          const isAdded = addedIds[p.id];

          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-gray-200 hover:border-amber-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
            >
              {/* Top Image Box */}
              <div className="relative">
                {/* Sale / Discount Badge */}
                {p.sale && (
                  <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs">
                    Sale!
                  </span>
                )}

                {/* Wishlist Toggle Heart */}
                <button
                  type="button"
                  onClick={(e) => handleToggleFav(e, p)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-gray-600 shadow-sm transition hover:scale-110 cursor-pointer"
                  title={isFav ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <span className={`text-base leading-none ${isFav ? "text-red-500" : "text-gray-400"}`}>
                    {isFav ? "❤️" : "🤍"}
                  </span>
                </button>

                {/* Clickable Image */}
                <Link to={`/product/${p.id}`} className="block h-52 overflow-hidden bg-gray-50">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </Link>
              </div>

              {/* Card Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-amber-700 uppercase tracking-wider text-[10px] truncate max-w-[140px]">
                      {p.category}
                    </span>
                    <span className="text-green-600 font-semibold text-[10px]">
                      In Stock
                    </span>
                  </div>

                  <Link to={`/product/${p.id}`}>
                    <h3 className="font-semibold text-gray-900 text-sm hover:text-amber-600 transition line-clamp-1" title={p.title}>
                      {p.title}
                    </h3>
                  </Link>

                  {/* Rating display */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex text-amber-400 text-xs">
                      {"★".repeat(Math.min(5, Math.floor(p.rating || 5)))}
                      {"☆".repeat(Math.max(0, 5 - Math.floor(p.rating || 5)))}
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">
                      {p.rating || 4.8}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      ({p.reviewsCount || 100})
                    </span>
                  </div>
                </div>

                {/* Price & Add to Cart Action */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-base font-extrabold text-gray-900">
                      {p.price}
                    </span>
                    {p.oldPrice && (
                      <span className="text-xs text-gray-400 line-through -mt-0.5">
                        {p.oldPrice}
                      </span>
                    )}
                  </div>

                  {/* Modern Quick Add Button with stylish Shopping Bag SVG Icon */}
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, p)}
                    className={`text-xs font-bold py-2 px-3 rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      isAdded
                        ? "bg-green-600 text-white"
                        : "bg-amber-400 hover:bg-amber-500 text-gray-900 active:scale-95"
                    }`}
                  >
                    {isAdded ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-white"
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
                        className="w-4 h-4 text-gray-900"
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
                    <span>{isAdded ? "Added" : "Add to Cart"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Functional Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 py-10">
          {/* Previous Page Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`border border-gray-300 px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400 shadow-2xs"
            }`}
          >
            ← Prev
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`border px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-2xs ${
                currentPage === page
                  ? "bg-amber-400 border-amber-400 text-gray-900 shadow-sm ring-2 ring-amber-300"
                  : "bg-white border-gray-300 hover:bg-gray-100 text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Page Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`border border-gray-300 px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400 shadow-2xs"
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
