"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarCheck,
  Loader2,
  Clock,
  MessageSquare,
  Phone,
  AlertCircle,
  User,
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

const getTokenFromCookie = () => 
  document.cookie.match(/token=([^;]+)/)?.[1] || "";

export default function MyBookingsPage() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterType>("ALL");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getTokenFromCookie();
      if (!token) throw new Error("Please login to view your bookings.");

      const res = await fetch(`${API_BASE}/bookings/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load bookings");

      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Something went wrong while loading bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const filteredBookings = 
    filter === "ALL" 
      ? bookings 
      : bookings.filter((b) => b.status === filter);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-emerald-100 text-emerald-700";
      case "PENDING":   return "bg-amber-100 text-amber-700";
      case "CANCELLED": return "bg-rose-100 text-rose-700";
      case "COMPLETED": return "bg-blue-100 text-blue-700";
      default:          return "bg-slate-100 text-slate-600";
    }
  };

  const formatStatus = (status: string) => {
    if (status === "PENDING") return "Waiting";
    return status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-indigo-600" size={40} />
          <p className="mt-4 text-slate-500">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 pt-6">

        {/* Simple Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
            <p className="text-sm text-slate-500 mt-1">
              {bookings.length} bookings
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
          {(["ALL", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-black text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f === "PENDING" ? "Waiting" : f}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex gap-3">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* Bookings */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400">No bookings in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div
                key={b.bookingId}
                className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={b.studentAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.studentName}`}
                    alt={b.studentName}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg text-slate-900 line-clamp-2">
                        {b.classTitle}
                      </h3>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle(b.status)}`}>
                        {formatStatus(b.status)}
                      </span>
                    </div>

                    <p className="text-slate-500 text-sm mt-1">{b.studentName}</p>

                    {/* Schedule */}
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                      <Clock size={16} className="text-slate-400" />
                      <span>
                        {b.day} • {b.startTime?.slice(0, 5) || "--:--"} - {b.endTime?.slice(0, 5) || "--:--"}
                      </span>
                    </div>

                    {/* Contact */}
                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-slate-400" />
                        <span>{b.studentPhone}</span>
                      </div>
                      {b.telegram && (
                        <div className="flex items-center gap-2 text-indigo-600">
                          <MessageSquare size={16} />
                          <span>@{b.telegram}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {b.note && (
                  <div className="mt-5 pt-5 border-t border-slate-100 text-sm text-slate-600 italic">
                    "{b.note}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}