import React, { useState, useMemo, useEffect } from "react";
import Hero from "./Hero";
import ProductGrid from "./ProductGrid";
import initialProducts, { fetchApiProducts } from "./productData";

function ProductList() {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [offerTitle, setOfferTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch products from API on mount
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      setLoading(true);
      const apiItems = await fetchApiProducts();
      if (isMounted) {
        setProducts(apiItems);
        setLoading(false);
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamically extract unique categories from products
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...cats];
  }, [products]);

  function getPrice(price) {
    if (typeof price === "number") return price;
    return Number(String(price).replace(/[^0-9.-]+/g, "")) || 0;
  }

  // Filter products
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchesSearch = p.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "All" || p.category.toLowerCase() === category.toLowerCase();
      const matchesRating = (p.rating || 4.5) >= minRating;
      const matchesOffer = !onlyOffers || Boolean(p.sale);

      return matchesSearch && matchesCategory && matchesRating && matchesOffer;
    });

    if (sortBy === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "low") {
      list.sort((a, b) => getPrice(a.price) - getPrice(b.price));
    } else if (sortBy === "high") {
      list.sort((a, b) => getPrice(b.price) - getPrice(a.price));
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [products, search, category, minRating, sortBy, onlyOffers]);

  // Reset current page when filters change
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    setOnlyOffers(false);
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleRatingChange = (newRating) => {
    setMinRating(newRating);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All");
    setMinRating(0);
    setSortBy("default");
    setOnlyOffers(false);
    setOfferTitle("");
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <Hero
          sortBy={sortBy}
          setSortBy={handleSortChange}
          search={search}
          setSearch={handleSearchChange}
          category={category}
          setCategory={handleCategoryChange}
          categories={categories}
          minRating={minRating}
          setMinRating={handleRatingChange}
          onlyOffers={onlyOffers}
          setOnlyOffers={(val) => {
            setOnlyOffers(val);
            setCurrentPage(1);
          }}
          offerTitle={offerTitle}
          setOfferTitle={setOfferTitle}
        />

        {/* Loading Indicator or Products Section */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent"></div>
            <p className="mt-3 text-sm text-gray-500 font-medium">
              Loading fresh products from Zelo API...
            </p>
          </div>
        ) : (
          <div id="products-section" className="scroll-mt-20">
            {/* Active Offer Banner if Offer Clicked (Formal & Compact) */}
            {onlyOffers && (
              <div className="mt-5 p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white shadow-2xs flex items-center justify-between animate-scale-in">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                    ⚡
                  </span>
                  <div>
                    <h3 className="font-bold text-xs text-white">
                      {offerTitle || "Special Clearance & Promotional Items"}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Displaying verified promotional items with special markdowns.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOnlyOffers(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  View All Products ✕
                </button>
              </div>
            )}

            {/* Results Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-8 px-1">
              <div className="text-sm font-medium text-gray-600 flex items-center flex-wrap gap-2">
                <span>
                  Showing{" "}
                  <strong className="text-gray-900 font-bold">
                    {filteredProducts.length}
                  </strong>{" "}
                  products
                </span>
                {category !== "All" && (
                  <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full">
                    {category}
                  </span>
                )}
                {onlyOffers && (
                  <span className="text-xs bg-red-100 text-red-700 font-bold px-2.5 py-0.5 rounded-full">
                    🔥 Offer Products
                  </span>
                )}
                {search && (
                  <span className="text-xs text-gray-500">
                    matching "{search}"
                  </span>
                )}
              </div>

              {(search ||
                category !== "All" ||
                minRating > 0 ||
                sortBy !== "default" ||
                onlyOffers) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                >
                  Reset All Filters ✕
                </button>
              )}
            </div>

            {/* Product Grid with active Pagination */}
            <ProductGrid
              products={filteredProducts}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
