import React, { createContext, useContext, useState, useCallback } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; initials: string } | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("pp_auth") === "true";
  });

  const [user, setUser] = useState<AuthContextType["user"]>(() => {
    const stored = sessionStorage.getItem("pp_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((email: string, name = "John Doe") => {
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    const userData = { name, email, initials };
    sessionStorage.setItem("pp_auth", "true");
    sessionStorage.setItem("pp_user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("pp_auth");
    sessionStorage.removeItem("pp_user");
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
