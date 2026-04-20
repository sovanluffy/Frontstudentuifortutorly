import React, { useEffect, useState } from "react";
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
  Bell,
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

export const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const location = useLocation();
  const { role, isLoading, user } = useAuth();

  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

  /* ================= FETCH NOTIFICATIONS COUNT ================= */
  const fetchUnread = async () => {
    try {
      const token = getCookie("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const count = await res.json();
      setUnreadNotifications(count);
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  };

  useEffect(() => {
    if (!user?.email) return;

    fetchUnread();

    const interval = setInterval(() => {
      fetchUnread();
    }, 10000);

    return () => clearInterval(interval);
  }, [user?.email]);

  /* ================= MENU ================= */

  const studentItems: MenuItem[] = [
    { icon: <Home />, label: "Home", path: "/" },
    { icon: <BookOpen />, label: "Find Tutors", path: "/search" },
    { icon: <CalendarCheck />, label: "My Bookings", path: "/student/bookings" },
    {
      icon: <Bell />,
      label: "Notifications",
      path: "/notifications",
      badge: unreadNotifications,
    },
    { icon: <MessageCircle />, label: "Messages", path: "/messages" },
  ];

  const tutorItems: MenuItem[] = [
    {
      icon: <LayoutDashboard />,
      label: "Bookings",
      path: "/tutor/bookings",
    },
    {
      icon: <PlusSquare />,
      label: "Manage Classes",
      path: "/tutor/manage",
    },
    {
      icon: <Bell />,
      label: "Notifications",
      path: "/notifications",
      badge: unreadNotifications,
    },
    {
      icon: <MessageCircle />,
      label: "Messages",
      path: "/messages",
    },
  ];

  const menuItems = role === "TUTOR" ? tutorItems : studentItems;

  /* ================= LOADING ================= */
  if (isLoading) {
    return <aside className="w-64 h-screen bg-gray-100 animate-pulse" />;
  }

  return (
    <aside
      className={`bg-white border-r h-screen flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-0 overflow-hidden"
      }`}
    >
      {/* LOGO */}
      <div className="p-6 font-bold text-blue-600 text-lg">
        TutorHub
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item, i) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <Link
              key={i}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? "text-white" : "text-gray-400"}>
                  {item.icon}
                </span>

                <span className="text-sm font-medium">
                  {item.label}
                </span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
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

      {/* PROFILE */}
      <div className="p-4 border-t">
        <Link
          to="/profile"
          className="flex items-center gap-3 text-gray-600 hover:text-blue-600"
        >
          <User size={18} />
          <span className="text-sm">Profile</span>
        </Link>
      </div>
    </aside>
  );
};