"use client";

import React, { useEffect, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { CheckCircle, AlertCircle, User } from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";

/* ================= API ================= */
const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

/* ================= COOKIE ================= */
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  return (
    document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))?.[2] ??
    null
  );
};

/* ================= SAFE JWT DECODE ================= */
const getTutorIdFromToken = (token: string | null): number | null => {
  try {
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.userId ?? null;
  } catch {
    return null;
  }
};

/* ================= TYPE ================= */
interface Booking {
  bookingId: number;
  classTitle: string;
  day: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  note?: string;
  telegram?: string;
}

export default function TutorBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  /* ================= TOKEN ================= */
  const token = getCookie("token");
  const safeToken = token ?? null;
  const tutorId = getTutorIdFromToken(safeToken);

  /* ================= FETCH BOOKINGS ================= */
  const fetchBookings = useCallback(async () => {
    if (!safeToken || !tutorId) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/bookings/tutor/${tutorId}`,
        {
          headers: {
            Authorization: `Bearer ${safeToken}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [safeToken, tutorId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /* ================= WEBSOCKET ================= */
  useEffect(() => {
    if (!safeToken) return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS("https://toturhub-dev.onrender.com/ws"),
      connectHeaders: {
        Authorization: `Bearer ${safeToken}`,
      },
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      const sub = client.subscribe(
        "/user/queue/notifications",
        (msg) => {
          const data = JSON.parse(msg.body);

          setNotifications((prev) => [data, ...prev]);
          fetchBookings();
        }
      );

      client.onDisconnect = () => {
        sub.unsubscribe();
      };
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [safeToken, fetchBookings]);

  /* ================= ACTION ================= */
  const handleAction = async (
    id: number,
    action: "confirm" | "reject"
  ) => {
    try {
      await fetch(
        `${API_BASE}/bookings/${action}/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${safeToken}`,
          },
        }
      );

      fetchBookings();
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Tutor Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-400">No bookings found</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b.bookingId}
            className="bg-white p-5 rounded-xl shadow flex justify-between"
          >
            {/* LEFT */}
            <div>
              <h2 className="font-bold text-lg">{b.classTitle}</h2>

              <p className="text-sm text-gray-500">
                {b.day} • {b.startTime?.slice(0, 5)} -{" "}
                {b.endTime?.slice(0, 5)}
              </p>

              {b.note && (
                <p className="text-xs text-gray-400 mt-1">
                  Note: {b.note}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <User size={12} />
                {b.telegram || "N/A"}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              {b.status === "PENDING" ? (
                <>
                  <button
                    onClick={() => handleAction(b.bookingId, "reject")}
                    className="text-red-500 text-sm"
                  >
                    Reject
                  </button>

                  <Button
                    onClick={() => handleAction(b.bookingId, "confirm")}
                    className="bg-blue-600 text-white"
                  >
                    Confirm
                  </Button>
                </>
              ) : (
                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold ${
                    b.status === "CONFIRMED"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {b.status === "CONFIRMED" ? (
                    <CheckCircle size={14} />
                  ) : (
                    <AlertCircle size={14} />
                  )}
                  {b.status}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}