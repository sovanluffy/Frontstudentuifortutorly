"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen, Users, Clock, Star, DollarSign,
  ChevronRight, GraduationCap, BarChart3,
  TrendingUp, CheckCircle2, AlertCircle, XCircle,
  MapPin, Calendar, X,
} from "lucide-react";
import Cookies from "js-cookie";
import { useLanguage } from "@/context/LanguageContext";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface ConfirmedStudent {
  studentId: number;
  studentName: string;
  avatar: string | null;
  email: string;
  bookedSchedule: {
    day: string;
    startTime: string;
    endTime: string;
  };
}

interface Schedule {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  maxStudents: number | null;
  bookedCount: number;
}

interface Tutor {
  tutorId: number;
  name: string;
  avatar: string | null;
  rating: number;
  email: string;
  phone: string;
}

interface OpenClass {
  classId: number;
  title: string;
  description: string;
  classImage: string | null;
  status: string;
  tutor: Tutor;
  location: string | null;
  specificAddress: string | null;
  subjects: string[];
  basePrice: number;
  maxStudents: number;
  currentStudents: number;
  confirmedStudents: ConfirmedStudent[];
  schedules: Schedule[];
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const AVATAR_SHADES = [
  { bg: "bg-blue-600",   text: "text-white" },
  { bg: "bg-blue-400",   text: "text-white" },
  { bg: "bg-blue-800",   text: "text-white" },
  { bg: "bg-blue-500",   text: "text-white" },
  { bg: "bg-indigo-600", text: "text-white" },
];
const getAvatarShade = (name: string) =>
  AVATAR_SHADES[(name.charCodeAt(0) || 0) % AVATAR_SHADES.length];

// ─── AVATAR ───────────────────────────────────────────────────────────────────

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: string;
  textSize?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src, name, size = "w-10 h-10", textSize = "text-[11px]",
}) => {
  const [imgError, setImgError] = useState(false);
  const shade = getAvatarShade(name);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        className={`${size} rounded-full object-cover flex-shrink-0 shadow-sm ring-2 ring-blue-100`}
      />
    );
  }

  return (
    <div className={`${size} rounded-full ${shade.bg} ${shade.text} ${textSize} font-black flex items-center justify-center flex-shrink-0 shadow-sm`}>
      {getInitials(name)}
    </div>
  );
};

// ─── CLASS IMAGE ──────────────────────────────────────────────────────────────

interface ClassImageProps {
  src?: string | null;
  title: string;
  className?: string;
}

const ClassImage: React.FC<ClassImageProps> = ({ src, title, className = "" }) => {
  const [imgError, setImgError] = useState(false);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={title}
        onError={() => setImgError(true)}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`bg-blue-100 flex items-center justify-center ${className}`}>
      <GraduationCap size={22} className="text-blue-400" />
    </div>
  );
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_TUTOR: Tutor = {
  tutorId: 1, name: "Visal Sk",
  avatar: "https://res.cloudinary.com/djdfm5rrk/image/upload/v1776653927/user_avatars/zdq7xnoiikqhozudkcck.jpg",
  rating: 3.67, email: "visal12@gmail.com", phone: "012345678",
};

const MOCK_CLASSES: OpenClass[] = [
  {
    classId: 25, title: "Mathematics Tutoring Class",
    description: "Learn algebra, geometry, and exam preparation.",
    classImage: "https://res.cloudinary.com/djdfm5rrk/image/upload/v1776654413/user_avatars/tkrfbomdzm0ixlnhxjvx.jpg",
    status: "OPEN", tutor: MOCK_TUTOR,
    location: "Daun Penh, Phnom Penh", specificAddress: "Street 271, Phnom Penh",
    subjects: ["Mathematics", "Physics"], basePrice: 15.5, maxStudents: 10, currentStudents: 1,
    confirmedStudents: [
      { studentId: 44, studentName: "ya", avatar: null, email: "ya@gmail.com", bookedSchedule: { day: "MONDAY", startTime: "09:00:00", endTime: "11:00:00" } },
    ],
    schedules: [
      { id: 8, day: "MONDAY",    startTime: "09:00:00", endTime: "11:00:00", maxStudents: null, bookedCount: 0 },
      { id: 9, day: "WEDNESDAY", startTime: "14:00:00", endTime: "16:00:00", maxStudents: null, bookedCount: 0 },
    ],
  },
  {
    classId: 26, title: "Math Basic",
    description: "Learn basic math",
    classImage: "https://res.cloudinary.com/djdfm5rrk/image/upload/v1776664620/user_avatars/bqpzjalcmesoh1hdqnfv.jpg",
    status: "OPEN", tutor: MOCK_TUTOR,
    location: "Chamkarmon, Phnom Penh", specificAddress: "Street 123, Phnom Penh",
    subjects: ["Mathematics"], basePrice: 10, maxStudents: 30, currentStudents: 6,
    confirmedStudents: [
      { studentId: 42, studentName: "Visal Sk", avatar: "https://res.cloudinary.com/djdfm5rrk/image/upload/v1776653927/user_avatars/zdq7xnoiikqhozudkcck.jpg", email: "visal12@gmail.com", bookedSchedule: { day: "MONDAY", startTime: "09:00:00", endTime: "11:00:00" } },
      { studentId: 47, studentName: "mary", avatar: "https://res.cloudinary.com/djdfm5rrk/image/upload/v1776751632/user_avatars/xzxxzzelpwkyoo9ajcow.jpg", email: "mary@gmail.com", bookedSchedule: { day: "WEDNESDAY", startTime: "14:00:00", endTime: "16:00:00" } },
    ],
    schedules: [
      { id: 10, day: "MONDAY",    startTime: "09:00:00", endTime: "11:00:00", maxStudents: null, bookedCount: 0 },
      { id: 11, day: "WEDNESDAY", startTime: "14:00:00", endTime: "16:00:00", maxStudents: null, bookedCount: 0 },
    ],
  },
];

