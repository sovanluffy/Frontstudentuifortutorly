"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import {
  Home,
  CalendarCheck,
  MessageCircle,
  User,
  LayoutDashboard,
  Library,
  BookOpen,
  LogOut,
} from "lucide-react";
import logo from "@/image/logogo.png";

const API_BASE = import.meta.env.VITE_API_BASE || "https://toturhub-dev.onrender.com/api/v1";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

export const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, user, logout, isLoading } = useAuth();
  const [unreadChats, setUnreadChats] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const isFetching = useRef(false);

  const fetchCounts = useCallback(async () => {
    if (!user || isFetching.current) return;
    const token = Cookies.get("token");
    if (!token) return;
    try {
      isFetching.current = true;
      const chatRes = await fetch(`${API_BASE}/chat/unread-count`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (chatRes.ok) setUnreadChats(Number(await chatRes.json()) || 0);
      if (role === "TUTOR") {
        const bookingRes = await fetch(`${API_BASE}/bookings/tutor/me/pending-count`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (bookingRes.ok) setPendingBookings(Number(await bookingRes.json()) || 0);
      }
    } catch {
      console.warn("Sidebar sync failed");
    } finally {
      isFetching.current = false;
    }
  }, [role, user]);

  useEffect(() => {
    if (!user || isLoading) return;
    fetchCounts();
    window.addEventListener("refreshCounts", fetchCounts);
    const interval = setInterval(fetchCounts, 30000);
    return () => {
      window.removeEventListener("refreshCounts", fetchCounts);
      clearInterval(interval);
    };
  }, [user, isLoading, fetchCounts]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const publicItems: MenuItem[] = [
    { icon: <Home size={18} />, label: "Home", path: "/" },
  ];
  const studentItems: MenuItem[] = [
    { icon: <Home size={18} />, label: "Home", path: "/" },
    { icon: <BookOpen size={18} />, label: "My Tutors", path: "/student/my-tutor" },
    { icon: <CalendarCheck size={18} />, label: "My Bookings", path: "/student/bookings" },
    { icon: <MessageCircle size={18} />, label: "Messages", path: "/messages", badge: unreadChats },
  ];
  const tutorItems: MenuItem[] = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/tutor/Dashboard" },
    { icon: <Library size={18} />, label: "My Classes", path: "/tutor/classes" },
    { icon: <CalendarCheck size={18} />, label: "Bookings", path: "/tutor/bookings", badge: pendingBookings },
    { icon: <MessageCircle size={18} />, label: "Messages", path: "/messages", badge: unreadChats },
  ];

  let menuItems: MenuItem[] =
    !user || !role ? publicItems : role === "TUTOR" ? tutorItems : studentItems;

  if (isLoading) return (
    <aside className="w-[240px] h-screen bg-white flex flex-col border-r border-slate-100">
      <div className="h-14 md:h-16 flex items-center px-5 border-b border-slate-100">
        <div className="w-28 h-7 bg-slate-100 rounded-lg animate-pulse" />
      </div>
      <div className="flex-1 px-4 py-4 space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-11 w-full bg-slate-50 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="p-3 border-t border-slate-100">
        <div className="h-11 w-full bg-rose-50 rounded-xl animate-pulse" />
      </div>
    </aside>
  );

  return (
    <aside className="w-[240px] h-screen bg-white border-r border-slate-100/80 flex flex-col">

      {/* ── Logo header ── */}
      <div className="h-14 md:h-16 flex items-center px-4 md:px-5 border-b border-slate-100/80 shrink-0">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logo}
            alt="TutorHub"
            className="w-7 h-7 md:w-8 md:h-8 object-contain rounded-lg shrink-0"
          />
          <span className="text-[16px] md:text-[18px] font-black tracking-tight text-[#0066FF] group-hover:opacity-75 transition whitespace-nowrap">
            Tutor<span className="text-[#0F294D]">Hub</span>
          </span>
        </Link>
      </div>

      {/* ── Nav items ── */}
      <nav className="flex-1 px-3 py-3 md:py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
        {menuItems.map((item, i) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));

          return (
            <Link
              key={i}
              to={item.path}
              className={`
                relative flex items-center justify-between px-3.5 py-3 rounded-xl
                transition-all duration-200 group
                ${isActive
                  ? "bg-[#0F294D] text-white"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }
              `}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-r-full" />
              )}
              <div className="flex items-center gap-3">
                <span className={isActive ? "text-blue-300" : "text-slate-400 group-hover:text-slate-600"}>
                  {item.icon}
                </span>
                <span className="text-[13px] font-semibold tracking-tight">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 min-w-[20px] text-center rounded-md bg-rose-500 text-white leading-tight">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom: profile row + logout button ── */}
      {user && (
        <div className="p-3 border-t border-slate-100 space-y-1.5">

          {/* Profile link */}
          <Link
            to="/profile"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
              ${location.pathname === "/profile"
                ? "bg-slate-50 ring-1 ring-slate-200"
                : "hover:bg-slate-50"
              }
            `}
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-slate-100 overflow-hidden flex items-center justify-center shadow-sm">
                {(user as any).avatar ? (
                  <img src={(user as any).avatar} className="w-full h-full object-cover" alt="avatar" />
                ) : (
                  <User size={15} className="text-indigo-500" />
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-bold text-slate-800 truncate">
                {(user as any).name || "My Account"}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                {role}
              </span>
            </div>
          </Link>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group"
          >
            <LogOut size={16} className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="text-[13px] font-semibold">Log out</span>
          </button>

        </div>
      )}
    </aside>
  );
};