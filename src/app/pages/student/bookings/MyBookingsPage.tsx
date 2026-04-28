"use client";

import React, { useEffect, useState } from "react";
import {
  Loader2,
  Clock,
  MessageSquare,
  Phone,
  AlertCircle,
  CalendarCheck,
  Send,
  Filter,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE;

interface Booking {
  bookingId: number;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentAvatar: string;
  classTitle: string;
  day: string;
  startTime: string | null;
  endTime: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  note?: string;
  telegram?: string;
}

type FilterType = "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string; strip: string }> = {
  CONFIRMED: {
    label: "Confirmed",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    strip: "from-emerald-400 to-teal-300",
  },
  PENDING: {
    label: "Waiting",
    dot: "bg-amber-400 animate-pulse",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    strip: "from-amber-400 to-yellow-300",
  },
  CANCELLED: {
    label: "Cancelled",
    dot: "bg-rose-400",
    badge: "bg-rose-50 text-rose-600 border-rose-100",
    strip: "from-rose-400 to-pink-300",
  },
  COMPLETED: {
    label: "Completed",
    dot: "bg-blue-400",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    strip: "from-blue-400 to-indigo-300",
  },
};

const FILTER_TABS: { key: FilterType; label: string }[] = [
  { key: "ALL",       label: "All"       },
  { key: "PENDING",   label: "Waiting"   },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

const getToken = () => document.cookie.match(/token=([^;]+)/)?.[1] || "";

export default function MyBookingsPage() {
  const { user } = useAuth();

  const [bookings, setBookings]     = useState<Booking[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState("");
  const [filter, setFilter]         = useState<FilterType>("ALL");

  const fetchBookings = async (silent = false) => {
    try {
      silent ? setRefreshing(true) : setLoading(true);
      setError("");
      const token = getToken();
      if (!token) throw new Error("Please login to view your bookings.");
      const res = await fetch(`${API_BASE}/bookings/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [user]);

  const counts = FILTER_TABS.reduce((acc, { key }) => {
    acc[key] = key === "ALL" ? bookings.length : bookings.filter(b => b.status === key).length;
    return acc;
  }, {} as Record<FilterType, number>);

  const filtered = filter === "ALL" ? bookings : bookings.filter(b => b.status === filter);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#F4F7FE] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-[#4318FF]" size={36} />
          <p className="mt-3 text-slate-400 text-sm font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-[#F4F7FE] overflow-hidden">

      {/* ===== STICKY HEADER + TABS ===== */}
      <div className="shrink-0 w-full bg-[#F4F7FE]/95 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#4318FF] flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
              <CalendarCheck className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#1B2559]">My Bookings</h1>
              <p className="text-slate-400 text-[11px] font-medium">
                {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchBookings(true)}
            disabled={refreshing}
            className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#4318FF] hover:border-indigo-200 transition-all"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 pb-4 overflow-x-auto no-scrollbar">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all border ${
                filter === key
                  ? "bg-[#4318FF] text-white border-[#4318FF] shadow-lg shadow-indigo-200"
                  : "bg-white text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-[#4318FF]"
              }`}
            >
              {label}
              {counts[key] > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-lg min-w-[18px] text-center ${
                  filter === key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {counts[key]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ===== SCROLLABLE CARDS — FULL WIDTH ===== */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-5 pb-24">

          {/* Error */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex gap-3 items-start">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Empty */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 bg-white rounded-[32px] border border-slate-100 w-full">
              <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-5">
                <Filter size={32} className="text-slate-200" />
              </div>
              <p className="text-base font-black text-slate-300 uppercase tracking-wider">No bookings</p>
              <p className="text-slate-400 text-sm mt-2">Nothing in this category yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
              {filtered.map((b) => {
                const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.PENDING;
                return (
                  <div
                    key={b.bookingId}
                    className="bg-white rounded-[28px] border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {/* color strip */}
                    <div className={`h-0.5 w-full bg-gradient-to-r ${cfg.strip}`} />

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start gap-4">

                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <img
                            src={
                              b.studentAvatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(b.studentName)}&background=4318FF&color=fff&bold=true`
                            }
                            alt={b.studentName}
                            className="rounded-2xl object-cover ring-4 ring-slate-50"
                            style={{ height: 52, width: 52 }}
                          />
                          <span className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${cfg.dot}`} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-black text-[#1B2559] text-sm leading-snug line-clamp-2">
                              {b.classTitle}
                            </h3>
                            <span className={`shrink-0 text-[9px] font-black uppercase px-2.5 py-1 rounded-xl border ${cfg.badge}`}>
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-slate-400 text-xs font-medium mt-1 truncate">{b.studentName}</p>
                        </div>
                      </div>

                      {/* Schedule chip */}
                      <div className="mt-4 flex items-center gap-2 bg-[#F4F7FE] px-3.5 py-2.5 rounded-xl border border-slate-100">
                        <Clock size={13} className="text-indigo-400 shrink-0" />
                        <span className="text-xs font-bold text-[#1B2559] truncate">
                          {b.day} · {b.startTime?.slice(0, 5) ?? "--:--"} – {b.endTime?.slice(0, 5) ?? "--:--"}
                        </span>
                      </div>

                      {/* Contact */}
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {b.studentPhone && (
                          <a
                            href={`tel:${b.studentPhone}`}
                            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#4318FF] transition-colors font-medium"
                          >
                            <Phone size={13} className="text-slate-300" />
                            {b.studentPhone}
                          </a>
                        )}
                        {b.telegram && b.telegram !== "string" && (
                          <a
                            href={`https://t.me/${b.telegram.replace("@", "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs text-[#4318FF] font-bold hover:underline"
                          >
                            <Send size={12} />
                            @{b.telegram}
                          </a>
                        )}
                      </div>

                      {/* Note */}
                      {b.note && b.note !== "string" && (
                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-start gap-2">
                          <MessageSquare size={13} className="text-indigo-200 shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-400 italic leading-relaxed line-clamp-2">"{b.note}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}