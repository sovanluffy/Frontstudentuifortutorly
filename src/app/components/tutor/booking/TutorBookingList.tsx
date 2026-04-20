import React, { useEffect, useState } from "react";
import { Check, X, Clock, Calendar, MessageCircle } from "lucide-react";

const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

const getToken = () => {
  return document.cookie.match(/token=([^;]+)/)?.[1];
};

interface Booking {
  bookingId: number;
  userId: number;
  classId: number;
  classTitle: string;
  scheduleId: number;
  day: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  note: string;
  telegram: string;
  createdAt: string;
}

const TutorBookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/bookings/tutor`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: "CONFIRMED" | "REJECTED") => {
    try {
      await fetch(`${API_BASE}/bookings/${status.toLowerCase()}/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      fetchBookings();
    } catch (err) {
      alert("Failed to update booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-2 text-gray-500">
        <Clock className="animate-spin" />
        Loading bookings...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Tutor Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b.bookingId}
            className="border rounded-xl p-4 shadow-sm flex justify-between"
          >
            {/* LEFT INFO */}
            <div className="space-y-1">
              <h2 className="font-semibold text-lg">{b.classTitle}</h2>

              <div className="text-sm text-gray-600 space-y-1">
                <p className="flex items-center gap-2">
                  <Calendar size={14} />
                  {b.day} • {b.startTime} - {b.endTime}
                </p>

                <p>Note: {b.note}</p>

                <p className="flex items-center gap-2">
                  <MessageCircle size={14} />
                  {b.telegram}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  b.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : b.status === "CONFIRMED"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {b.status}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 items-start">
              {b.status === "PENDING" && (
                <>
                  <button
                    onClick={() => updateStatus(b.bookingId, "CONFIRMED")}
                    className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                  >
                    <Check size={16} />
                    Confirm
                  </button>

                  <button
                    onClick={() => updateStatus(b.bookingId, "REJECTED")}
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    <X size={16} />
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TutorBookingList;