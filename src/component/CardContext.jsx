import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  // 1. Persistent Cart from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("app_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 2. Persistent Wishlist from localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("app_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 3. Toast Notifications
  const [toast, setToast] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("app_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("app_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }, [wishlist]);

  // Show toast notification
  const showToast = (message, type = "success", item = null) => {
    setToast({ message, type, item });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Add to cart with quantity
  function addToCart(product, qty = 1) {
    const quantity = Math.max(1, parseInt(qty) || 1);
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + quantity } : item
        );
      } else {
        return [...prev, { ...product, qty: quantity }];
      }
    });

    showToast(`Added "${product.title}" to cart!`, "success", product);
  }

  // Update specific quantity
  function updateQty(id, newQty) {
    const quantity = parseInt(newQty);
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, qty: quantity } : item))
      );
    }
  }

  // Increase quantity by 1
  function increaseQty(id) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  }

  // Decrease quantity by 1
  function decreaseQty(id) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty - 1) } : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  // Remove from cart
  function removeFromCart(id) {
    const removedItem = cart.find((item) => item.id === id);
    setCart((prev) => prev.filter((item) => item.id !== id));
    if (removedItem) {
      showToast(`Removed "${removedItem.title}" from cart`, "info");
    }
  }

  // Clear entire cart
  function clearCart() {
    setCart([]);
    showToast("Cart has been cleared", "info");
  }

  // Toggle wishlist
  function toggleWishlist(product) {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed "${product.title}" from wishlist`, "info");
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Added "${product.title}" to wishlist! ❤️`, "success");
    }
  }

  function isInWishlist(id) {
    return wishlist.some((item) => item.id === id);
  }

  // Total quantity of all items in cart
  const totalCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  // Helper to parse price
  function getPriceNum(price) {
    if (typeof price === "number") return price;
    if (!price) return 0;
    return Number(String(price).replace(/[^0-9.-]+/g, "")) || 0;
  }

  // Subtotal calculation
  const subtotal = cart.reduce(
    (sum, item) => sum + getPriceNum(item.price) * (item.qty || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        toast,
        totalCount,
        subtotal,
        getPriceNum,
        addToCart,
        updateQty,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        setToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