// ─── CLASS ACCENTS ────────────────────────────────────────────────────────────

const CLASS_ACCENTS = [
  { bar: "bg-blue-600",   label: "bg-blue-50 text-blue-700"     },
  { bar: "bg-blue-400",   label: "bg-blue-50 text-blue-500"     },
  { bar: "bg-indigo-600", label: "bg-indigo-50 text-indigo-700" },
  { bar: "bg-blue-800",   label: "bg-blue-50 text-blue-900"     },
];

// ─── RING PROGRESS ────────────────────────────────────────────────────────────

const RingProgress: React.FC<{ pct: number; size?: number; stroke?: number }> = ({
  pct, size = 40, stroke = 4,
}) => {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#dbeafe" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke="#2563eb" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
      />
    </svg>
  );
};

// ─── FORMAT HELPERS ───────────────────────────────────────────────────────────

const DAY_SHORT: Record<string, string> = {
  MONDAY: "MON", TUESDAY: "TUE", WEDNESDAY: "WED",
  THURSDAY: "THU", FRIDAY: "FRI", SATURDAY: "SAT", SUNDAY: "SUN",
};

const fmt = (t: string) => t.slice(0, 5);

// ─── MODAL ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-white font-bold text-base">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
        {/* Modal body */}
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

export default function TutorDashboard() {
  const { t } = useLanguage();

  const [classes,  setClasses]  = useState<OpenClass[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  // Modal state: null | "classes" | "students"
  const [modal, setModal] = useState<"classes" | "students" | null>(null);

  const API_BASE =
    typeof import.meta !== "undefined"
      ? (import.meta as any).env?.VITE_API_BASE ?? ""
      : "";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true); setError(null);
        if (!API_BASE) throw new Error("no api");
        const token = Cookies.get("token");
        if (!token) throw new Error("no token");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const tutorId = payload.tutorId || payload.userId;
        if (!tutorId) throw new Error("no id");
        const h = { accept: "*/*", Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
        const cr = await fetch(`${API_BASE}/open-classes/tutor/${tutorId}`, { headers: h });
        if (!cr.ok) throw new Error("api error");
        setClasses(await cr.json());
      } catch {
        setClasses(MOCK_CLASSES);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cls = classes.length ? classes : MOCK_CLASSES;

  // Deduplicated confirmed students across all classes
  const allStudents: Array<ConfirmedStudent & { classTitle: string; classId: number }> = [];
  cls.forEach((c) => {
    const seen = new Set<string>();
    c.confirmedStudents.forEach((s) => {
      const key = `${s.studentId}-${s.bookedSchedule.day}`;
      if (!seen.has(key)) {
        seen.add(key);
        allStudents.push({ ...s, classTitle: c.title, classId: c.classId });
      }
    });
  });

  const tutorName     = cls[0]?.tutor?.name || "Tutor";
  const tutorAvatar   = cls[0]?.tutor?.avatar || null;
  const tutorRating   = cls[0]?.tutor?.rating ? cls[0].tutor.rating.toFixed(1) : "—";
  const totalStudents = cls.reduce((s, c) => s + (c.currentStudents || 0), 0);
  const totalEarnings = cls.reduce((s, c) => s + c.basePrice * (c.currentStudents || 0), 0);
  const totalMax      = cls.reduce((s, c) => s + c.maxStudents, 0);
  const avgOccupancy  = totalMax ? Math.round((totalStudents / totalMax) * 100) : 0;
  const confirmedPct  = allStudents.length
    ? Math.round((allStudents.length / Math.max(totalStudents, 1)) * 100)
    : 0;

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin" />
      </div>
      <p className="text-sm font-semibold text-blue-400 tracking-wide">
        {t("កំពុងផ្ទុក...", "Loading dashboard…")}
      </p>
    </div>
  );

  // ── ERROR ─────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="bg-white rounded-3xl border border-blue-100 shadow-xl p-10 max-w-sm w-full text-center">
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle size={28} className="text-blue-400" />
        </div>
        <p className="font-black text-slate-800 mb-1">{t("មានបញ្ហាកើតឡើង", "Something went wrong")}</p>
        <p className="text-slate-400 text-sm mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-2.5 text-sm font-bold transition-colors"
        >
          {t("ព្យាយាមម្ដងទៀត", "Retry")}
        </button>
      </div>
    </div>
  );

  // ── DASHBOARD ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── STATS STRIP (top) ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Classes — clickable → opens classes modal */}
          <button
            onClick={() => setModal("classes")}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm shadow-blue-600/20 transition-all duration-150 text-left"
          >
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
              <BookOpen size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-wide leading-none">{t("ថ្នាក់", "Classes")}</p>
              <p className="text-white font-black text-lg leading-tight">{cls.length}</p>
            </div>
            <ChevronRight size={14} className="text-white/60 ml-auto flex-shrink-0" />
          </button>

          {/* Students — clickable → opens students modal */}
          <button
            onClick={() => setModal("students")}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm shadow-blue-600/20 transition-all duration-150 text-left"
          >
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
              <Users size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-wide leading-none">{t("សិស្ស", "Students")}</p>
              <p className="text-white font-black text-lg leading-tight truncate">{totalStudents}</p>
            </div>
            <ChevronRight size={14} className="text-white/60 ml-auto flex-shrink-0" />
          </button>

          {/* Rating — not clickable */}
          <div className="bg-blue-600 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm shadow-blue-600/20">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
              <Star size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-wide leading-none">{t("ពិន្ទុ", "Rating")}</p>
              <p className="text-white font-black text-lg leading-tight">{tutorRating}</p>
            </div>
          </div>

          {/* Earned — not clickable */}
          <div className="bg-blue-600 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm shadow-blue-600/20">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
              <DollarSign size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-wide leading-none">{t("ប្រាក់ចំណូល", "Earned")}</p>
              <p className="text-white font-black text-lg leading-tight truncate">${totalEarnings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* ── HERO BANNER ──────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-blue-600 px-6 sm:px-8 py-7 flex flex-col sm:flex-row sm:items-center gap-5 shadow-xl shadow-blue-600/25">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-0   right-40  w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-4     right-24  w-16 h-16 rounded-full bg-white/10 pointer-events-none" />

          <div className="flex-1 relative z-10 flex items-start gap-4">
            <div className="flex-shrink-0 ring-4 ring-white/30 rounded-full">
              <Avatar src={tutorAvatar} name={tutorName} size="w-14 h-14" textSize="text-base" />
            </div>
            <div>
              <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-widest mb-0.5">
                {t("ផ្ទាំងព័ត៌មាន", "Dashboard")}
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {t(`សួស្ដី, ${tutorName.split(" ")[0]}! 👋`, `Hello, ${tutorName.split(" ")[0]}! 👋`)}
              </h1>
              <p className="text-blue-200 text-sm mt-1.5 max-w-sm leading-relaxed">
                {t(
                  `មានសិស្ស ${allStudents.length} នាក់ និង ${cls.length} ថ្នាក់កំពុងសកម្ម`,
                  `${allStudents.length} confirmed students across ${cls.length} active classes.`
                )}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5">
                  <Star size={12} className="text-white fill-white" />
                  <span className="text-white text-xs font-bold">{tutorRating} {t("ពិន្ទុ", "Rating")}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5">
                  <BarChart3 size={12} className="text-white" />
                  <span className="text-white text-xs font-bold">{avgOccupancy}% {t("ការបំពេញ", "Occupancy")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings */}
          <div className="relative z-10 bg-white/10 border border-white/20 rounded-2xl px-6 py-5 text-center flex-shrink-0 sm:min-w-[160px]">
            <DollarSign size={22} className="text-white mx-auto mb-1 opacity-70" />
            <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-widest mb-0.5">
              {t("ប្រាក់ចំណូលសរុប", "Total Earnings")}
            </p>
            <p className="text-3xl font-black text-white">${totalEarnings.toLocaleString()}</p>
            <p className="text-blue-200 text-[10px] mt-1">{totalStudents} {t("សិស្ស", "students")}</p>
          </div>
        </div>

        {/* ── STAT CARDS ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { Icon: BookOpen,   label: t("ថ្នាក់សកម្ម",     "Active Classes"),  value: cls.length,        sub: t("កំពុងបង្រៀន",           "Currently teaching"), pct: 100          },
            { Icon: Users,      label: t("សិស្សសរុប",       "Total Students"),  value: totalStudents,      sub: t("នៅក្នុងថ្នាក់ទាំងអស់", "Across all classes"), pct: avgOccupancy },
            { Icon: TrendingUp, label: t("អត្រាបញ្ជាក់",    "Confirmed"),       value: allStudents.length, sub: t("សិស្សបានបញ្ជាក់",       "Confirmed students"), pct: confirmedPct },
            { Icon: BarChart3,  label: t("ភាគរយការចូលរៀន", "Occupancy"),       value: `${avgOccupancy}%`, sub: t("អត្រាបំពេញ",             "Avg. fill rate"),     pct: avgOccupancy },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white border border-blue-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-600/30">
                  <card.Icon size={18} className="text-white" />
                </div>
                <RingProgress pct={card.pct} size={40} stroke={4} />
              </div>
              <p className="text-[10px] sm:text-xs font-semibold text-blue-400 uppercase tracking-wide">{card.label}</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 leading-tight">{card.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── BOTTOM GRID ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* ─ CONFIRMED STUDENTS ─ */}
          <div className="bg-white border border-blue-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-blue-600 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Clock size={15} className="text-white" />
                </div>
                <h2 className="font-bold text-white text-sm">
                  {t("សិស្សបានបញ្ជាក់", "Confirmed Students")}
                </h2>
              </div>
              <span className="text-blue-100 text-[11px] font-semibold">
                {allStudents.length} {t("នាក់", "total")}
              </span>
            </div>

            <div className="divide-y divide-blue-50">
              {allStudents.length === 0 ? (
                <div className="py-12 text-center text-blue-300 text-sm">
                  {t("មិនមានសិស្សទេ", "No confirmed students yet")}
                </div>
              ) : (
                allStudents.slice(0, 6).map((s, idx) => (
                  <div
                    key={`${s.studentId}-${idx}`}
                    className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-blue-50/40 transition-colors cursor-pointer"
                  >
                    <Avatar src={s.avatar} name={s.studentName} size="w-10 h-10" textSize="text-[11px]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{s.studentName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{s.classTitle}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {DAY_SHORT[s.bookedSchedule.day] || s.bookedSchedule.day}
                      </span>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {fmt(s.bookedSchedule.startTime)}–{fmt(s.bookedSchedule.endTime)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-5 py-3 border-t border-blue-50 bg-blue-50/30 text-center">
              <p className="text-[11px] text-blue-400 font-medium">
                {t(
                  `បង្ហាញ ${Math.min(6, allStudents.length)} នៃ ${allStudents.length} នាក់`,
                  `Showing ${Math.min(6, allStudents.length)} of ${allStudents.length} students`
                )}
              </p>
            </div>
          </div>

          {/* ─ ACTIVE CLASSES ─ */}
          <div className="bg-white border border-blue-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-blue-600 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <BookOpen size={15} className="text-white" />
                </div>
                <h2 className="font-bold text-white text-sm">
                  {t("ថ្នាក់រៀនសកម្ម", "Active Classes")}
                </h2>
              </div>
              <span className="text-blue-100 text-[11px] font-semibold">
                {cls.length} {t("ថ្នាក់", "classes")}
              </span>
            </div>

            <div className="p-4 space-y-3">
              {cls.map((c, i) => {
                const acc = CLASS_ACCENTS[i % CLASS_ACCENTS.length];
                const pct = c.maxStudents ? Math.round((c.currentStudents / c.maxStudents) * 100) : 0;
                const uniqueStudents = c.confirmedStudents
                  .filter((s, idx, arr) => arr.findIndex(x => x.studentId === s.studentId) === idx)
                  .slice(0, 3);

                return (
                  <div
                    key={c.classId}
                    className="rounded-2xl border border-blue-100 hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer group overflow-hidden"
                  >
                    <div className="flex items-stretch gap-0">
                      <div className="flex-shrink-0 w-20">
                        <ClassImage
                          src={c.classImage}
                          title={c.title}
                          className="w-20 h-full min-h-[80px] rounded-l-2xl"
                        />
                      </div>
                      <div className="flex-1 min-w-0 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate leading-tight">{c.title}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {c.subjects.map((sub) => (
                                <span key={sub} className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                  {sub}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-sm font-black text-blue-600 flex-shrink-0">${c.basePrice}</span>
                        </div>
                        {c.location && (
                          <div className="flex items-center gap-1 mt-1.5">
                            <MapPin size={9} className="text-slate-400 flex-shrink-0" />
                            <p className="text-[10px] text-slate-400 truncate">{c.location}</p>
                          </div>
                        )}
                        {c.schedules.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {c.schedules.map((sch) => (
                              <span key={sch.id} className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                                <Calendar size={8} />
                                {DAY_SHORT[sch.day] || sch.day} {fmt(sch.startTime)}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex -space-x-1.5 flex-shrink-0">
                            {uniqueStudents.map((s) => (
                              <div key={s.studentId} className="ring-2 ring-white rounded-full">
                                <Avatar src={s.avatar} name={s.studentName} size="w-5 h-5" textSize="text-[7px]" />
                              </div>
                            ))}
                            {c.currentStudents > 3 && (
                              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[7px] font-black flex items-center justify-center ring-2 ring-white">
                                +{c.currentStudents - 3}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${acc.bar} rounded-full transition-all duration-700`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${acc.label}`}>
                            {c.currentStudents}/{c.maxStudents}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-3 border-t border-blue-50 bg-blue-50/30 text-center">
              <p className="text-[11px] text-blue-400 font-medium">
                {t(
                  `${cls.length} ថ្នាក់ · សិស្សសរុប ${totalStudents} នាក់`,
                  `${cls.length} classes · ${totalStudents} total students enrolled`
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="h-2" />
      </div>

      {/* ── MODAL: ALL CLASSES ─────────────────────────────────────────────── */}
      <Modal
        open={modal === "classes"}
        onClose={() => setModal(null)}
        title={t(`ថ្នាក់រៀនទាំងអស់ (${cls.length})`, `All Classes (${cls.length})`)}
      >
        <div className="divide-y divide-blue-50">
          {cls.map((c) => {
            const pct = c.maxStudents ? Math.round((c.currentStudents / c.maxStudents) * 100) : 0;
            return (
              <div key={c.classId} className="flex gap-4 p-5">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden">
                  <ClassImage src={c.classImage} title={c.title} className="w-16 h-16 rounded-xl" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-slate-800 leading-tight">{c.title}</p>
                    <span className="text-sm font-black text-blue-600 flex-shrink-0">${c.basePrice}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{c.description}</p>

                  {/* Subjects */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.subjects.map((sub) => (
                      <span key={sub} className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                        {sub}
                      </span>
                    ))}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      c.status === "OPEN"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  {/* Location */}
                  {c.location && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <MapPin size={9} className="text-slate-400 flex-shrink-0" />
                      <p className="text-[10px] text-slate-400">{c.location}</p>
                    </div>
                  )}
                  {c.specificAddress && (
                    <p className="text-[10px] text-slate-400 ml-3.5">{c.specificAddress}</p>
                  )}

                  {/* Schedules */}
                  {c.schedules.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {c.schedules.map((sch) => (
                        <span key={sch.id} className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                          <Calendar size={8} />
                          {DAY_SHORT[sch.day] || sch.day} {fmt(sch.startTime)}–{fmt(sch.endTime)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Occupancy bar */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 flex-shrink-0">
                      {c.currentStudents}/{c.maxStudents} {t("សិស្ស", "students")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      {/* ── MODAL: ALL STUDENTS ────────────────────────────────────────────── */}
      <Modal
        open={modal === "students"}
        onClose={() => setModal(null)}
        title={t(`សិស្សទាំងអស់ (${allStudents.length})`, `All Students (${allStudents.length})`)}
      >
        <div className="divide-y divide-blue-50">
          {allStudents.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              {t("មិនមានសិស្សទេ", "No students yet")}
            </div>
          ) : (
            allStudents.map((s, idx) => (
              <div
                key={`${s.studentId}-${idx}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-blue-50/40 transition-colors"
              >
                <Avatar src={s.avatar} name={s.studentName} size="w-11 h-11" textSize="text-xs" />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">{s.studentName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{s.email}</p>
                  <p className="text-[11px] text-blue-500 font-medium truncate">{s.classTitle}</p>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {DAY_SHORT[s.bookedSchedule.day] || s.bookedSchedule.day}
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {fmt(s.bookedSchedule.startTime)}–{fmt(s.bookedSchedule.endTime)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}