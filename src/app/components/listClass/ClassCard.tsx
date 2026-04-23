"use client";

import React, { useState } from "react";
import {
  Star,
  MapPin,
  Users,
  Clock,
  Eye,
  CheckCircle2, // Icon for the book action
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { OpenClass } from "@/hooks/useOpenClasses";

// IMPORT THE SIDEBAR
import BookingSidebar from "@/app/components/BookingSidebar";

/* ================= HELPERS (PRESERVED) ================= */
const getSubjectStyles = (subject: string) => {
  const s = subject.toLowerCase();

  if (s.includes("math") || s.includes("science"))
    return "bg-blue-500/90 text-white";
  if (s.includes("art") || s.includes("design"))
    return "bg-rose-500/90 text-white";
  if (s.includes("language") || s.includes("english"))
    return "bg-emerald-500/90 text-white";

  return "bg-slate-700/80 text-white";
};

const formatTime = (timeStr?: string) => {
  if (!timeStr) return "TBD";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${ampm}`;
};

/* ================= COMPONENT ================= */
export function ClassListingCard({ classItem }: { classItem: OpenClass }) {
  const navigate = useNavigate();

  /* --- SIDEBAR & BOOKING STATE --- */
  const [openBooking, setOpenBooking] = useState(false);
  const [telegram, setTelegram] = useState("");
  const [note, setNote] = useState("");
  const [loadingBook, setLoadingBook] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);

  const tutor = classItem.tutor;
  const schedules = classItem.schedules || [];
  const confirmedStudents = classItem.confirmedStudents || [];
  const rating = tutor?.rating || 5;

  /* --- BOOKING HANDLER --- */
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingBook(true);
    setBookError(null);

    try {
      // Since this is a listing card, we usually book the first available slot 
      // or redirect. For this implementation, we simulate the logic:
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Request Sent!", {
        description: `Tutor ${tutor?.name} will contact you on Telegram soon.`,
      });
      setOpenBooking(false);
    } catch (err: any) {
      setBookError(err.message || "Failed to book");
      toast.error("Booking Error");
    } finally {
      setLoadingBook(false);
    }
  };

  return (
    <>
      <div
        onClick={() => navigate(`/classes/${classItem.classId}`)}
        className="
          group relative bg-white flex flex-col h-full cursor-pointer
          rounded-[1.6rem] border border-gray-200
          transition-all duration-300
          hover:-translate-y-1 hover:border-sky-400
          hover:shadow-[0_10px_20px_-0px_rgba(16,89,108,0.25)]
          overflow-hidden
        "
      >
        <Toaster position="top-center" richColors />

        {/* ================= BLUR OVERLAY (PRESERVED) ================= */}
        <div className="
          absolute inset-0 z-10
          bg-white/10
          backdrop-blur-0
          group-hover:backdrop-blur-[2px]
          transition-all duration-300
          pointer-events-none
        " />

        {/* ================= IMAGE (PRESERVED) ================= */}
        <div className="relative p-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.2rem] bg-slate-100">
            <img
              src={
                classItem.classImage ||
                `https://ui-avatars.com/api/?name=${classItem.title}`
              }
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt={classItem.title}
            />

            {/* SUBJECTS (PRESERVED) */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-20">
              {classItem.subjects?.slice(0, 2).map((sub, idx) => (
                <span
                  key={idx}
                  className={`
                    text-[9px] font-bold px-2 py-1 rounded-md
                    shadow-md backdrop-blur-sm
                    ${getSubjectStyles(sub)}
                  `}
                >
                  {sub}
                </span>
              ))}
            </div>

            {/* NEW (PRESERVED) */}
            {classItem.isNew && (
              <span className="absolute top-2 right-2 bg-green-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase z-20">
                New
              </span>
            )}

            {/* PRICE (PRESERVED) */}
            <div className="absolute bottom-2 right-2 z-20">
              <div className="bg-red-500 text-white px-2.5 py-1 rounded-lg font-bold text-xs shadow">
                ${classItem.basePrice}
              </div>
            </div>

            {/* ================= HOVER ACTION BUTTONS ================= */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 z-30 pointer-events-none">
              
              {/* EYE BUTTON (PRESERVED logic) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/classes/${classItem.classId}`);
                }}
                className="
                  translate-y-8 opacity-0
                  group-hover:translate-y-0 group-hover:opacity-100
                  transition-all duration-300 ease-out
                  bg-white text-slate-900
                  p-3 rounded-full shadow-xl
                  hover:bg-slate-50
                  pointer-events-auto
                "
              >
                <Eye size={20} />
              </button>

              {/* QUICK BOOK BUTTON (NEW) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenBooking(true);
                }}
                className="
                  translate-y-8 opacity-0
                  group-hover:translate-y-0 group-hover:opacity-100
                  transition-all duration-300 ease-out delay-75
                  bg-sky-500 text-white
                  p-3 rounded-full shadow-xl
                  hover:bg-sky-600
                  pointer-events-auto
                "
              >
                <CheckCircle2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* ================= CONTENT (PRESERVED) ================= */}
        <div className="px-4 pb-4 pt-2 flex flex-col flex-grow relative z-20">
          {/* TUTOR */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <img
                src={tutor?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                className="w-5 h-5 rounded-full"
              />
              <span className="text-[11px] font-semibold text-slate-600">
                {tutor?.name}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-700">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* TITLE */}
          <h3 className="text-[1rem] font-extrabold text-slate-900 mb-1 line-clamp-1">
            {classItem.title}
          </h3>

          <p className="text-slate-500 text-[11px] line-clamp-2 mb-2">
            {classItem.description}
          </p>

          {/* STUDENTS */}
          <div className="bg-slate-50 rounded-xl p-2 mb-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 text-slate-700">
                <Users size={12} />
                <span className="text-[10px] font-bold">
                  {classItem.currentStudents}/{classItem.maxStudents}
                </span>
              </div>
              <span className="text-[9px] text-slate-500">
                {confirmedStudents.length} confirmed
              </span>
            </div>
            <div className="flex -space-x-2">
              {confirmedStudents.slice(0, 5).map((s, i) => (
                <img
                  key={i}
                  src={s.avatar || "https://ui-avatars.com/api/?name=S"}
                  className="w-5 h-5 rounded-full border border-white"
                />
              ))}
            </div>
          </div>

          {/* SCHEDULE */}
          <div className="flex flex-wrap gap-1 mb-2">
            {schedules.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md"
              >
                <Clock size={10} className="text-sky-500" />
                <span className="text-[9px] font-semibold text-slate-700">
                  {String(s.day).slice(0, 3)} {formatTime(s.startTime)} - {formatTime(s.endTime)}
                </span>
              </div>
            ))}
          </div>

          {/* ADDRESS */}
          <div className="flex items-start gap-1 text-slate-500">
            <MapPin size={11} className="text-sky-500 mt-0.5" />
            <p className="text-[10px] font-medium leading-tight">
              {classItem.specificAddress || classItem.location}
            </p>
          </div>
        </div>
      </div>

      {/* ================= BOOKING SIDEBAR INTEGRATION ================= */}
      <BookingSidebar
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        telegram={telegram}
        setTelegram={setTelegram}
        note={note}
        setNote={setNote}
        onSubmit={handleBookingSubmit}
        loading={loadingBook}
        error={bookError}
      />
    </>
  );
}