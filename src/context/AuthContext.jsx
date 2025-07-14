// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("token") || "");

  
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser && savedUser !== "undefined") {
//       try {
//         const userInfo = JSON.parse(savedUser);
//         if (userInfo && typeof userInfo === "object") {
//           setUser(userInfo);
//         } else {
//           throw new Error("Invalid user data");
//         }
//       } catch (err) {
//         console.error("Invalid user JSON in localStorage", err);
//         localStorage.removeItem("user");
//       }
//     }
//   }, [token]);

  
//   const login = (userData, token) => {
//     if (!userData || typeof userData !== "object" || !token) {
//       console.error("Invalid login data:", userData, token);
//       return;
//     }

//     setUser(userData);
//     setToken(token);
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(userData));
//   };

  
//   const logout = () => {
//     setUser(null);
//     setToken("");
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// export const useAuth = () => useContext(AuthContext);
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      try {
        const userInfo = JSON.parse(savedUser);
        if (userInfo && typeof userInfo === "object") {
          setUser(userInfo);
          setToken(savedToken);
        } else {
          throw new Error("Invalid user data");
        }
      } catch (err) {
        console.error("Invalid auth JSON in localStorage", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (userData, token) => {
    if (!userData || typeof userData !== "object" || !token) {
      console.error("Invalid login data:", userData, token);
      return;
    }
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
