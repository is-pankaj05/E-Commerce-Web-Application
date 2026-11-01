import React from "react";

export const initialProducts = [
  {
    id: 1,
    title: "Black Ceramic Coffee Mug",
    category: "Mugs",
    oldPrice: "$34.00",
    price: "$28.00",
    rating: 4.8,
    reviewsCount: 142,
    inStock: true,
    description: "Classic black matte ceramic coffee mug with heat-resistant ergonomic grip handle. Microwave and dishwasher safe.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    sale: true,
  },
  {
    id: 2,
    title: "Minimalist White Coffee Mug",
    category: "Mugs",
    oldPrice: "$30.00",
    price: "$25.00",
    rating: 4.6,
    reviewsCount: 89,
    inStock: true,
    description: "Glossy white porcelain coffee mug, perfect for hot cocoa, latte, or your morning espresso at work.",
    image: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&auto=format&fit=crop&q=80",
    sale: true,
  },
  {
    id: 3,
    title: "Premium Organic Black T-Shirt",
    category: "T-shirts",
    oldPrice: "$40.00",
    price: "$32.00",
    rating: 4.7,
    reviewsCount: 215,
    inStock: true,
    description: "100% breathable combed organic cotton black crew neck t-shirt with tailored regular fit and reinforced stitching.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    sale: true,
  },
  {
    id: 4,
    title: "Urban Streetwear Graphic T-Shirt",
    category: "T-shirts",
    oldPrice: "$45.00",
    price: "$35.00",
    rating: 4.5,
    reviewsCount: 97,
    inStock: true,
    description: "Trendy graphic print everyday t-shirt crafted with durable pre-shrunk cotton fabric for maximum breathability.",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80",
    sale: false,
  },
  {
    id: 5,
    title: "Insulated Stainless Travel Mug",
    category: "Mugs",
    oldPrice: "$42.00",
    price: "$32.00",
    rating: 4.9,
    reviewsCount: 310,
    inStock: true,
    description: "Double-wall vacuum insulated travel thermos with spill-proof lid. Keeps beverages hot for 6 hours or icy cold for 12 hours.",
    image: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&auto=format&fit=crop&q=80",
    sale: true,
  },
  {
    id: 6,
    title: "Artisan Speckled Ceramic Mug",
    category: "Mugs",
    oldPrice: "$38.00",
    price: "$29.00",
    rating: 4.4,
    reviewsCount: 64,
    inStock: true,
    description: "Handcrafted rustic speckled ceramic mug with smooth glazed finish, ideal for artisan coffee and tea lovers.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    sale: false,
  },
  {
    id: 7,
    title: "Air Flow Pro Running Shoes",
    category: "Shoes",
    oldPrice: "$65.00",
    price: "$49.00",
    rating: 4.8,
    reviewsCount: 428,
    inStock: true,
    description: "Engineered mesh sports running shoes with responsive shock-absorption sole and non-slip rubber traction tread.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    sale: true,
  },
  {
    id: 8,
    title: "Urban Classic Streetwear Sneakers",
    category: "Shoes",
    oldPrice: "$55.00",
    price: "$42.00",
    rating: 4.6,
    reviewsCount: 185,
    inStock: true,
    description: "Lightweight casual low-top lifestyle sneakers designed with soft memory foam insoles for all-day comfort.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
    sale: true,
  },
];

export async function fetchApiProducts() {
  try {
    const res = await fetch("https://dummyjson.com/products?limit=100");
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    if (data.products && data.products.length > 0) {
      return data.products.map((p) => {
        const cat = p.category
          ? p.category
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")
          : "General";

        return {
          id: p.id,
          title: p.title,
          category: cat,
          price: `$${p.price.toFixed(2)}`,
          oldPrice: p.discountPercentage
            ? `$${(p.price * (1 + p.discountPercentage / 100)).toFixed(2)}`
            : null,
          rating: Number(p.rating?.toFixed(1)) || 4.5,
          reviewsCount: p.reviews?.length ? p.reviews.length * 38 + 25 : 120,
          inStock: (p.stock || 10) > 0,
          description: p.description,
          image: p.thumbnail || p.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
          sale: (p.discountPercentage || 0) > 10,
        };
      });
    }
  } catch (err) {
    console.warn("Live API fetch failed, utilizing built-in catalog", err);
  }
  return initialProducts;
}

export default initialProducts;
