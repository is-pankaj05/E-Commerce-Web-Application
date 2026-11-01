import React, { useState, useEffect } from "react";

function Hero({
  sortBy,
  setSortBy,
  search,
  setSearch,
  category,
  setCategory,
  categories = [],
  minRating,
  setMinRating,
  onlyOffers,
  setOnlyOffers,
  offerTitle,
  setOfferTitle,
}) {
  // Banner Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Formal, elegant promotional banners
  const banners = [
    {
      title: "Seasonal Clearance — Up to 50% Off",
      subtitle: "Curated collection of premium products with exclusive seasonal markdowns.",
      tag: "Limited Time Offer",
      discountBadge: "UP TO 50% OFF",
      badgeSub: "Selected Catalog",
      bgGradient: "from-slate-900 via-slate-800 to-zinc-900",
      cta: "Explore Offers",
      offerType: "all_deals",
      categoryTarget: "All",
      offerLabel: "Seasonal Clearance (Up to 50% Off)",
    },
    {
      title: "Curated Beauty & Wellness Essentials",
      subtitle: "Discover high-grade skincare, fragrances and personal care on special sale.",
      tag: "Beauty Specials",
      discountBadge: "SAVE 20% - 40%",
      badgeSub: "Verified Brands",
      bgGradient: "from-zinc-900 via-slate-900 to-stone-900",
      cta: "Shop Beauty Offers",
      offerType: "category_deal",
      categoryTarget: "Beauty",
      offerLabel: "Curated Beauty & Wellness Offers",
    },
    {
      title: "Modern Lifestyle, Tech & Home Accessories",
      subtitle: "Upgrade your work and living space with discounted lifestyle essentials.",
      tag: "Exclusive Catalog",
      discountBadge: "SPECIAL PRICING",
      badgeSub: "Limited Inventory",
      bgGradient: "from-slate-950 via-slate-900 to-zinc-900",
      cta: "View Lifestyle Deals",
      offerType: "category_deal",
      categoryTarget: "Home Decoration",
      offerLabel: "Lifestyle & Home Living Offers",
    },
  ];

  // Auto slide banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Handle Offer Click: Filters products and smoothly scrolls to products section
  const handleOfferClick = (banner) => {
    setOnlyOffers(true);
    setOfferTitle(banner.offerLabel);

    if (banner.offerType === "category_deal") {
      const found = categories.find(
        (c) => c.toLowerCase() === banner.categoryTarget.toLowerCase()
      );
      if (found) {
        setCategory(found);
      } else {
        setCategory("All");
      }
    } else {
      setCategory("All");
    }

    setTimeout(() => {
      const section = document.getElementById("products-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const activeBanner = banners[currentSlide];

  return (
    <div className="space-y-4">
      {/* 1. Balanced, Compact & Formal Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-800 bg-slate-900 text-white cursor-pointer select-none">
        <div
          onClick={() => handleOfferClick(activeBanner)}
          className={`py-6 px-6 sm:py-7 sm:px-8 bg-gradient-to-r ${activeBanner.bgGradient} transition-colors duration-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6`}
        >
          {/* Left Column: Formal Heading & Info */}
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                {activeBanner.tag}
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white leading-snug">
              {activeBanner.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              {activeBanner.subtitle}
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOfferClick(activeBanner);
                }}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>{activeBanner.cta}</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Balanced Elegant Promo Card (Removes unevenness) */}
          <div className="hidden sm:flex flex-col items-center justify-center bg-white/5 border border-white/10 backdrop-blur-xs rounded-2xl py-4 px-6 min-w-[190px] text-center shrink-0">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Zelo Privilege
            </span>
            <span className="text-xl font-extrabold text-white mt-1">
              {activeBanner.discountBadge}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              {activeBanner.badgeSub}
            </span>
            <span className="mt-2 text-[10px] text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-md font-medium">
              Click to View Products
            </span>
          </div>
        </div>

        {/* Compact Dot Indicators */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? "w-6 bg-amber-400" : "w-1.5 bg-slate-600"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. Formal Features Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 text-sm font-semibold">
            🚚
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 leading-tight">Express Delivery</h4>
            <p className="text-[10px] text-gray-500">Free on orders above $50</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 text-sm font-semibold">
            🔒
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 leading-tight">Secure Payments</h4>
            <p className="text-[10px] text-gray-500">256-Bit encrypted checkout</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 text-sm font-semibold">
            🔁
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 leading-tight">Easy Returns</h4>
            <p className="text-[10px] text-gray-500">7-Day replacement guarantee</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 text-sm font-semibold">
            ⭐
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 leading-tight">Verified Quality</h4>
            <p className="text-[10px] text-gray-500">100% Authentic merchandise</p>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-3">
        {/* Category Pills (Dynamic from API + Special Deals Pill) */}
        <div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1">
              Category:
            </span>

            {/* Special Deals Pill */}
            <button
              type="button"
              onClick={() => {
                setOnlyOffers((prev) => !prev);
                setOfferTitle("Special Offer & Deal Products");
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1 ${
                onlyOffers
                  ? "bg-slate-900 text-amber-400 border border-slate-900 shadow-2xs ring-1 ring-amber-400/40"
                  : "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200"
              }`}
            >
              <span>⚡</span>
              <span>Offers & Deals</span>
            </button>

            {/* All and Dynamic Categories */}
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  setOnlyOffers(false);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition shrink-0 cursor-pointer ${
                  category === cat && !onlyOffers
                    ? "bg-slate-900 text-white font-semibold shadow-2xs"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Sort Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2 border-t border-gray-100">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-8 py-2 bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Controls: Rating & Sort By */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Rating Filter */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-2.5 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 transition cursor-pointer"
            >
              <option value="0">All Ratings</option>
              <option value="4.0">★ 4.0 & above</option>
              <option value="4.5">★ 4.5 & above</option>
            </select>

            {/* Sorting Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-2.5 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 transition cursor-pointer"
            >
              <option value="default">Sort: Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="title">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
