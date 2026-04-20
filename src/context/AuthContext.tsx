import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type Role = "STUDENT" | "TUTOR" | "ADMIN";

/* ================= USER ================= */
interface UserType {
  id: number;          // ✅ IMPORTANT: use "id" instead of userId (standard)
  email: string;
}

/* ================= TOKEN ================= */
interface DecodedToken {
  roles: string[];
  sub: string; // email
  userId: number;
}

interface AuthContextType {
  role: Role | null;
  user: UserType | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================= PROVIDER ================= */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);

        /* ✅ FIX: map userId → id (IMPORTANT for frontend consistency) */
        setUser({
          id: decoded.userId,
          email: decoded.sub,
        });

        if (decoded.roles?.includes("TUTOR")) {
          setRole("TUTOR");
        } else {
          setRole("STUDENT");
        }
      } catch (err) {
        console.error("Token decoding failed:", err);
        setRole(null);
        setUser(null);
      }
    }

    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ role, user, isLoading }}>
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