"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
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
  ChevronRight
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "https://toturhub-dev.onrender.com/api/v1";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

export const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const location = useLocation();
  const { role, user, isLoading } = useAuth();
  const [unreadChats, setUnreadChats] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  
  const isFetching = useRef(false);

  /* ================= FETCH COUNTS ================= */
  const fetchCounts = useCallback(async () => {
    if (!user || isFetching.current) return;
    const token = Cookies.get("token");
    if (!token) return;

    try {
      isFetching.current = true;

      const chatRes = await fetch(`${API_BASE}/chat/unread-count`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
      });
      
      if (chatRes.ok) {
        const data = await chatRes.json();
        setUnreadChats(Number(data) || 0);
      }

      if (role === "TUTOR") {
        const bookingRes = await fetch(`${API_BASE}/bookings/tutor/me/pending-count`, {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json" 
          },
        });
        
        if (bookingRes.ok) {
          const data = await bookingRes.json();
          setPendingBookings(Number(data) || 0);
        }
      }
    } catch (err) {
      console.warn("Sidebar background sync failed");
    } finally {
      isFetching.current = false;
    }
  }, [role, user]);

  useEffect(() => {
    if (!user || isLoading) return;
    
    fetchCounts();
    
    const handleRefresh = () => fetchCounts();
    window.addEventListener("refreshCounts", handleRefresh);
    
    const interval = setInterval(fetchCounts, 30000); 
    
    return () => {
      window.removeEventListener("refreshCounts", handleRefresh);
      clearInterval(interval);
    };
  }, [user, isLoading, fetchCounts]);

  /* ================= MENU CONFIGURATION ================= */
  const publicItems: MenuItem[] = [
    { icon: <Home size={20} />, label: "Home", path: "/" },
  ];

  const studentItems: MenuItem[] = [
    { icon: <Home size={20} />, label: "Home", path: "/" },
    { icon: <BookOpen size={20} />, label: "My Tutors", path: "/student/my-tutor" },
    { icon: <CalendarCheck size={20} />, label: "My Bookings", path: "/student/bookings" },
    { icon: <MessageCircle size={20} />, label: "Messages", path: "/messages", badge: unreadChats },
  ];

  const tutorItems: MenuItem[] = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/tutor/dashboard" },
    { icon: <Library size={20} />, label: "My Classes", path: "/tutor/classes" },
    { icon: <CalendarCheck size={20} />, label: "Manage Bookings", path: "/tutor/bookings", badge: pendingBookings },
    { icon: <MessageCircle size={20} />, label: "Messages", path: "/messages", badge: unreadChats },
  ];

  let menuItems: MenuItem[] = [];
  if (!user || !role) menuItems = publicItems;
  else if (role === "TUTOR") menuItems = tutorItems;
  else menuItems = studentItems;

  if (isLoading) return (
    <aside className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col p-6 space-y-4">
      <div className="flex-1 space-y-2 mt-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-12 w-full bg-slate-50 rounded-xl animate-pulse" />)}
      </div>
    </aside>
  );

  return (
    <aside
      className={`bg-white border-r border-slate-100 h-screen flex flex-col transition-all duration-300 z-50 fixed md:relative ${
        isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:w-0 md:translate-x-0 overflow-hidden"
      }`}
    >
      {/* LOGO AND TITLE REMOVED 
          Navigation starts with more top padding for a clean look 
      */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-8 scrollbar-hide">
        {menuItems.map((item, i) => {
          const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));

          return (
            <Link
              key={i}
              to={item.path}
              className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${isActive ? "text-indigo-400" : "group-hover:scale-110 transition-transform"}`}>
                  {item.icon}
                </span>
                <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-lg font-black min-w-[22px] text-center bg-rose-500 text-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
                {isActive && <ChevronRight size={14} className="opacity-50" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* USER PROFILE SECTION REMAINS AT THE BOTTOM */}
      {user && (
        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
          <Link
            to="/profile"
            className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 group ${
              location.pathname === "/profile" ? "bg-white shadow-sm ring-1 ring-slate-200" : "hover:bg-white hover:shadow-sm"
            }`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                 {(user as any).avatar ? (
                   <img src={(user as any).avatar} className="w-full h-full object-cover" alt="avatar" />
                 ) : (
                   <User size={18} className="text-indigo-600" />
                 )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-black text-slate-900 leading-none truncate">
                {(user as any).name || "My Account"}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                {role} Profile
              </span>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
};