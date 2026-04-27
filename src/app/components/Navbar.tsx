"use client";

import * as React from "react";
import {
  Menu,
  LogOut,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { AuthModal } from "./AuthModal";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
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
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setIsLangOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarImage = user?.avatarUrl || user?.profilePicture;
  const fullName = user?.fullname || "User";
  const userRole = user?.roles?.[0] || "Student";
  const initial = fullName.charAt(0).toUpperCase();

  const languages = [
    { code: "KH", name: "ភាសាខ្មែរ", flag: "🇰🇭" },
    { code: "EN", name: "English", flag: "🇺🇸" },
  ];

  if (isLoading) return null;

  return (
    <>
      <nav className="w-full h-14 md:h-16 bg-white border-b border-slate-100/80 px-3 md:px-6 flex items-center justify-between sticky top-0 z-[100]">

        {/* LEFT — toggle + logo */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <button
            onClick={onToggle}
            aria-label="Toggle sidebar"
            className={`
              w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl transition-all duration-200 shrink-0
              ${isSidebarOpen
                ? "bg-[#0F294D] text-white"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }
            `}
          >
            {isSidebarOpen ? <X size={17} /> : <Menu size={17} />}
          </button>

          {/* Logo — visible only when sidebar is closed */}
          <div
            className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
              isSidebarOpen
                ? "max-w-0 opacity-0 pointer-events-none"
                : "max-w-[180px] opacity-100"
            }`}
          >
            <Link to="/" className="flex items-center gap-2 group whitespace-nowrap">
              <img
                src={logo}
                alt="TutorHub"
                className="w-7 h-7 md:w-8 md:h-8 object-contain rounded-lg shrink-0"
              />
              <span className="text-[16px] md:text-[18px] font-black tracking-tight text-[#0066FF] group-hover:opacity-75 transition">
                Tutor<span className="text-[#0F294D]">Hub</span>
              </span>
            </Link>
          </div>
        </div>

        {/* RIGHT — language + auth only */}
        <div className="flex items-center gap-1.5 md:gap-2">

          {/* Language switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 h-8 md:h-9 px-2.5 md:px-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all text-[12px] font-semibold"
            >
              <span className="text-base leading-none">
                {languages.find(l => l.code === language)?.flag}
              </span>
              <span className="hidden md:inline text-[12px]">
                {language === "KH" ? "ភាសាខ្មែរ" : "English"}
              </span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`} />
            </button>

            {isLangOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 py-1.5 z-[110] overflow-hidden">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code as "EN" | "KH"); setIsLangOpen(false); }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{lang.flag}</span>
                      <span className={`text-[12px] font-semibold ${language === lang.code ? "text-blue-600" : "text-slate-600"}`}>
                        {lang.name}
                      </span>
                    </div>
                    {language === lang.code && <Check size={13} className="text-blue-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-1">
              <Link
                to="/profile"
                className="flex items-center gap-2 h-8 md:h-9 pl-1.5 pr-2 md:pr-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition-all"
              >
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg overflow-hidden shrink-0 bg-indigo-100 flex items-center justify-center">
                  {avatarImage ? (
                    <img src={avatarImage} alt={fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[9px] md:text-[10px] font-bold text-indigo-600 uppercase">{initial}</span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col leading-none">
                  <span className="text-[11px] font-bold text-slate-800 line-clamp-1 max-w-[90px]">{fullName}</span>
                  <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider mt-0.5">{userRole}</span>
                </div>
              </Link>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="h-8 md:h-9 px-3.5 md:px-5 bg-[#0066FF] hover:bg-blue-700 text-white text-[11px] md:text-[12px] font-bold rounded-xl transition-all shadow-sm shadow-blue-200 active:scale-[0.97] whitespace-nowrap"
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