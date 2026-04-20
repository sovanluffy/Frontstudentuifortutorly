"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  X,
  Users,
  BookOpen,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  Info,
  ArrowLeft,
  MapPin,
  Star,
  Hash,
  User,
  ExternalLink
} from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";

/* ================= UTILITY ================= */
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

export default function ClassDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State Management
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [telegram, setTelegram] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Class Data
  useEffect(() => {
    fetch(`https://toturhub-dev.onrender.com/api/v1/open-classes/${id}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setErrorMessage("Failed to load class details."))
      .finally(() => setLoading(false));
  }, [id]);

  // Handle Booking Submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getCookie("token");

    if (!token) {
      setErrorMessage("Please login first to book a class.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(
        `https://toturhub-dev.onrender.com/api/v1/bookings/book-class/${data?.classId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dayTimeSlotId: selectedScheduleId,
            telegram,
            note,
          }),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Booking failed");

      alert("Booking Successful!");
      setIsBookingOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Details...</p>
      </div>
    );
  }

  if (!data) return <div className="p-20 text-center font-bold text-slate-400">Class not found.</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 font-sans">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        
        {/* TOP NAVIGATION / BACK BUTTON */}
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-slate-500 font-bold hover:text-indigo-600 transition-all mb-8 w-fit"
        >
          <div className="p-2 rounded-xl bg-white border border-slate-200 group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-all shadow-sm">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm">Back to Discovery</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* ================= LEFT: CORE CONTENT ================= */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* HERO SECTION */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="relative h-80 bg-slate-100">
                <img 
                  src={data.classImage || "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=2070&auto=format&fit=crop"} 
                  className="w-full h-full object-cover" 
                  alt="Course Banner" 
                />
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                  {data.subjects?.map((s: string) => (
                    <span key={s} className="bg-white/95 backdrop-blur-md text-indigo-700 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg border border-indigo-100">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-6 left-6 bg-slate-900/40 backdrop-blur px-3 py-1.5 rounded-lg text-white text-[10px] font-bold flex items-center gap-2">
                   <Hash size={12} /> ID: {data.classId}
                </div>
              </div>

              <div className="p-10">
                <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight uppercase tracking-tight">
                    {data.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 mb-10">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
                            {data.tutorName?.charAt(0) || <User size={20}/>}
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Instructor</p>
                            <p className="text-base font-bold text-slate-800 leading-none">{data.tutorName}</p>
                            <div className="flex items-center text-amber-500 gap-1 mt-1">
                                <Star size={12} fill="currentColor" />
                                <span className="text-xs font-black">{data.tutorRating || "0.0"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 mb-10">
                  <h3 className="font-bold text-xl text-slate-900">Description</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {data.description || "No description available for this course."}
                  </p>
                </div>

                {/* LOCATION CARD */}
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-rose-500">
                            <MapPin size={18} />
                            <span className="text-[11px] font-black uppercase tracking-widest">Location</span>
                        </div>
                        <p className="font-bold text-slate-800">{data.location}</p>
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-indigo-500">
                            <ExternalLink size={18} />
                            <span className="text-[11px] font-black uppercase tracking-widest">Address</span>
                        </div>
                        <p className="text-sm font-medium text-slate-600">{data.specificAddress || "Contact tutor for address"}</p>
                    </div>
                </div>
              </div>
            </div>

            {/* SCHEDULE SECTION */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
              <h2 className="font-bold text-2xl flex items-center gap-3 text-slate-900 mb-8">
                <CalendarDays className="text-indigo-600" size={28} /> Session Selection
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">
                {data.schedules?.map((s: any) => {
                  const isActive = selectedScheduleId === s.id;
                  const percent = (s.bookedCount / s.maxStudents) * 100;
                  const isFull = percent >= 100;

                  return (
                    <button
                      key={s.id}
                      disabled={isFull}
                      onClick={() => setSelectedScheduleId(s.id)}
                      className={`relative p-6 border-2 rounded-3xl text-left transition-all duration-300 group ${
                        isActive 
                          ? "border-indigo-600 bg-indigo-50/40 shadow-xl shadow-indigo-100 ring-1 ring-indigo-600" 
                          : isFull 
                            ? "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed" 
                            : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50"
                      }`}
                    >
                      {isActive && <CheckCircle2 className="absolute top-5 right-5 text-indigo-600" size={20} />}
                      
                      <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isActive ? "text-indigo-600" : "text-slate-400"}`}>
                        {s.day}
                      </div>
                      <div className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-4">
                        <Clock size={20} className={isActive ? "text-indigo-600" : "text-slate-300"} />
                        {s.startTime.slice(0, 5)} - {s.endTime.slice(0, 5)}
                      </div>

                      {/* INDIVIDUAL PROGRESS */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
                            <span className="text-slate-400">Class Load</span>
                            <span className={isFull ? "text-rose-500" : "text-emerald-600"}>
                                {s.bookedCount} / {s.maxStudents} Students
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                                className={`h-full transition-all duration-700 ${isFull ? "bg-rose-500" : "bg-indigo-500"}`}
                                style={{ width: `${Math.min(percent, 100)}%` }}
                            />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= RIGHT: SIDEBAR SUMMARY ================= */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 space-y-8">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Registration Fee</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900">${data.basePrice}</span>
                  <span className="text-slate-400 font-bold text-lg">/USD</span>
                </div>
              </div>

              <div className="space-y-5 py-8 border-y border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                    <Users size={20} className="text-slate-300" /> Max Capacity
                  </span>
                  <span className="bg-slate-100 px-4 py-1.5 rounded-xl font-black text-sm text-slate-700">
                    {data.maxStudents}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                    <BookOpen size={20} className="text-slate-300" /> Type
                  </span>
                  <span className="text-indigo-600 font-black text-[10px] bg-indigo-50 px-4 py-1.5 rounded-xl border border-indigo-100 uppercase">
                    On-Site
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => setIsBookingOpen(true)}
                  className={`w-full py-8 rounded-[1.5rem] text-xl font-black transition-all shadow-xl ${
                    !selectedScheduleId 
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                      : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 shadow-indigo-200"
                  }`}
                  disabled={!selectedScheduleId}
                >
                  {selectedScheduleId ? "Reserve Spot" : "Pick a Time"}
                </Button>
                
                <div className="flex items-start gap-4 p-5 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                  <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
                  <div className="text-[10px] text-slate-600 leading-relaxed font-medium">
                    <span className="font-black text-emerald-700 block mb-1 uppercase">Enrollment Protection</span>
                    Full refund if requested 24 hours before the first session starts.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOOKING MODAL ================= */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setIsBookingOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Confirm Booking</h3>
                <p className="text-slate-500 font-medium mt-1">Please enter your Telegram to continue.</p>
              </div>
              <button onClick={() => setIsBookingOpen(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Telegram @username</label>
                <input
                  required
                  className="w-full border-2 border-slate-100 rounded-[1.25rem] p-5 text-base font-medium focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none"
                  placeholder="@yourname"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Message to Tutor</label>
                <textarea
                  className="w-full border-2 border-slate-100 rounded-[1.25rem] p-5 text-base font-medium min-h-[120px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none resize-none"
                  placeholder="Questions or specific goals..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {errorMessage && (
                <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 flex items-center gap-2">
                  <Info size={16} /> {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-8 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-xl font-black shadow-2xl shadow-indigo-200"
              >
                {isSubmitting ? "Finalizing..." : "Submit Enrollment"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}