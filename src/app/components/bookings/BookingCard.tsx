import React from "react";
import { Calendar, Clock, MessageSquare } from "lucide-react";
import { Booking } from "@/types/booking";

export default function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-3">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <img
            src={booking.studentAvatar}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <h2 className="font-bold">{booking.classTitle}</h2>
            <p className="text-xs text-gray-500">
              {booking.studentName}
            </p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-600">
          {booking.status}
        </span>
      </div>

      {/* TIME */}
      <div className="text-sm text-gray-600 space-y-1">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          {booking.day}
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} />
          {booking.startTime} - {booking.endTime}
        </div>
      </div>

      {/* NOTE */}
      {booking.note && (
        <div className="text-sm bg-gray-50 p-3 rounded-lg">
          {booking.note}
        </div>
      )}

      {/* CONTACT */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{booking.studentPhone}</span>

        {booking.telegram && (
          <div className="flex items-center gap-1">
            <MessageSquare size={14} />
            {booking.telegram}
          </div>
        )}
      </div>
    </div>
  );
}