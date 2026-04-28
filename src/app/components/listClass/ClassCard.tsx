// ClassListingCard.tsx
"use client";

import React, { useState } from "react";
import {
  Star,
  MapPin,
  Users,
  Clock,
  Eye,
  CheckCircle2,
  CalendarDays,
  Timer,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { OpenClass } from "@/hooks/useOpenClasses";
import BookingSidebar from "@/app/components/BookingSidebar";
import { useLanguage } from "@/context/LanguageContext";

/* ================= HELPERS ================= */
const getSubjectStyles = (subject: string) => {
  const s = subject.toLowerCase();
  if (s.includes("math") || s.includes("science")) return "bg-blue-500/90 text-white";
  if (s.includes("art") || s.includes("design")) return "bg-rose-500/90 text-white";
  if (s.includes("language") || s.includes("english")) return "bg-emerald-500/90 text-white";
  return "bg-slate-700/80 text-white";
};

const formatTime = (timeStr?: string) => {
  if (!timeStr) return "TBD";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${ampm}`;
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return null;
  }
};

const formatDuration = (value?: number | null, type?: string | null) => {
  if (!value || !type) return null;
  const label = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  return `${value} ${label}`;
};

/* ================= COMPONENT ================= */
export function ClassListingCard({ classItem }: { classItem: OpenClass }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [openBooking, setOpenBooking] = useState(false);
  const [telegram, setTelegram] = useState("");
  const [note, setNote] = useState("");
  const [loadingBook, setLoadingBook] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);

  const tutor = classItem.tutor;
  const schedules = classItem.schedules || [];
  const confirmedStudents = classItem.confirmedStudents || [];
  const rating = tutor?.rating || 5;

  const startDateLabel = formatDate(classItem.startDate);
  const durationLabel = formatDuration(classItem.durationValue, classItem.durationType);

  const pricePerPersonLabel = t(
    `$${classItem.basePrice}/១នាក់`,
    `$${classItem.basePrice}/person`
  );

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingBook(true);
    setBookError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(t("បានផ្ញើសំណើ!", "Request Sent!"), {
        description: t(
          `គ្រូ ${tutor?.name} នឹងទំនាក់ទំនងអ្នកតាម Telegram ក្នុងពេលឆាប់ៗ។`,
          `Tutor ${tutor?.name} will contact you on Telegram soon.`
        ),
      });
      setOpenBooking(false);
    } catch (err: any) {
      setBookError(err.message || t("មិនអាចធ្វើការកក់បាន", "Failed to book"));
      toast.error(t("បញ្ហាការកក់", "Booking Error"));
    } finally {
      setLoadingBook(false);
    }
  };

  /* ── Navigate to tutor profile, stop card click propagation ── */
  const handleTutorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (tutor?.tutorId) {
      navigate(`/tutor/${tutor.tutorId}`);
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
          hover:-translate-y-1
          hover:shadow-[0_12px_25px_rgba(0,0,0,0.12)]
          overflow-hidden
        "
      >
        <Toaster position="top-center" richColors />

        {/* ── IMAGE ── */}
        <div className="relative p-2">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[1.2rem] bg-slate-100">
            <img
              src={
                classItem.classImage ||
                `https://ui-avatars.com/api/?name=${classItem.title}`
              }
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt={classItem.title}
            />

            {/* SUBJECTS */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-20">
              {classItem.subjects?.slice(0, 2).map((sub, idx) => (
                <span
                  key={idx}
                  className={`text-[9px] font-bold px-2 py-1 rounded-md shadow-md ${getSubjectStyles(sub)}`}
                >
                  {sub}
                </span>
              ))}
            </div>

            {/* PRICE BADGE */}
            <div className="absolute bottom-2 right-2 z-20">
              <div className="bg-red-500 text-white px-2.5 py-1 rounded-lg shadow flex items-center gap-1">
                <span className="font-bold text-xs">{pricePerPersonLabel}</span>
                <UserRound size={10} className="opacity-80" />
              </div>
            </div>

            {/* HOVER BUTTONS */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="relative group/btn">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/classes/${classItem.classId}`);
                  }}
                  className="bg-white text-slate-900 p-3 rounded-full shadow-xl hover:bg-slate-100"
                >
                  <Eye size={18} />
                </button>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition text-[10px] bg-black text-white px-2 py-1 rounded whitespace-nowrap">
                  {t("មើលលម្អិត", "View Details")}
                </div>
              </div>

              <div className="relative group/btn">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenBooking(true);
                  }}
                  className="bg-sky-500 text-white p-3 rounded-full shadow-xl hover:bg-sky-600"
                >
                  <CheckCircle2 size={18} />
                </button>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition text-[10px] bg-black text-white px-2 py-1 rounded whitespace-nowrap">
                  {t("កក់រហ័ស", "Quick Book")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="px-3 pb-3 pt-2 flex flex-col flex-grow relative z-20">

          {/* ── Tutor + Rating (clickable → tutor profile) ── */}
          <div
            onClick={handleTutorClick}
            className="flex items-center justify-between mb-2 cursor-pointer hover:opacity-75 transition-opacity"
            title={t(`មើលប្រវត្តិរូប ${tutor?.name}`, `View ${tutor?.name}'s profile`)}
          >
            <div className="flex items-center gap-1.5">
              <img
                src={
                  tutor?.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                className="w-4 h-4 rounded-full ring-1 ring-slate-200"
                alt={tutor?.name}
              />
              <span className="text-[10px] font-semibold text-slate-600 hover:underline">
                {tutor?.name}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              <span className="text-[9px] font-bold text-amber-700">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-[0.9rem] font-extrabold text-slate-900 mb-1 line-clamp-1">
            {classItem.title}
          </h3>

          {/* Description */}
          <p className="text-slate-500 text-[10px] line-clamp-2 mb-2">
            {classItem.description}
          </p>

          {/* START DATE + DURATION */}
          {(startDateLabel || durationLabel) && (
            <div className="flex items-center gap-2 mb-2">
              {startDateLabel && (
                <div className="flex items-center gap-1 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg flex-1 min-w-0">
                  <CalendarDays size={10} className="text-blue-500 shrink-0" />
                  <span className="text-[9px] font-bold text-blue-700 truncate">
                    {startDateLabel}
                  </span>
                </div>
              )}
              {durationLabel && (
                <div className="flex items-center gap-1 bg-violet-50 border border-violet-100 px-2 py-1 rounded-lg flex-1 min-w-0">
                  <Timer size={10} className="text-violet-500 shrink-0" />
                  <span className="text-[9px] font-bold text-violet-700 truncate">
                    {durationLabel}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Students */}
          <div className="bg-slate-50 rounded-xl p-1.5 mb-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 text-slate-700">
                <Users size={11} />
                <span className="text-[9px] font-bold">
                  {classItem.currentStudents}/{classItem.maxStudents}
                </span>
              </div>
              <span className="text-[8px] text-slate-500">
                {confirmedStudents.length} {t("នាក់បានបញ្ជាក់", "confirmed")}
              </span>
            </div>
            <div className="flex -space-x-2">
              {confirmedStudents.slice(0, 5).map((s, i) => (
                <img
                  key={i}
                  src={s.avatar || "https://ui-avatars.com/api/?name=S"}
                  className="w-4 h-4 rounded-full border border-white"
                  alt=""
                />
              ))}
            </div>
          </div>

          {/* Schedules */}
          <div className="flex flex-wrap gap-1 mb-2">
            {schedules.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md"
              >
                <Clock size={10} className="text-sky-500" />
                <span className="text-[9px] font-semibold text-slate-700">
                  {String(s.day).slice(0, 3)} {formatTime(s.startTime)} -{" "}
                  {formatTime(s.endTime)}
                </span>
              </div>
            ))}
          </div>

          {/* Location */}
          <div className="flex items-start gap-1 text-slate-500">
            <MapPin size={10} className="text-sky-500 mt-0.5" />
            <p className="text-[9px] font-medium leading-tight">
              {classItem.specificAddress || classItem.location}
            </p>
          </div>
        </div>
      </div>

      {/* BOOKING SIDEBAR */}
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