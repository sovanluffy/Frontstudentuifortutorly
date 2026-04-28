"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Clock,
  MessageSquare,
  Phone,
  AlertCircle,
  BookOpen,
  Calendar,
  Send,
  User,
  GraduationCap,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE;

interface Booking {
  bookingId: number;
  classId: number;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentAvatar: string;
  classTitle: string;
  day: string;
  startTime: string | null;
  endTime: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  note?: string;
  telegram?: string;
}

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const getToken = () => document.cookie.match(/token=([^;]+)/)?.[1] || "";

export default function StudentMyClassesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings]     = useState<Booking[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState("");

  const fetchBookings = async (silent = false) => {
    try {
      silent ? setRefreshing(true) : setLoading(true);
      setError("");
      const token = getToken();
      if (!token) throw new Error("Please login to view your classes.");
      const res = await fetch(`${API_BASE}/bookings/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load your classes");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Something went wrong while loading classes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [user]);

  const confirmedClasses = bookings
    .filter((b) => b.status === "CONFIRMED")
    .sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#F4F7FE] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-[#4318FF]" size={36} />
          <p className="mt-3 text-slate-400 text-sm font-medium">Loading your classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-[#F4F7FE] overflow-hidden">

      {/* ===== STICKY HEADER ===== */}
      <div className="shrink-0 w-full bg-[#F4F7FE]/95 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#4318FF] flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
              <GraduationCap className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#1B2559]">My Classes</h1>
              <p className="text-slate-400 text-[11px] font-medium">
                {confirmedClasses.length > 0
                  ? `${confirmedClasses.length} confirmed class${confirmedClasses.length !== 1 ? "es" : ""}`
                  : "Your confirmed classes appear here"}
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchBookings(true)}
            disabled={refreshing}
            className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#4318FF] hover:border-indigo-200 transition-all"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ===== SCROLLABLE CARDS — FULL WIDTH ===== */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-5 pb-24">

          {/* Error */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex gap-3 items-start">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Empty */}
          {confirmedClasses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 bg-white rounded-[32px] border border-slate-100 w-full">
              <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-5">
                <BookOpen size={32} className="text-slate-200" />
              </div>
              <p className="text-base font-black text-slate-300 uppercase tracking-wider">No Classes Yet</p>
              <p className="text-slate-400 text-sm mt-2 text-center max-w-xs">
                Once a tutor confirms your booking, your class will show up here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
              {confirmedClasses.map((b) => (
                <div
                  key={b.bookingId}
                  className="group bg-white rounded-[28px] border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* accent strip */}
                  <div className="h-0.5 w-full bg-gradient-to-r from-[#4318FF] to-emerald-400" />

                  <div className="p-5 flex flex-col flex-1">

                    {/* Avatar + Title — clickable */}
                    <button
                      onClick={() => navigate(`/classes/${b.classId}`)}
                      className="flex items-start gap-3 text-left w-full"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={
                            b.studentAvatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(b.studentName)}&background=4318FF&color=fff&bold=true`
                          }
                          alt={b.studentName}
                          className="rounded-2xl object-cover ring-4 ring-slate-50"
                          style={{ height: 48, width: 48 }}
                        />
                        <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-emerald-400 border-2 border-white rounded-full" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="text-sm font-black text-[#1B2559] line-clamp-2 group-hover:text-[#4318FF] transition-colors duration-200">
                            {b.classTitle}
                          </h3>
                          <ChevronRight
                            size={14}
                            className="shrink-0 text-slate-300 group-hover:text-[#4318FF] group-hover:translate-x-0.5 transition-all duration-200"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <User size={11} className="text-slate-300 shrink-0" />
                          <span className="text-xs text-slate-400 font-medium truncate">{b.studentName}</span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 mt-2 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border border-emerald-100">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Confirmed
                        </span>
                      </div>
                    </button>

                    {/* Schedule */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="flex flex-col bg-[#F4F7FE] px-3 py-2.5 rounded-xl border border-slate-100">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Day</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B2559]">
                          <Calendar size={12} className="text-indigo-400 shrink-0" />
                          <span className="truncate">{b.day}</span>
                        </div>
                      </div>
                      <div className="flex flex-col bg-[#F4F7FE] px-3 py-2.5 rounded-xl border border-slate-100">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Time</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B2559]">
                          <Clock size={12} className="text-indigo-400 shrink-0" />
                          <span className="truncate">{b.startTime?.slice(0, 5)} – {b.endTime?.slice(0, 5)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-2">
                      {b.studentPhone && (
                        <a
                          href={`tel:${b.studentPhone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:bg-[#4318FF] hover:text-white hover:border-[#4318FF] transition-all"
                        >
                          <Phone size={15} />
                        </a>
                      )}
                      {b.telegram && b.telegram !== "string" && (
                        <a
                          href={`https://t.me/${b.telegram.replace("@", "")}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="h-9 px-4 flex items-center gap-1.5 rounded-xl bg-[#4318FF] text-white text-xs font-black shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all"
                        >
                          <Send size={13} />
                          Telegram
                        </a>
                      )}
                      <button
                        onClick={() => navigate(`/classes/${b.classId}`)}
                        className="ml-auto h-9 px-4 flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-[#4318FF] text-xs font-black hover:bg-[#4318FF] hover:text-white transition-all"
                      >
                        <BookOpen size={13} />
                        View
                      </button>
                    </div>

                    {/* Note */}
                    {b.note && b.note !== "string" && (
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-start gap-2">
                        <MessageSquare size={13} className="text-indigo-200 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-400 italic leading-relaxed line-clamp-2">"{b.note}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}