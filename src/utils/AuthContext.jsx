import { createContext, useContext, useState, useEffect } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return null;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1])); // Decode the token's payload
      return { username: decoded.sub, role: decoded.role, userId: decoded.userId };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  });

  const login = (token) => {
    if (!token) return;

    localStorage.setItem("jwtToken", token);

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser({
        username: decoded.sub,
        role: decoded.role,
        userId: decoded.userId,
      });
    } catch (error) {
      console.error("Error decoding token during login:", error);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const expiry = decoded.exp * 1000;
      const currentTime = Date.now();

      if (currentTime > expiry) {
        logout();
      } else {
        const timeout = setTimeout(logout, expiry - currentTime);
        return () => clearTimeout(timeout);
      }
    } catch (error) {
      console.error("Error decoding token for expiration:", error);
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};