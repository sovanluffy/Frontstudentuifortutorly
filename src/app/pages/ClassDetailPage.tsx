"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  CalendarDays,
  ArrowLeft,
  MapPin,
  Star,
  Users,
  Info,
  CheckCircle2,
  Hourglass,
  Loader2
} from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";
import BookingSidebar from "@/app/components/BookingSidebar";

/* ================= CONFIG ================= */
const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

export default function ClassDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data States
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Logic States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [hasBookedThisClass, setHasBookedThisClass] = useState(false);
  
  // Form States
  const [telegram, setTelegram] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadClassDetails = async () => {
      try {
        const res = await fetch(`${API_BASE}/open-classes/${id}`);
        const json = await res.json();
        setData(json);
        
        /** * NOTE: Your API should ideally return a field like 'alreadyBooked: true' 
         * if the logged-in user has a record for this class.
         */
        if (json.alreadyBooked) {
          setHasBookedThisClass(true);
        }
      } catch (err) {
        setErrorMessage("Failed to load class details.");
      } finally {
        setLoading(false);
      }
    };
    loadClassDetails();
  }, [id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getCookie("token");
    
    if (!token) {
      setErrorMessage("Please login to book this class.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE}/bookings/book-class/${data?.classId}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          dayTimeSlotId: selectedScheduleId, 
          telegram, 
          note 
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Booking failed");

      // SUCCESS: Change local state to prevent multiple bookings
      setHasBookedThisClass(true);
      setIsBookingOpen(false);
      alert("Booking request sent successfully!");
      
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-400 font-medium italic">Finding class details...</p>
      </div>
    );
  }

  if (!data) return <div className="p-20 text-center text-slate-500">Class not found.</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900">
      
      {/* HEADER NAVIGATION */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back to Catalog</span>
          </button>
          <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 uppercase tracking-tighter">
            {data.status || "Available"}
          </span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* LEFT: CONTENT AREA */}
          <div className="lg:col-span-2 space-y-12">
            
            <section className="space-y-6">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl shadow-indigo-100/50">
                <img
                  src={data.classImage || "https://images.unsplash.com/photo-1513258496099-48168024aec0"}
                  className="h-[450px] w-full object-cover"
                  alt="Class cover"
                />
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                  {data.title}
                </h1>
                
                <div className="flex items-center gap-6 pt-2">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-200">
                       {data.tutorName?.charAt(0)}
                     </div>
                     <div>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Instructor</p>
                       <p className="text-sm font-bold text-slate-800">{data.tutorName}</p>
                     </div>
                   </div>
                   <div className="h-8 w-[1px] bg-slate-200" />
                   <div className="flex items-center gap-1.5">
                     <Star size={18} className="fill-amber-400 text-amber-400" />
                     <span className="font-bold text-slate-900">{data.tutorRating || 5.0}</span>
                   </div>
                </div>
              </div>

              <p className="text-lg leading-relaxed text-slate-600 border-l-4 border-indigo-100 pl-6">
                {data.description}
              </p>
            </section>

            {/* CAPACITY & LOCATION */}
            <section className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl border bg-white flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><MapPin size={22} /></div>
                <div>
                  <h4 className="font-bold text-sm">Learning Mode</h4>
                  <p className="text-sm text-slate-500">{data.location}</p>
                  <p className="text-xs text-slate-400 mt-1">{data.specificAddress}</p>
                </div>
              </div>
              <div className="p-6 rounded-3xl border bg-white flex items-start gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Users size={22} /></div>
                <div>
                  <h4 className="font-bold text-sm">Class Size</h4>
                  <p className="text-sm text-slate-500">{data.currentStudents || 0} / {data.maxStudents} Students</p>
                </div>
              </div>
            </section>

            {/* SCHEDULE SELECTION */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <CalendarDays className="text-indigo-600" /> Available Sessions
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {data.schedules?.map((s: any) => {
                  const isActive = selectedScheduleId === s.id;
                  const isFull = s.bookedCount >= s.maxStudents;
                  const canSelect = !hasBookedThisClass && !isFull;

                  return (
                    <button
                      key={s.id}
                      disabled={!canSelect}
                      onClick={() => setSelectedScheduleId(s.id)}
                      className={`relative p-6 rounded-[2rem] border-2 text-left transition-all ${
                        isActive
                          ? "border-indigo-600 bg-indigo-50/50 shadow-inner"
                          : !canSelect
                            ? "bg-slate-50 opacity-40 cursor-not-allowed border-transparent" 
                            : "border-slate-100 hover:border-indigo-200 bg-white"
                      }`}
                    >
                      <div className={`font-bold text-lg ${isActive ? "text-indigo-700" : "text-slate-700"}`}>{s.day}</div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <Clock size={14} /> {s.startTime} — {s.endTime}
                      </div>
                      <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {isFull ? "Fully Booked" : `${s.bookedCount}/${s.maxStudents} spots filled`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* RIGHT: STICKY BOOKING CARD */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <div className="space-y-8">
                <div>
                  <p className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-widest">Course Fee</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-slate-900">${data.basePrice}</span>
                    <span className="text-slate-400 font-medium">/total</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {hasBookedThisClass ? (
                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-[2rem] text-center space-y-3">
                      <div className="inline-flex p-3 bg-amber-100 rounded-full text-amber-600">
                        <Hourglass size={24} className="animate-pulse" />
                      </div>
                      <h4 className="font-bold text-amber-900">Booking Pending</h4>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        You have already requested this class. Please wait for the tutor to confirm your attendance.
                      </p>
                    </div>
                  ) : (
                    <Button
                      className={`w-full py-8 text-lg font-bold rounded-2xl transition-all shadow-lg ${
                        selectedScheduleId 
                          ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" 
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                      disabled={!selectedScheduleId || isSubmitting}
                      onClick={() => setIsBookingOpen(true)}
                    >
                      {isSubmitting ? "Processing..." : "Reserve Your Spot"}
                    </Button>
                  )}
                  
                  <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                    <Info size={12} /> Secure transaction via TutorHub
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Why book this class?</h4>
                  <ul className="space-y-3 text-sm font-medium text-slate-600">
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-indigo-500 shrink-0" /> One-on-one tutor guidance</li>
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-indigo-500 shrink-0" /> Verified learning materials</li>
                    <li className="flex gap-3"><CheckCircle2 size={16} className="text-indigo-500 shrink-0" /> Full refund if cancelled 24h prior</li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <BookingSidebar
        open={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        telegram={telegram}
        setTelegram={setTelegram}
        note={note}
        setNote={setNote}
        onSubmit={handleBookingSubmit}
        loading={isSubmitting}
        error={errorMessage}
      />
    </div>
  );
}