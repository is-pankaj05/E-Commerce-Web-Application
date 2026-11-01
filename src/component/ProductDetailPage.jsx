import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import initialProducts from "./productData";
import ProductDetail from "./ProductDetail";

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(() => {
    return (
      initialProducts.find((p) => p.id === Number(id)) ||
      initialProducts[Number(id)] ||
      null
    );
  });
  const [loading, setLoading] = useState(!product);

  useEffect(() => {
    // If already found in initialProducts, no need to fetch
    const localMatch = initialProducts.find((p) => p.id === Number(id));
    if (localMatch) {
      setProduct(localMatch);
      setLoading(false);
      return;
    }

    // Otherwise fetch directly from API
    let isMounted = true;
    async function fetchSingleProduct() {
      try {
        setLoading(true);
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const p = await res.json();
        if (isMounted) {
          const cat = p.category
            ? p.category
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")
            : "General";

          setProduct({
            id: p.id,
            title: p.title,
            category: cat,
            price: `$${p.price.toFixed(2)}`,
            oldPrice: p.discountPercentage
              ? `$${(p.price * (1 + p.discountPercentage / 100)).toFixed(2)}`
              : null,
            rating: Number(p.rating?.toFixed(1)) || 4.5,
            reviewsCount: p.reviews?.length ? p.reviews.length * 35 + 20 : 120,
            inStock: (p.stock || 10) > 0,
            description: p.description,
            image: p.thumbnail || p.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
            sale: (p.discountPercentage || 0) > 10,
          });
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchSingleProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-16 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent"></div>
        <p className="mt-3 text-sm text-gray-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white my-8 rounded-2xl shadow-xs border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6 text-sm">
          The product you are looking for does not exist or has been removed from Zelo.
        </p>
        <Link
          to="/"
          className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-6 py-2.5 rounded-xl inline-block transition text-xs"
        >
          Back to Zelo Store
        </Link>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}

export default ProductDetailPage;
