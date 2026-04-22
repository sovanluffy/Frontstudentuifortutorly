"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarCheck,
  Loader2,
  Clock,
  MessageSquare,
  Phone,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

/* ================= TYPES ================= */
interface Booking {
  bookingId: number;
  userId: number;

  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentAvatar: string;

  classId: number;
  classTitle: string;

  scheduleId: number;
  day: string;

  startTime: string;
  endTime: string;

  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

  note?: string;
  telegram?: string;

  createdAt: string;
}

type FilterType = "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export default function MyBookingsPage() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState<FilterType>("ALL");

  /* ================= FETCH BOOKINGS ================= */
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/bookings/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Unauthorized or failed request");
      }

      const data = await res.json();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  /* ================= FILTER LOGIC ================= */
  const filteredBookings =
    filter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  /* ================= STATUS COLOR ================= */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-600";
      case "PENDING":
        return "bg-yellow-100 text-yellow-600";
      case "CANCELLED":
        return "bg-red-100 text-red-600";
      case "COMPLETED":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="p-6 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">

      {/* TITLE */}
      <div className="flex items-center gap-2 text-xl font-bold">
        <CalendarCheck />
        My Bookings
      </div>

      {/* ================= FILTER BUTTONS ================= */}
      <div className="flex flex-wrap gap-2">

        {(["ALL", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as FilterType[]).map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full border text-sm font-semibold transition
                ${
                  filter === f
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              {f}
            </button>
          )
        )}

      </div>

      {/* EMPTY STATE */}
      {filteredBookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid gap-4">

          {filteredBookings.map((b) => (
            <div
              key={b.bookingId}
              className="bg-white border rounded-2xl p-5 shadow-sm space-y-3"
            >

              {/* HEADER */}
              <div className="flex justify-between items-start">

                <div className="flex items-center gap-3">
                  <img
                    src={b.studentAvatar}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div>
                    <h2 className="font-bold text-lg">
                      {b.classTitle}
                    </h2>

                    <p className="text-xs text-gray-500">
                      {b.studentName}
                    </p>
                  </div>
                </div>

                {/* STATUS */}
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(
                    b.status
                  )}`}
                >
                  {b.status}
                </span>
              </div>

              {/* TIME */}
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Clock size={16} />
                {b.day} • {b.startTime} - {b.endTime}
              </div>

              {/* NOTE */}
              {b.note && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  {b.note}
                </div>
              )}

              {/* CONTACT */}
              <div className="flex justify-between text-xs text-gray-500">

                <div className="flex items-center gap-1">
                  <Phone size={14} />
                  {b.studentPhone}
                </div>

                {b.telegram && (
                  <div className="flex items-center gap-1">
                    <MessageSquare size={14} />
                    {b.telegram}
                  </div>
                )}

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}