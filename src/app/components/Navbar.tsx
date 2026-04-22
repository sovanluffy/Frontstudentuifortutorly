"use client";

import * as React from "react";
import {
  Search,
  Menu,
  Globe,
  Smartphone,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { AuthModal } from "./AuthModal";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  onToggle: () => void;
  isSidebarOpen: boolean;
}

export const Navbar = ({ onToggle, isSidebarOpen }: NavbarProps) => {
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);

  // 🔥 REACTIVE AUTH (CORE FIX)
  const { user, logout, isLoading } = useAuth();

  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout(); // 🔥 instantly updates ALL UI (Navbar, Sidebar, Pages)
    window.location.href = "/";
  };

  if (isLoading) return null;

  return (
    <>
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 py-1.5 flex items-center justify-between sticky top-0 h-14 z-[100]">

        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggle}
            className={`p-1.5 rounded-xl border transition-all duration-300 ${
              isSidebarOpen
                ? "bg-slate-100 text-indigo-600"
                : "bg-white text-slate-600"
            }`}
          >
            <Menu
              size={20}
              className={`transition-transform duration-300 ${
                isSidebarOpen ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>

          <Link
            to="/"
            className="text-2xl font-black text-[#0066FF] tracking-tight"
          >
            Tutor<span className="text-[#0F294D]">Hub</span>
          </Link>
        </div>

        {/* ================= CENTER ================= */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden h-9">
          <input
            type="text"
            placeholder="Search for tutors..."
            className="w-full px-4 text-sm bg-transparent outline-none text-slate-600 placeholder:text-slate-400"
          />
          <button className="bg-indigo-600 h-full px-4 text-white hover:bg-indigo-700 transition">
            <Search size={14} />
          </button>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-4 text-xs font-bold text-slate-600">

          <button className="hidden sm:flex items-center gap-1.5 hover:text-indigo-600 transition">
            <Smartphone size={16} /> App
          </button>

          <button className="flex items-center gap-1.5 hover:text-indigo-600 transition">
            <Globe size={16} /> USD
          </button>

          {/* ================= AUTH ================= */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">

              {/* PROFILE */}
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm transition group"
              >
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>

                <span className="font-bold text-slate-800">Profile</span>

                <ChevronRight
                  size={14}
                  className="text-slate-300 group-hover:translate-x-0.5 transition"
                />
              </Link>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition active:scale-95"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>

      {/* ================= AUTH MODAL ================= */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
};