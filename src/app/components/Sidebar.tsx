"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  BookOpen,
  CalendarCheck,
  MessageCircle,
  LayoutDashboard,
  PlusSquare,
  User,
} from "lucide-react";

/* ================= TYPES ================= */
interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

/* ================= COOKIE ================= */
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  return document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))?.[2];
};

const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

export const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const location = useLocation();
  const { role, isLoading, user } = useAuth();

  const [unreadChats, setUnreadChats] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);

  /* ================= SAFE FETCH ================= */
  const fetchCounts = useCallback(async () => {
    const token = getCookie("token");
    if (!token) return;

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      /* ================= CHAT COUNT ================= */
      try {
        const resChat = await fetch(`${API_BASE}/chat/unread-count`, {
          headers,
        });

        if (resChat.ok) {
          const data = await resChat.json();
          setUnreadChats(typeof data === "number" ? data : 0);
        }
      } catch (err) {
        console.log("chat count error:", err);
      }

      /* ================= TUTOR BOOKINGS ================= */
      if (role === "TUTOR") {
        try {
          const resPending = await fetch(
            `${API_BASE}/bookings/tutor/me/pending-count`,
            { headers }
          );

          if (resPending.ok) {
            const data = await resPending.json();
            setPendingBookings(typeof data === "number" ? data : 0);
          }
        } catch (err) {
          console.log("pending booking error:", err);
        }
      }
    } catch (err) {
      console.log("sidebar fetch error:", err);
    }
  }, [role]);

  /* ================= POLLING ================= */
  useEffect(() => {
    if (!user?.email) return;

    fetchCounts();

    const interval = setInterval(() => {
      fetchCounts();
    }, 15000);

    return () => clearInterval(interval);
  }, [user?.email, fetchCounts]);

  /* ================= MENU ================= */
  const studentItems: MenuItem[] = [
    { icon: <Home size={20} />, label: "Home", path: "/" },
    { icon: <BookOpen size={20} />, label: "Find Tutors", path: "/search" },
    { icon: <CalendarCheck size={20} />, label: "My Bookings", path: "/student/bookings" },

    {
      icon: <MessageCircle size={20} />,
      label: "Messages",
      path: "/messages",
      badge: unreadChats,
    },
  ];

  const tutorItems: MenuItem[] = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Bookings",
      path: "/tutor/bookings",
      badge: pendingBookings,
    },
    {
      icon: <PlusSquare size={20} />,
      label: "Manage Classes",
      path: "/tutor/manage",
    },
    {
      icon: <MessageCircle size={20} />,
      label: "Messages",
      path: "/messages",
      badge: unreadChats,
    },
  ];

  const menuItems = role === "TUTOR" ? tutorItems : studentItems;

  if (isLoading) {
    return <aside className="w-64 h-screen bg-gray-50 border-r animate-pulse" />;
  }

  return (
    <aside
      className={`bg-white border-r h-screen flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-0 overflow-hidden"
      }`}
    >
      {/* LOGO */}
      <div className="p-6 font-bold text-blue-600 text-xl">
        TutorHub
      </div>

      {/* MENU */}
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
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm font-semibold">{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500 text-white">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* PROFILE */}
      <div className="p-4 border-t bg-gray-50/50">
        <Link to="/profile" className="flex items-center gap-3">
          <User size={18} />
          <span className="text-sm font-bold">Profile</span>
        </Link>
      </div>
    </aside>
  );
};