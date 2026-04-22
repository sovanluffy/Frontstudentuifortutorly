"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Cookies from "js-cookie";

const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

/* ================= TYPES ================= */
interface Booking {
  bookingId: number;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentAvatar?: string | null;
  classTitle: string;
  day: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  note?: string;
  telegram?: string;
  createdAt: string;
}

type FilterStatus = "ALL" | "PENDING" | "CONFIRMED" | "REJECTED";

/* ================= COMPONENT ================= */
const TutorBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  // Helper to get token from cookies
  const getToken = () => (typeof window !== "undefined" ? Cookies.get("token") : null);

  /* ================= FETCH DATA ================= */
  const fetchBookings = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/bookings/tutor/me`, {
        headers: { 
            Authorization: `Bearer ${token}`,
            "Accept": "application/json"
        },
      });

      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= UPDATE STATUS (PATCH) ================= */
  const updateStatus = async (id: number, action: "confirm" | "reject") => {
    const token = getToken();
    if (!token) return;

    try {
      // Correct Path: /api/v1/bookings/confirm/4
      // Correct Method: PATCH
      const res = await fetch(`${API_BASE}/bookings/${action}/${id}`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Accept": "*/*"
        },
      });

      if (res.ok) {
        // Refresh local list
        fetchBookings();
        // Trigger sidebar update if listening for this event
        window.dispatchEvent(new Event("refreshCounts"));
      } else {
        const error = await res.json();
        console.error("API Error:", error);
      }
    } catch (err) {
      console.error("Network error during update:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /* ================= FILTER LOGIC ================= */
  const filteredBookings = useMemo(() => {
    if (filter === "ALL") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-gray-400 animate-pulse font-medium">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* HEADER & FILTER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
          <p className="text-sm text-gray-500">Review and respond to student requests.</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
          {(["ALL", "PENDING", "CONFIRMED", "REJECTED"] as FilterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === s 
                  ? "bg-white shadow-sm text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* BOOKING LIST */}
      <div className="grid gap-4">
        {filteredBookings.length === 0 ? (
          <div className="py-20 border-2 border-dashed rounded-2xl text-center text-gray-400">
            No {filter !== "ALL" ? filter.toLowerCase() : ""} bookings found.
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div 
              key={b.bookingId} 
              className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-6 hover:border-blue-200 transition-colors"
            >
              
              {/* 1. Student Identity */}
              <div className="flex gap-4 flex-1">
                <img
                  src={b.studentAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(b.studentName)}&background=random`}
                  className="w-16 h-16 rounded-full border-2 border-white shadow-sm object-cover bg-gray-50"
                  alt="student"
                />
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900 text-lg">{b.studentName}</h3>
                  <p className="text-sm text-gray-500">{b.studentEmail}</p>
                  <p className="text-sm text-gray-500">{b.studentPhone}</p>
                  <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                    {b.classTitle}
                  </div>
                </div>
              </div>

              {/* 2. Schedule & Notes */}
              <div className="flex-1 border-l pl-6 hidden md:block space-y-3">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Schedule</div>
                  <p className="text-sm font-medium text-gray-700 mt-1">
                    📅 {b.day} | ⏰ {b.startTime.slice(0, 5)} - {b.endTime.slice(0, 5)}
                  </p>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Message</div>
                  <p className="text-sm text-gray-600 italic mt-1 line-clamp-2">
                    {b.note ? `"${b.note}"` : "No note provided."}
                  </p>
                  {b.telegram && (
                    <p className="text-xs text-blue-500 font-semibold mt-1">
                      Telegram: {b.telegram}
                    </p>
                  )}
                </div>
              </div>

              {/* 3. Status & Actions */}
              <div className="flex flex-col justify-between items-end min-w-[150px]">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                  b.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                  b.status === "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {b.status}
                </span>

                {b.status === "PENDING" && (
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => updateStatus(b.bookingId, "confirm")} 
                      className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-700 shadow-sm transition-all active:scale-95"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => updateStatus(b.bookingId, "reject")} 
                      className="bg-white text-red-600 border border-red-100 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-50 transition-all active:scale-95"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TutorBookingsPage;