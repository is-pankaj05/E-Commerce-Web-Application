import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Session is NOT loaded from localStorage on page refresh as per requirement:
  // "aur ek baar agr sign in kare to profile me data save ho jye aur fir agr refresh kare to login karnna pade"
  const [currentUser, setCurrentUser] = useState(null);

  // Get users database from localStorage
  const getUsers = () => {
    try {
      const saved = localStorage.getItem("app_users");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const signup = ({ name, identifier, password }) => {
    const cleanIdentifier = identifier.trim().toLowerCase();
    const users = getUsers();

    const existingUser = users.find(
      (u) => u.identifier.toLowerCase() === cleanIdentifier
    );

    if (existingUser) {
      return {
        success: false,
        message: "This ID/Email is already registered! Please sign in.",
      };
    }

    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      identifier: cleanIdentifier,
      password: password,
      phone: "+91 98765 43210",
      address: "221B Baker Street, New Delhi, India",
      memberSince: new Date().toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem("app_users", JSON.stringify(updatedUsers));

    // Save profile data in storage and establish active session
    setCurrentUser(newUser);

    return { success: true };
  };

  const signin = ({ identifier, password }) => {
    const cleanIdentifier = identifier.trim().toLowerCase();
    const users = getUsers();

    const user = users.find(
      (u) => u.identifier.toLowerCase() === cleanIdentifier
    );

    if (!user) {
      return {
        success: false,
        message: "Account not found! Please create an account (Sign Up).",
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: "Incorrect password! Please try again.",
      };
    }

    // Set active session for the current visit (will require login upon refresh)
    const activeUser = {
      id: user.id,
      name: user.name,
      identifier: user.identifier,
      phone: user.phone || "+91 98765 43210",
      address: user.address || "221B Baker Street, New Delhi, India",
      memberSince: user.memberSince || "Nov 2026",
    };

    setCurrentUser(activeUser);

    return { success: true };
  };

  const findUserByEmail = (email) => {
    const clean = email.trim().toLowerCase();
    const users = getUsers();
    return users.find((u) => u.identifier.toLowerCase() === clean);
  };

  const resetPassword = ({ email, newPassword }) => {
    const clean = email.trim().toLowerCase();
    const users = getUsers();
    const userIndex = users.findIndex(
      (u) => u.identifier.toLowerCase() === clean
    );

    if (userIndex === -1) {
      return {
        success: false,
        message: "No registered account found with this email.",
      };
    }

    users[userIndex].password = newPassword;
    localStorage.setItem("app_users", JSON.stringify(users));

    return { success: true };
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);

    // Update in users database as well
    const users = getUsers();
    const updatedUsers = users.map((u) =>
      u.identifier.toLowerCase() === currentUser.identifier.toLowerCase()
        ? { ...u, ...updatedFields }
        : u
    );
    localStorage.setItem("app_users", JSON.stringify(updatedUsers));
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signin,
        signup,
        logout,
        updateProfile,
        findUserByEmail,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
