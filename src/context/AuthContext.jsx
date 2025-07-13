import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Load user from localStorage on first render
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined") {
      try {
        const userInfo = JSON.parse(savedUser);
        if (userInfo && typeof userInfo === "object") {
          setUser(userInfo);
        } else {
          throw new Error("Invalid user data");
        }
      } catch (err) {
        console.error("Invalid user JSON in localStorage", err);
        localStorage.removeItem("user");
      }
    }
  }, [token]);

  // Login and persist to localStorage
  const login = (userData, token) => {
    if (!userData || typeof userData !== "object" || !token) {
      console.error("Invalid login data:", userData, token);
      return;
    }

    setUser(userData);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout and clean up
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext);
