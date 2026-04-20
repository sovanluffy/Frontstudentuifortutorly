"use client";

import * as React from "react";
import { Search, Menu, Globe, Smartphone, User, LogOut, ChevronRight, X } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

// Updated Interface to include isSidebarOpen
interface NavbarProps {
  onToggle: () => void;
  isSidebarOpen: boolean;
}

export const Navbar = ({ onToggle, isSidebarOpen }: NavbarProps) => {
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const checkAuth = React.useCallback(() => {
    const token = localStorage.getItem("token") || Cookies.get("token");
    setIsLoggedIn(!!token);
  }, []);

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Cookies.remove("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <>
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 py-1.5 flex items-center justify-between z-[100] sticky top-0 h-14">
        
        {/* LEFT SECTION: Hamburger Menu & Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onToggle} 
            className={`p-1.5 rounded-xl transition-all duration-300 border ${
              isSidebarOpen 
              ? "bg-slate-100 border-slate-200 text-indigo-600" 
              : "bg-white border-transparent text-slate-600 hover:bg-slate-50"
            }`}
          >
            {/* Smoothly switch between Menu and X icon or just rotate */}
            <Menu size={20} className={`transition-transform duration-300 ${isSidebarOpen ? "rotate-90" : "rotate-0"}`} />
          </button>
          
          <Link to="/" className="text-2xl font-black text-[#0066FF] tracking-tighter cursor-pointer select-none ml-1">
            Tutor<span className="text-[#0F294D]">Hub</span>
          </Link>
        </div>

        {/* CENTER SECTION: Search Bar (Refined Colors) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50 transition-all h-9">
          <input 
            type="text" 
            placeholder="Search for tutors..." 
            className="w-full px-4 text-sm bg-transparent outline-none text-slate-600 placeholder:text-slate-400" 
          />
          <button className="bg-indigo-600 h-full px-4 text-white hover:bg-indigo-700 transition-colors shrink-0">
            <Search size={14} strokeWidth={3} />
          </button>
        </div>

        {/* RIGHT SECTION: Navigation Actions */}
        <div className="flex items-center gap-4 text-slate-500 text-xs font-bold shrink-0">
          <button className="hidden sm:flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
            <Smartphone size={16}/> App
          </button>
          
          <div className="h-4 w-[1px] bg-slate-200 mx-1 hidden sm:block" />
          
          <button className="flex items-center gap-1.5 text-slate-700 hover:text-indigo-600 transition-colors">
            <Globe size={16}/> USD
          </button>
          
          {/* --- DYNAMIC AUTH UI --- */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 ml-2">
              <Link 
                to="/profile"
                className="flex items-center gap-2 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm transition-all group"
              >
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-inner">
                  <User size={12} className="text-white" />
                </div>
                <span className="font-bold text-slate-800">My Profile</span>
                <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 whitespace-nowrap"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={checkAuth}
      />
    </>
  );
};