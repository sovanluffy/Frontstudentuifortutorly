"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Users,
  Star,
  Loader2,
  CheckCircle2,
  Globe,
  BookOpen,
  Video,
  Calendar,
  UserCheck,
  ShieldCheck,
  Clock,
  Info
} from "lucide-react";

import { Button } from "@/app/components/figma/ui/button";
import BookingSidebar from "@/app/components/BookingSidebar";
import { Badge } from "@/app/components/figma/ui/badge";

const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

const getToken = () =>
  document.cookie.match(/token=([^;]+)/)?.[1] || "";

export default function ClassDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [openBooking, setOpenBooking] = useState(false);
  const [telegram, setTelegram] = useState("");
  const [note, setNote] = useState("");
  const [loadingBook, setLoadingBook] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [myBookings, setMyBookings] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(`${API_BASE}/open-classes/${id}`);
      setData(await res.json());
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      const token = getToken();
      if (!token) return;

      const res = await fetch(`${API_BASE}/bookings/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      setMyBookings(Array.isArray(json) ? json : []);
    })();
  }, []);

  const isAlreadyBooked = (scheduleId: number) => {
    return myBookings.some(
      (b) =>
        b.scheduleId === scheduleId &&
        (b.status === "PENDING" || b.status === "CONFIRMED")
    );
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule) {
      setError("Select schedule");
      return;
    }
    if (isAlreadyBooked(selectedSchedule)) {
      setError("Already booked. Wait for confirmation.");
      return;
    }
    try {
      setLoadingBook(true);
      setError(null);
      const token = getToken();
      const res = await fetch(`${API_BASE}/bookings/book-class/${data.classId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dayTimeSlotId: selectedSchedule,
          telegram,
          note,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setOpenBooking(false);
      setTelegram("");
      setNote("");
      const refresh = await fetch(`${API_BASE}/bookings/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyBookings(await refresh.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingBook(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-slate-400 bg-white">
        <Loader2 className="animate-spin mb-2 text-indigo-500" size={24} />
        <span className="text-[11px] font-medium tracking-widest uppercase">Loading...</span>
      </div>
    );
  }

  if (!data) return <div className="p-10 text-center text-sm font-medium">Class not found</div>;

  const students = data.confirmedStudents || [];

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-12 text-slate-900 selection:bg-indigo-100">
      
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-all">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-tight">Open</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 grid lg:grid-cols-12 gap-6 mt-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="relative group">
              <img src={data.classImage} className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
              
              {/* LEARNING MODES - TOP LEFT */}
              <div className="absolute top-4 left-4 flex gap-2">
                {data.learningModes?.map((m: string) => (
                  <span key={m} className="bg-white/90 backdrop-blur text-slate-900 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 shadow-sm border border-white/20">
                    {m === "ONLINE" ? <Video size={12} className="text-indigo-500" /> : <Globe size={12} className="text-sky-500" />}
                    {m}
                  </span>
                ))}
              </div>

              {/* SUBJECTS - BOTTOM LEFT ON IMAGE */}
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5 max-w-[80%]">
                {data.subjects?.map((s: string) => (
                  <span key={s} className="bg-indigo-600/80 backdrop-blur text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg border border-white/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {data.title}
              </h1>
              <div className="flex flex-wrap items-center gap-5 mt-4 text-[12px] text-slate-500 font-medium">
                <span className="flex items-center gap-2"><MapPin size={14} className="text-indigo-400" /> {data.location}</span>
                <span className="flex items-center gap-2"><Users size={14} className="text-indigo-400" /> {data.currentStudents}/{data.maxStudents} Students</span>
              </div>
            </div>
          </div>

          {/* TUTOR PANEL */}
          <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between text-white shadow-lg">
            <div className="flex items-center gap-4">
              <img src={data.tutor.avatar} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10" />
              <div>
                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Verified Tutor</p>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold leading-tight">{data.tutor.name}</h3>
                  <ShieldCheck size={13} className="text-indigo-400" />
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-400 justify-end">
                <Star size={12} fill="currentColor" />
                <span className="text-sm font-black text-white">{data.tutor.rating?.toFixed(1) || "New"}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{data.tutor.totalReviews || 0} reviews</p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-4">
              <BookOpen size={14} className="text-indigo-500" /> About Class
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-600 font-medium">{data.description}</p>
          </div>

          {/* SCHEDULES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Calendar size={14} className="text-indigo-500" /> Select Schedule
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3">
              {data.schedules?.map((s: any) => {
                const selected = selectedSchedule === s.id;
                const booked = isAlreadyBooked(s.id);
                const available = s.maxStudents - s.bookedCount;
                return (
                  <button
                    key={s.id}
                    onClick={() => !booked && setSelectedSchedule(s.id)}
                    disabled={booked}
                    className={`group relative p-4 rounded-2xl border text-left transition-all duration-200 ${
                      selected 
                        ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-600 scale-[1.01]" 
                        : "bg-white border-slate-100 hover:border-indigo-200"
                    } ${booked ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}`}
                  >
                    {/* HOVER TOOLTIP */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10 group-hover:-top-14">
                      {booked ? "Slot already requested" : available > 0 ? "Click to select this session" : "Slot is full"}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45" />
                    </div>

                    <div className="flex justify-between items-start mb-2">
                      <div className={`p-2 rounded-lg ${selected ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-indigo-500'}`}>
                        <Clock size={14} />
                      </div>
                      {selected && <CheckCircle2 size={18} className="text-indigo-600" />}
                    </div>
                    <p className="font-bold text-sm text-slate-900 mb-1">{s.day}</p>
                    <p className="text-[12px] text-slate-500 font-bold mb-3">{s.startTime} — {s.endTime}</p>
                    
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className={`text-[10px] font-black uppercase ${available > 0 ? 'text-indigo-600' : 'text-rose-500'}`}>
                        {available} seats left
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STUDENTS */}
          <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
            <h2 className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-widest flex items-center gap-2">
              <UserCheck size={14} className="text-emerald-500" /> Joined ({students.length})
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {students.map((s: any) => (
                <img key={s.studentId} src={s.avatar} title={s.studentName} className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform cursor-pointer" />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING BOX */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sticky top-20">
            <div className="pb-6 border-b border-slate-50">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Pricing</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-slate-900">${data.basePrice}</span>
                <span className="text-sm text-slate-400 font-bold uppercase">USD</span>
              </div>
            </div>

            <div className="py-6 space-y-4">
              <div className="flex justify-between items-center text-[12px] font-medium">
                <span className="text-slate-400">Class Type</span>
                <span className="text-slate-900 font-bold">Group Session</span>
              </div>
            </div>

            <Button
              className={`w-full text-xs font-black rounded-xl h-12 tracking-widest transition-all uppercase ${
                selectedSchedule 
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
              disabled={!selectedSchedule}
              onClick={() => setOpenBooking(true)}
            >
              {selectedSchedule ? "Reserve Now" : "Select Time"}
            </Button>
            
            <div className="mt-5 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-start gap-2">
                <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] text-amber-800 font-bold uppercase tracking-tight leading-none">
                    Wait for confirmation
                  </p>
                  <p className="text-[9px] text-amber-600 font-medium leading-relaxed">
                    Tutor will review and contact you via Telegram to confirm your spot.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BookingSidebar
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        telegram={telegram}
        setTelegram={setTelegram}
        note={note}
        setNote={setNote}
        onSubmit={handleBooking}
        loading={loadingBook}
        error={error}
      />
    </div>
  );
}