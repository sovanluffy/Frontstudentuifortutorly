"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef
} from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from "axios";
import { Bell, MessageSquare } from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";

/* ================= TYPES ================= */
interface Booking {
  bookingId: number;
  userId: number;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentAvatar: string | null;
  classId: number;
  classTitle: string;
  scheduleId: number;
  day: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  note?: string;
  telegram?: string;
}

type FilterType = "ALL" | "PENDING" | "CONFIRMED" | "REJECTED";

const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

/* ================= COOKIE ================= */
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

/* ================= JWT ================= */
const decodeToken = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export default function TutorBookingPage() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

  const socketRef = useRef<any>(null);

  const token = useMemo(() => getCookie("token") || "", []);
  const userData = useMemo(() => decodeToken(token), [token]);
  const tutorId = userData?.tutorId;

  /* ================= FETCH BOOKINGS ================= */
  const fetchBookings = useCallback(async () => {
    if (!token || !tutorId) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE}/bookings/tutor/${tutorId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setBookings(res.data ?? []);
    } catch (err) {
      console.error("Fetch error:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [token, tutorId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /* ================= WEBSOCKET (REAL CHAT SYNC) ================= */
  useEffect(() => {
    if (!token) return;

    const socket = new SockJS("https://toturhub-dev.onrender.com/ws");
    const stomp = Stomp.over(socket);
    stomp.debug = () => {};

    socketRef.current = stomp;

    stomp.connect({ Authorization: `Bearer ${token}` }, () => {
      stomp.subscribe("/user/queue/messages", (msg) => {
        const data = JSON.parse(msg.body);

        console.log("CHAT MESSAGE RECEIVED:", data);

        // optional: refresh bookings if system message
        fetchBookings();
      });
    });

    return () => {
      if (stomp?.connected) stomp.disconnect(() => {});
    };
  }, [token, fetchBookings]);

  /* ================= CONFIRM / REJECT ================= */
  const handleAction = async (
    bookingId: number,
    action: "confirm" | "reject"
  ) => {
    try {
      await axios.patch(
        `${API_BASE}/bookings/${action}/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔥 IMPORTANT:
      // backend already sends SYSTEM CHAT message
      // so we just refresh UI
      await fetchBookings();

    } catch (err) {
      console.error("Action error:", err);
    }
  };

  /* ================= OPEN CHAT ================= */
  const handleMessageClick = (b: Booking) => {
    navigate("/messages", {
      state: {
        recipientId: b.userId,
        recipientName: b.studentName,
        recipientEmail: b.studentEmail,
        recipientAvatar: b.studentAvatar,
        classId: b.classId,
        bookingId: b.bookingId,
        context: "BOOKING_CHAT"
      }
    });
  };

  /* ================= FILTER ================= */
  const displayBookings = useMemo(() => {
    return activeFilter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === activeFilter);
  }, [bookings, activeFilter]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#F9FAFB]">

      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-black">Manage Bookings</h1>
              <p className="text-sm text-gray-500">Accept / Reject → auto chat message</p>
            </div>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs flex items-center gap-2">
              <Bell size={14} /> Live
            </button>
          </div>

          {/* FILTER */}
          <div className="flex gap-2 flex-wrap">
            {(["ALL", "PENDING", "CONFIRMED", "REJECTED"] as FilterType[]).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                    activeFilter === tab
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="max-w-4xl mx-auto p-6">

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : displayBookings.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            No bookings found
          </div>
        ) : (
          displayBookings.map((b) => (
            <div key={b.bookingId} className="bg-white p-6 rounded-3xl border mb-4">

              {/* STUDENT INFO */}
              <div className="flex justify-between items-center">

                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center">
                    {b.studentAvatar ? (
                      <img src={b.studentAvatar} className="w-full h-full" />
                    ) : (
                      b.studentName[0]
                    )}
                  </div>

                  <div>
                    <p className="font-bold">{b.studentName}</p>
                    <p className="text-xs text-gray-500">{b.studentEmail}</p>
                  </div>
                </div>

                {/* CHAT BUTTON */}
                <button
                  onClick={() => handleMessageClick(b)}
                  className="text-blue-600 font-bold flex items-center gap-1"
                >
                  <MessageSquare size={14} /> Chat
                </button>

              </div>

              {/* CLASS INFO */}
              <div className="text-sm text-gray-600 mt-2">
                {b.classTitle} • {b.day} • {b.startTime}-{b.endTime}
              </div>

              {/* ACTION */}
              {b.status === "PENDING" && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleAction(b.bookingId, "reject")}
                    className="text-red-500 font-bold"
                  >
                    Reject
                  </button>

                  <Button onClick={() => handleAction(b.bookingId, "confirm")}>
                    Accept
                  </Button>
                </div>
              )}

            </div>
          ))
        )}

      </div>
    </div>
  );
}