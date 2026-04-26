"use client";

import * as React from "react";
import {
  Menu,
  Globe,
  Smartphone,
  LogOut,
  ChevronRight,
  ChevronDown,
  Check
} from "lucide-react";
import { AuthModal } from "./AuthModal";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

// --- FIXED IMPORT PATH ---
// Adjust this path to exactly where your file is. 
// If Navbar is in src/app/components/ and image is in src/image/
import logo from "@/image/logogo.png"; 

interface NavbarProps {
  onToggle: () => void;
  isSidebarOpen: boolean;
}

export const Navbar = ({ onToggle, isSidebarOpen }: NavbarProps) => {
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  
  const { user, logout, isLoading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const langRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarImage = user?.avatarUrl || user?.profilePicture;
  const fullName = user?.fullname || "User";
  const userRole = user?.roles?.[0] || "Student";
  const initial = fullName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const languages = [
    { code: "KH", name: "ភាសាខ្មែរ", flag: "🇰🇭" },
    { code: "EN", name: "English", flag: "🇺🇸" },
  ];

  if (isLoading) return null;

  return (
    <>
      <nav className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/60 px-3 md:px-6 py-1.5 flex items-center justify-between sticky top-0 h-16 z-[100]">
        
        {/* LEFT: Menu & Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggle}
            className={`p-2 rounded-xl transition-all duration-200 ${
              isSidebarOpen ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-2.5">
              <img 
                src={logo} 
                alt="Logo" 
                className="w-9 h-9 object-contain rounded-lg" 
              />
              <span className="text-xl md:text-2xl font-black text-[#0066FF] tracking-tight group-hover:opacity-80 transition">
                Tutor<span className="text-[#0F294D]">Hub</span>
              </span>
            </div>
          </Link>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 md:gap-5">
          <div className="hidden sm:flex items-center gap-4 text-sm font-semibold text-slate-600">
            
            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="hover:text-indigo-600 transition flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 active:scale-95"
              >
                <span className="text-base leading-none">
                  {languages.find(l => l.code === language)?.flag}
                </span>
                <span className="hidden xl:inline uppercase tracking-wider text-[11px] font-black">
                  {language === "KH" ? "ភាសាខ្មែរ" : "English"}
                </span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`} />
              </button>

              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 py-2 z-[110] overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as "EN" | "KH");
                        setIsLangOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-indigo-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{lang.flag}</span>
                        <span className={`text-sm font-bold ${language === lang.code ? "text-indigo-600" : "text-slate-600"}`}>
                          {lang.name}
                        </span>
                      </div>
                      {language === lang.code && <Check size={16} className="text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="hover:text-indigo-600 transition flex items-center gap-1.5">
              <Smartphone size={16} /> <span className="hidden xl:inline">{t("កម្មវិធី", "App")}</span>
            </button>
            <button className="hover:text-indigo-600 transition flex items-center gap-1.5">
              <Globe size={16} /> <span className="hidden xl:inline">USD</span>
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 p-1 pr-3 rounded-full border border-slate-200 transition-all group"
              >
                <div className="relative w-8 h-8 shrink-0 overflow-hidden rounded-full border border-white shadow-sm">
                  {avatarImage ? (
                    <img src={avatarImage} alt={fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                      {initial}
                    </div>
                  )}
                </div>
                <div className="hidden xs:flex flex-col items-start leading-none pr-1">
                  <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[100px]">{fullName}</span>
                  <span className="text-[9px] text-slate-500 uppercase font-bold mt-0.5 tracking-wider">{userRole}</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition" />
              </Link>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="bg-blue-600 text-white px-5 py-2 md:px-8 md:py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-100"
            >
              {t("ចូលប្រើ", "Sign in")}
            </button>
          )}
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};