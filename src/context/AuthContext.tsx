"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type Role = "STUDENT" | "TUTOR" | "ADMIN";

interface UserType {
  id: number;
  email: string;
  fullname?: string;
  avatarUrl?: string;      
  profilePicture?: string; 
  roles?: string[];
  phone?: string;
  address?: string;
}

interface DecodedToken {
  roles: string[];
  sub: string;     
  userId: number;
  exp: number;
}

interface AuthContextType {
  role: Role | null;
  user: UserType | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<UserType>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Automatically fetch detailed profile from API
  const fetchFullProfile = async (token: string) => {
    try {
      const res = await fetch("https://toturhub-dev.onrender.com/api/v1/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        updateUser({
          fullname: data.fullname,
          avatarUrl: data.avatarUrl,
          phone: data.phone,
          address: data.address
        });
      }
    } catch (err) {
      console.warn("Failed to fetch detailed profile");
    }
  };

  const loadToken = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUser({ id: decoded.userId, email: decoded.sub, roles: decoded.roles });

      if (decoded.roles?.includes("ADMIN")) setRole("ADMIN");
      else if (decoded.roles?.includes("TUTOR")) setRole("TUTOR");
      else setRole("STUDENT");

      // Populate extra profile details (fullname, avatar)
      fetchFullProfile(token);
    } catch (err) {
      logout();
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) loadToken(token);
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    Cookies.set("token", token, { expires: 7 });
    loadToken(token);
  };

  const logout = () => {
    Cookies.remove("token");
    setRole(null);
    setUser(null);
  };

  const updateUser = (data: Partial<UserType>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider value={{ role, user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};