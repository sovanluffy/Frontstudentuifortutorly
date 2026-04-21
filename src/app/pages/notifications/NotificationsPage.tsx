"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  getMyNotifications, getUnreadCount, markAsRead, 
  markAllAsRead, deleteNotification, Notification 
} from "@/app/api/notificationApi";
import { 
  CheckCheck, Trash2, Inbox, 
  Hash, Calendar, Circle, ChevronRight 
} from "lucide-react";

/* ================= COLOR SYSTEM ================= */
const getTypeStyles = (type: string) => {
  switch (type) {
    case "BOOKING":
      return {
        card: "bg-blue-50 border-blue-200",
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-700",
        bar: "bg-blue-500",
      };
    case "PAYMENT":
      return {
        card: "bg-emerald-50 border-emerald-200",
        text: "text-emerald-700",
        badge: "bg-emerald-100 text-emerald-700",
        bar: "bg-emerald-500",
      };
    case "CANCEL":
      return {
        card: "bg-rose-50 border-rose-200",
        text: "text-rose-700",
        badge: "bg-rose-100 text-rose-700",
        bar: "bg-rose-500",
      };
    case "REMINDER":
      return {
        card: "bg-amber-50 border-amber-200",
        text: "text-amber-700",
        badge: "bg-amber-100 text-amber-700",
        bar: "bg-amber-500",
      };
    default:
      return {
        card: "bg-slate-50 border-slate-200",
        text: "text-slate-600",
        badge: "bg-slate-100 text-slate-600",
        bar: "bg-slate-400",
      };
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [list, count] = await Promise.all([
        getMyNotifications(),
        getUnreadCount()
      ]);
      setNotifications(list);
      setUnread(count);
    } catch (err) {
      console.error("Failed to sync notifications", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleMarkOne = async (id: number, isRead: boolean) => {
    if (isRead) return;
    try {
      await markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnread(prev => Math.max(prev - 1, 0));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnread(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number, wasRead: boolean) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (!wasRead) setUnread(prev => Math.max(prev - 1, 0));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* STICKY HEADER SECTION */}
      <div className="sticky top-0 z-20 bg-[#F8FAFC]/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-3xl mx-auto py-8 px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
                Inbox
                {unread > 0 && (
                  <span className="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-full">
                    {unread} NEW
                  </span>
                )}
              </h1>
              <p className="text-slate-500 italic text-sm">
                Updates regarding your bookings.
              </p>
            </div>

            <button
              onClick={handleMarkAll}
              disabled={unread === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl 
                text-xs font-bold uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 
                transition disabled:opacity-30 shadow-sm"
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
          </div>
        </div>
      </div>

      {/* SCROLLABLE LIST */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState />
          ) : (
            notifications.map((n) => {
              const style = getTypeStyles(n.type);

              return (
                <div
                  key={n.id}
                  onClick={() => handleMarkOne(n.id, n.read)}
                  className={`group relative flex items-start gap-4 p-6 border rounded-[1.5rem] cursor-pointer transition-all duration-300
                    ${n.read
                      ? "bg-white border-slate-100 opacity-70"
                      : `${style.card} hover:shadow-lg hover:-translate-y-[1px] shadow-sm`
                    }`}
                >
                  {/* Left color bar */}
                  {!n.read && (
                    <div className={`absolute left-0 top-0 h-full w-1.5 rounded-l-[1.5rem] ${style.bar}`} />
                  )}

                  {/* Unread dot */}
                  {!n.read && (
                    <Circle className="absolute left-3 top-1/2 -translate-y-1/2 fill-indigo-600 text-indigo-600" size={8} />
                  )}

                  {/* Content */}
                  <div className="flex-1 space-y-2 pl-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-black tracking-widest px-2 py-0.5 rounded uppercase ${style.badge}`}>
                        {n.type}
                      </span>
                      <span className="text-slate-400 text-[10px] font-medium">
                        {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <p className={`text-sm leading-relaxed ${n.read ? "text-slate-500" : "text-slate-900 font-semibold"}`}>
                      {n.content}
                    </p>

                    <div className="flex gap-4 pt-2">
                      <Meta label="Booking" value={n.bookingId} icon={<Hash size={12} />} />
                      <Meta label="Class" value={n.classId} icon={<Calendar size={12} />} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                    <button
                      onClick={(e) => handleDelete(e, n.id, n.read)}
                      className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                    <ChevronRight className="text-slate-300 mt-auto" size={18} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Meta({ label, value, icon }: { label: string, value: number, icon: any }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
      {icon} {label}: {value}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-20 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center text-center">
      <Inbox className="text-slate-200 mb-4" size={48} />
      <h3 className="text-slate-800 font-bold">No notifications</h3>
      <p className="text-slate-400 text-sm">Your inbox is empty.</p>
    </div>
  );
}