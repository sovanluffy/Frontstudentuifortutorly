import React, { useEffect, useState } from "react";
import {
  getTutorBookings,
  confirmBooking,
  rejectBooking,
} from "@/app/api/bookingApi";
import { useAuth } from "@/context/AuthContext";

interface Booking {
  bookingId: number;
  status: string;
  note?: string;
  telegram?: string;
  day?: string;
  startTime?: string;
  endTime?: string;
}

const TutorBookingPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBookings = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;

      const data = await getTutorBookings(user.id);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user?.id]);

  const handleConfirm = async (id: number) => {
    await confirmBooking(id);
    loadBookings();
  };

  const handleReject = async (id: number) => {
    await rejectBooking(id);
    loadBookings();
  };

  if (loading) {
    return <div className="p-6">Loading bookings...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Tutor Bookings</h1>

      {bookings.length === 0 && (
        <p className="text-gray-500">No bookings found</p>
      )}

      <div className="space-y-3">
        {bookings.map((b) => (
          <div
            key={b.bookingId}
            className="border p-4 rounded-xl flex justify-between items-center"
          >
            {/* LEFT */}
            <div>
              <p className="font-bold">Booking #{b.bookingId}</p>
              <p className="text-sm text-gray-500">
                Status: {b.status}
              </p>
              <p className="text-sm">{b.note}</p>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex gap-2">
              {b.status === "PENDING" && (
                <>
                  <button
                    onClick={() => handleConfirm(b.bookingId)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => handleReject(b.bookingId)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </>
              )}

              {b.status !== "PENDING" && (
                <span className="text-sm text-gray-500">
                  {b.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorBookingPage;