import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import CartPage from "./component/CartPage";
import Header from "./component/Header";
import Footer from "./component/Footer";
import ProductList from "./component/ProductList";
import ProductDetailPage from "./component/ProductDetailpage";
import SignIn from "./component/SignIn";
import SignUp from "./component/SignUp";
import ForgotPassword from "./component/ForgotPassword";
import Profile from "./component/Profile";
import Wishlist from "./component/Wishlist";
import ProtectedRoute from "./component/ProtectedRoute";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Authentication & Account Recovery Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Application Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
