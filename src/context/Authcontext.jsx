import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("tatu_admin_auth") === "true",
  );
  const [loginError, setLoginError] = useState("");

  const login = (email, password) => {
    if (
      email === import.meta.env.VITE_ADMIN_EMAIL &&
      password === import.meta.env.VITE_ADMIN_PASSWORD
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("tatu_admin_auth", "true");
      setLoginError("");
      return true;
    } else {
      setLoginError("Login yoki parol noto'g'ri!");
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("tatu_admin_auth");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loginError, setLoginError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
