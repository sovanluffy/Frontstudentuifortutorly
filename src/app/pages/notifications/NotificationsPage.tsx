import React, { useEffect, useState } from "react";
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  Notification
} from "@/app/api/notificationApi";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD ================= */
  const loadData = async () => {
    try {
      setLoading(true);

      const [list, count] = await Promise.all([
        getMyNotifications(),
        getUnreadCount(),
      ]);

      setNotifications(list || []);
      setUnread(count || 0);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= MARK ONE ================= */
  const handleMarkOne = async (id: number) => {
    await markAsRead(id);

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );

    setUnread((prev) => Math.max(prev - 1, 0));
  };

  /* ================= MARK ALL ================= */
  const handleMarkAll = async () => {
    await markAllAsRead();

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );

    setUnread(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">
          Notifications ({unread})
        </h1>

        <button
          onClick={handleMarkAll}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Mark all as read
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500">Loading...</p>
      )}

      {/* LIST */}
      <div className="space-y-4">

        {notifications.length === 0 && !loading && (
          <p className="text-gray-400">
            No notifications found
          </p>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleMarkOne(n.id)}
            className={`p-5 border rounded-xl cursor-pointer transition ${
              n.read
                ? "bg-white"
                : "bg-blue-50 border-blue-300"
            }`}
          >

            {/* TOP ROW */}
            <div className="flex justify-between">
              <span className="text-xs font-bold text-blue-600">
                {n.type}
              </span>

              <span className={`text-xs ${
                n.read ? "text-green-600" : "text-red-500"
              }`}>
                {n.read ? "READ" : "UNREAD"}
              </span>
            </div>

            {/* CONTENT */}
            <div className="mt-2 text-gray-800 font-medium">
              {n.content}
            </div>

            {/* DETAILS GRID */}
            <div className="mt-3 text-xs text-gray-500 space-y-1">

              <div>
                <b>Email:</b> {n.recipientEmail}
              </div>

              <div>
                <b>Booking ID:</b> {n.bookingId}
              </div>

              <div>
                <b>Class ID:</b> {n.classId}
              </div>

              <div>
                <b>Date:</b>{" "}
                {new Date(n.createdAt).toLocaleString()}
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}