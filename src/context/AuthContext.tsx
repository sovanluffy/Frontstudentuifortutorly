import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type Role = "STUDENT" | "TUTOR" | "ADMIN";

/* ================= USER ================= */
interface UserType {
  id: number;
  email: string;
}

/* ================= TOKEN ================= */
interface DecodedToken {
  roles: string[];
  sub: string;
  userId: number;
}

interface AuthContextType {
  role: Role | null;
  user: UserType | null;
  isLoading: boolean;

  // 🔥 ADD THIS (IMPORTANT)
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================= PROVIDER ================= */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ================= LOAD TOKEN ================= */
  const loadToken = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);

      setUser({
        id: decoded.userId,
        email: decoded.sub,
      });

      if (decoded.roles?.includes("TUTOR")) {
        setRole("TUTOR");
      } else if (decoded.roles?.includes("ADMIN")) {
        setRole("ADMIN");
      } else {
        setRole("STUDENT");
      }
    } catch (err) {
      console.error("Token decoding failed:", err);
      setRole(null);
      setUser(null);
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      loadToken(token);
    }

    setIsLoading(false);
  }, []);

  /* ================= LOGIN (🔥 REAL-TIME UPDATE) ================= */
  const login = (token: string) => {
    Cookies.set("token", token);
    loadToken(token); // 🔥 instantly update UI (NO REFRESH)
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    Cookies.remove("token");
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ role, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};