"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie"; // Use the library for reliability
import {
  Home,
  CalendarCheck,
  MessageCircle,
  User,
  LayoutDashboard,
  Library,
} from "lucide-react";

const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

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

  /* ================= TOKEN FROM COOKIES ================= */
  const getToken = () => {
    if (typeof window === "undefined") return null;
    // Prioritize cookie 'token', fallback to localStorage
    return Cookies.get("token") || localStorage.getItem("token");
  };

  /* ================= FETCH COUNTS ================= */
  const fetchCounts = useCallback(async () => {
    // Only fetch if user is logged in
    if (!user) return;

    const token = getToken();
    if (!token) return;

    try {
      // 1. Fetch Chat unread count
      const chatRes = await fetch(`${API_BASE}/chat/unread-count`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Accept": "application/json"
        },
      });

      if (chatRes.ok) {
        const data = await chatRes.json();
        // The API returns a raw number based on your screenshot
        setUnreadChats(Number(data) || 0);
      }

      // 2. Fetch Tutor pending bookings count
      if (role === "TUTOR") {
        const bookingRes = await fetch(
          `${API_BASE}/bookings/tutor/me/pending-count`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              "Accept": "application/json"
            },
          }
        );

        if (bookingRes.ok) {
          const data = await bookingRes.json();
          setPendingBookings(Number(data) || 0);
        }
      }
    } catch (err) {
      console.error("Sidebar fetch error:", err);
    }
  }, [role, user]);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchCounts();

    // Listen for manual refreshes (like after confirming a booking)
    window.addEventListener("refreshCounts", fetchCounts);

    // Auto-refresh every 15 seconds for live updates
    const interval = setInterval(fetchCounts, 15000);

    return () => {
      window.removeEventListener("refreshCounts", fetchCounts);
      clearInterval(interval);
    };
  }, [user, fetchCounts]);

  /* ================= MENU LOGIC ================= */
  const publicItems: MenuItem[] = [
    { icon: <Home size={20} />, label: "Home", path: "/" },
  ];

  const studentItems: MenuItem[] = [
    { icon: <Home size={20} />, label: "Home", path: "/" },
    { icon: <User size={20} />, label: "My Tutor", path: "/student/my-tutor" },
    { icon: <CalendarCheck size={20} />, label: "My Bookings", path: "/student/bookings" },
    {
      icon: <MessageCircle size={20} />,
      label: "Messages",
      path: "/messages",
      badge: unreadChats, // Chat count badge
    },
  ];

  const tutorItems: MenuItem[] = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/tutor/dashboard" },
    { icon: <Library size={20} />, label: "My Class", path: "/tutor/classes" },
    {
      icon: <CalendarCheck size={20} />,
      label: "Bookings",
      path: "/tutor/booking",
      badge: pendingBookings, // Booking count badge
    },
    {
      icon: <MessageCircle size={20} />,
      label: "Messages",
      path: "/messages",
      badge: unreadChats, // Chat count badge
    },
  ];

  let menuItems: MenuItem[] = [];
  if (!user || !role) menuItems = publicItems;
  else if (role === "TUTOR") menuItems = tutorItems;
  else menuItems = studentItems;

  if (isLoading) {
    return <aside className="w-64 h-screen bg-gray-50 border-r animate-pulse" />;
  }

  return (
    <aside
      className={`bg-white border-r h-screen flex flex-col transition-all duration-300 z-50 ${
        isOpen ? "w-64" : "w-0 overflow-hidden"
      }`}
    >
      <div className="p-6 font-black text-blue-600 text-xl whitespace-nowrap">
        TutorHub
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item, i) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <Link
              key={i}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm font-semibold whitespace-nowrap">
                  {item.label}
                </span>
              </div>

              {/* BADGE UI */}
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold min-w-[20px] text-center ${
                    isActive
                      ? "bg-white text-blue-600"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="p-4 border-t bg-gray-50/50">
          <Link
            to="/profile"
            className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition"
          >
            <User size={18} />
            <span className="text-sm font-bold">Profile</span>
          </Link>
        </div>
      )}
    </aside>
  );
};