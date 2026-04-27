"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, BookOpen, TrendingUp, Clock,
  Star, DollarSign, ChevronRight, Bell, Search, Menu, X,
  GraduationCap, Zap, Award, BarChart3,
} from "lucide-react";
import Cookies from "js-cookie";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Tutor {
  tutorId: number;
  name: string;
  avatar: string;
  rating: number;
  email: string;
  phone: string;
}

interface OpenClass {
  classId: number;
  title: string;
  description: string;
  classImage: string;
  status: string;
  tutor: Tutor;
  subjects: string[];
  basePrice: number;
  maxStudents: number;
  currentStudents: number;
}

interface Booking {
  bookingId: number;
  studentName: string;
  studentAvatar: string | null;
  classTitle: string;
  day: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const AVATAR_COLORS = [
  "from-violet-400 to-purple-500",
  "from-sky-400 to-blue-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-fuchsia-400 to-pink-500",
];
const getAvatarGradient = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_TUTOR: Tutor = {
  tutorId: 1, name: "Jenny Wilson", avatar: "",
  rating: 4.8, email: "jenny@example.com", phone: "",
};
const MOCK_CLASSES: OpenClass[] = [
  { classId: 1, title: "Graphic Design Fundamentals", description: "Core visual design principles", classImage: "", status: "ACTIVE", tutor: MOCK_TUTOR, subjects: ["Design"], basePrice: 120, maxStudents: 30, currentStudents: 24 },
  { classId: 2, title: "Motion & Animation Design", description: "Dynamic motion principles", classImage: "", status: "ACTIVE", tutor: MOCK_TUTOR, subjects: ["Design"], basePrice: 150, maxStudents: 20, currentStudents: 18 },
  { classId: 3, title: "UI/UX Design Systems", description: "User experience architecture", classImage: "", status: "ACTIVE", tutor: MOCK_TUTOR, subjects: ["Design"], basePrice: 140, maxStudents: 25, currentStudents: 20 },
  { classId: 4, title: "3D Art & Rendering", description: "Three-dimensional design workflows", classImage: "", status: "ACTIVE", tutor: MOCK_TUTOR, subjects: ["Art"], basePrice: 180, maxStudents: 15, currentStudents: 11 },
];
const MOCK_BOOKINGS: Booking[] = [
  { bookingId: 1, studentName: "Noah Miles", studentAvatar: null, classTitle: "Graphic Design Fundamentals", day: "MON", startTime: "09:00:00", endTime: "10:30:00", status: "CONFIRMED", createdAt: "" },
  { bookingId: 2, studentName: "Courtney Henry", studentAvatar: null, classTitle: "Motion & Animation Design", day: "TUE", startTime: "11:00:00", endTime: "12:30:00", status: "CONFIRMED", createdAt: "" },
  { bookingId: 3, studentName: "Kathryn Murphy", studentAvatar: null, classTitle: "UI/UX Design Systems", day: "WED", startTime: "14:00:00", endTime: "15:30:00", status: "PENDING", createdAt: "" },
  { bookingId: 4, studentName: "Jerrod Steward", studentAvatar: null, classTitle: "3D Art & Rendering", day: "THU", startTime: "10:00:00", endTime: "11:30:00", status: "CONFIRMED", createdAt: "" },
  { bookingId: 5, studentName: "Lily Mae", studentAvatar: null, classTitle: "Graphic Design Fundamentals", day: "FRI", startTime: "13:00:00", endTime: "14:30:00", status: "PENDING", createdAt: "" },
];

// ─── CLASS COLOR THEMES ───────────────────────────────────────────────────────

const CLASS_THEMES = [
  { card: "from-violet-500 to-purple-600", badge: "bg-violet-100 text-violet-700", dot: "bg-violet-500" },
  { card: "from-sky-500 to-blue-600",      badge: "bg-sky-100 text-sky-700",       dot: "bg-sky-500"    },
  { card: "from-amber-500 to-orange-600",  badge: "bg-amber-100 text-amber-700",   dot: "bg-amber-500"  },
  { card: "from-emerald-500 to-teal-600",  badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
];

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────

const STATUS_MAP = {
  CONFIRMED: { label: "Confirmed", bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  PENDING:   { label: "Pending",   bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-400"  },
  CANCELLED: { label: "Cancelled", bg: "bg-red-100",     text: "text-red-600",     dot: "bg-red-500"    },
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function TutorDashboard() {
  const [classes, setClasses]   = useState<OpenClass[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const API_BASE =
    typeof import.meta !== "undefined"
      ? (import.meta as any).env?.VITE_API_BASE ?? ""
      : "";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!API_BASE) throw new Error("No API base");
        const token = Cookies.get("token");
        if (!token) throw new Error("No token");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const tutorId = payload.tutorId || payload.userId;
        if (!tutorId) throw new Error("No tutor ID");
        const h = { accept: "*/*", Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
        const [cr, br] = await Promise.all([
          fetch(`${API_BASE}/open-classes/tutor/${tutorId}`, { headers: h }),
          fetch(`${API_BASE}/bookings/tutor/me`, { headers: h }),
        ]);
        if (!cr.ok || !br.ok) throw new Error("API error");
        setClasses(await cr.json());
        setBookings(await br.json());
      } catch {
        setClasses(MOCK_CLASSES);
        setBookings(MOCK_BOOKINGS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cls = classes.length ? classes : MOCK_CLASSES;
  const bks = bookings.length ? bookings : MOCK_BOOKINGS;

  const tutorName    = cls[0]?.tutor?.name    || "Jenny Wilson";
  const tutorRating  = cls[0]?.tutor?.rating?.toFixed(1) || "4.8";
  const totalStudents = cls.reduce((s, c) => s + (c.currentStudents || 0), 0);
  const totalEarnings = cls.reduce((s, c) => s + c.basePrice * (c.currentStudents || 0), 0);
  const avgOccupancy  = Math.round(
    (totalStudents / cls.reduce((s, c) => s + c.maxStudents, 0)) * 100
  );

  // ── Loading ──
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-500">Loading your dashboard…</p>
      </div>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
        <p className="font-bold text-slate-800 mb-1">Something went wrong</p>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl py-2.5 text-sm font-bold hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // ── Dashboard ──
  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ fontFamily: "'DM Sans', 'Nunito', system-ui, sans-serif" }}
    >
      {/* ══ TOP BAR ═══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 h-14 flex items-center gap-3 shadow-sm">
        {/* Mobile menu toggle */}
        <button
          className="sm:hidden w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>

        <div className="flex-1">
          <h1 className="text-sm font-black text-slate-900 tracking-tight">Tutor Dashboard</h1>
          <p className="text-[10px] text-slate-400 hidden sm:block">Welcome back, {tutorName} 👋</p>
        </div>

        {/* Search — hidden on very small */}
        <div className="hidden md:flex relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search classes…"
            className="w-48 pl-8 pr-3 py-1.5 text-xs bg-slate-100 border-0 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        {/* Bell */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
          <Bell size={14} className="text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarGradient(tutorName)} flex items-center justify-center text-white text-[10px] font-black shadow-sm`}>
          {getInitials(tutorName)}
        </div>
      </header>

      {/* ══ MAIN CONTENT ══════════════════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── HERO SECTION ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 sm:p-8 text-white shadow-2xl shadow-blue-500/30">
          {/* Decorative shapes */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8  w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-4 right-32 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Left text */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
                <Zap size={12} className="text-yellow-300" />
                <span className="text-xs font-semibold text-white/90">Pro Tutor Account</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
                Hello, {tutorName.split(" ")[0]}! 👋
              </h2>
              <p className="text-blue-200 text-sm max-w-xs leading-relaxed">
                You have <strong className="text-white">{bks.filter(b => b.status === "PENDING").length}</strong> pending requests
                and <strong className="text-white">{cls.length}</strong> active classes.
              </p>

              {/* Rating pills */}
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Star size={12} className="text-yellow-300 fill-yellow-300" />
                  <span className="text-xs font-bold">{tutorRating} Rating</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Award size={12} className="text-emerald-300" />
                  <span className="text-xs font-bold">{avgOccupancy}% Occupancy</span>
                </div>
              </div>
            </div>

            {/* Right: Total earnings card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 flex-shrink-0 text-center sm:min-w-[160px]">
              <DollarSign size={20} className="text-emerald-300 mx-auto mb-1" />
              <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider mb-0.5">Total Earned</p>
              <p className="text-3xl font-black text-white">${totalEarnings.toLocaleString()}</p>
              <p className="text-white/50 text-[10px] mt-1">{totalStudents} enrolled students</p>
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              icon: <BookOpen size={20} />,
              label: "Active Classes",
              value: cls.length,
              sub: "Currently teaching",
              gradient: "from-blue-500 to-indigo-600",
              bg: "bg-blue-50",
              text: "text-blue-600",
            },
            {
              icon: <Users size={20} />,
              label: "Total Students",
              value: totalStudents,
              sub: "Across all classes",
              gradient: "from-violet-500 to-purple-600",
              bg: "bg-violet-50",
              text: "text-violet-600",
            },
            {
              icon: <BarChart3 size={20} />,
              label: "Occupancy",
              value: `${avgOccupancy}%`,
              sub: "Avg. fill rate",
              gradient: "from-emerald-500 to-teal-600",
              bg: "bg-emerald-50",
              text: "text-emerald-600",
            },
            {
              icon: <GraduationCap size={20} />,
              label: "Rating",
              value: tutorRating,
              sub: "Student reviews",
              gradient: "from-amber-500 to-orange-500",
              bg: "bg-amber-50",
              text: "text-amber-600",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
            >
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-sm mb-3`}>
                {card.icon}
              </div>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wide">{card.label}</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 leading-tight">{card.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── BOTTOM GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* ── RECENT BOOKINGS ── */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Clock size={16} className="text-amber-600" />
                </div>
                <h2 className="font-bold text-slate-800 text-sm">Recent Requests</h2>
              </div>
              <button className="flex items-center gap-0.5 text-[11px] text-blue-500 font-semibold hover:text-blue-700 transition-colors">
                View all <ChevronRight size={12} />
              </button>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-50">
              {bks.slice(0, 5).map((b) => {
                const status = STATUS_MAP[b.status];
                const grad   = getAvatarGradient(b.studentName);
                return (
                  <div
                    key={b.bookingId}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-[11px] font-black flex-shrink-0 shadow-sm`}>
                      {getInitials(b.studentName)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{b.studentName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{b.classTitle}</p>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {b.day} · {b.startTime.slice(0, 5)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── MY CLASSES ── */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                  <BookOpen size={16} className="text-blue-600" />
                </div>
                <h2 className="font-bold text-slate-800 text-sm">My Active Classes</h2>
              </div>
              <button className="flex items-center gap-0.5 text-[11px] text-blue-500 font-semibold hover:text-blue-700 transition-colors">
                View all <ChevronRight size={12} />
              </button>
            </div>

            {/* Class list */}
            <div className="p-4 space-y-3">
              {cls.map((c, i) => {
                const theme = CLASS_THEMES[i % CLASS_THEMES.length];
                const pct   = Math.round((c.currentStudents / c.maxStudents) * 100);
                return (
                  <div
                    key={c.classId}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition-all cursor-pointer group"
                  >
                    {/* Color icon */}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${theme.card} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                      <GraduationCap size={20} className="text-white" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{c.title}</p>

                      {/* Progress bar */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${theme.card} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 flex-shrink-0">
                          {c.currentStudents}/{c.maxStudents}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-sm font-black text-slate-900">${c.basePrice}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badge}`}>
                        {pct}% full
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── FOOTER PADDING ── */}
        <div className="h-4" />
      </main>
    </div>
  );
}