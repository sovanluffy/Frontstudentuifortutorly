"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Clock,
  ChevronLeft,
  User,
  Star,
  X,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";

/* ================= TYPES ================= */

interface Schedule {
  id?: number;
  day: string;
  startTime: string;
  endTime: string;
}

interface ClassDetails {
  classId: number;
  title: string;
  description: string;
  status: string;
  tutorName: string;
  tutorRating: number;
  location: string;
  specificAddress: string;
  subjects: string[];
  learningModes: string[];
  basePrice: number;
  maxStudents: number;
  currentStudents: number;
  classImage: string;
  schedules: Schedule[];
}

/* ================= COMPONENT ================= */

export default function ClassDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<ClassDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  // --- Booking States ---
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetch(`https://toturhub-dev.onrender.com/api/v1/open-classes/${id}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => console.error("Fetch error"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Logic for API call would go here
    // Example: await fetch('/api/v1/bookings', { method: 'POST', body: ... })
    
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSuccess(true);
    }, 1500);
  };

  if (loading) return <div className="p-20 text-center text-gray-500">Loading class...</div>;
  if (!data) return <div className="p-20 text-center text-red-500">Class not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-colors font-medium"
        >
          <ChevronLeft size={20} /> Back to Search
        </button>

        <div className="grid lg:grid-cols-12 gap-10">

          {/* LEFT SIDE (DETAILS) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative">
              <img
                src={data.classImage}
                alt={data.title}
                className="w-full h-96 object-cover rounded-3xl shadow-sm border border-gray-100"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-[#00D64F] text-white px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg">
                  {data.status}
                </span>
                {data.learningModes.map((mode) => (
                  <span key={mode} className="bg-white/90 backdrop-blur text-blue-600 px-4 py-1.5 rounded-xl text-xs font-black uppercase shadow-lg">
                    {mode}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-black text-gray-900 leading-tight uppercase">
                {data.title}
              </h1>
              <div className="flex gap-2 mt-3 flex-wrap">
                {data.subjects.map((s) => (
                  <span key={s} className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-xs font-bold border border-indigo-100 uppercase">
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 mt-6 leading-relaxed text-lg">
                {data.description}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 mb-3">
                <MapPin size={18} className="text-pink-500" />
                <span className="text-xs font-black uppercase tracking-widest">Meeting Point</span>
              </div>
              <p className="font-black text-xl text-gray-800">{data.specificAddress}</p>
              <p className="text-gray-500 font-medium">{data.location}</p>
            </div>
          </div>

          {/* RIGHT SIDE (PRICING & ACTION) */}
          <div className="lg:col-span-5">
            <div className="sticky top-10 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 space-y-8">
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                  <p className="text-5xl font-black text-blue-600">${data.basePrice.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Enrolled</p>
                  <p className="text-2xl font-black text-gray-800">{data.currentStudents}/{data.maxStudents}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Calendar size={18} className="text-blue-600" /> Weekly Schedule
                </h3>
                {data.schedules.map((s, i) => (
                  <div key={i} className="flex justify-between items-center bg-blue-50/50 p-4 rounded-2xl mb-2 border border-blue-100/50">
                    <span className="font-black text-gray-700">{s.day}</span>
                    <span className="flex items-center gap-2 font-bold text-blue-600 bg-white px-3 py-1.5 rounded-xl shadow-sm text-sm">
                      <Clock size={14} /> {s.startTime} - {s.endTime}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border border-gray-100 p-4 rounded-2xl bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase">Expert Tutor</p>
                    <p className="font-bold text-gray-800 leading-tight">{data.tutorName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-gray-100">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-black text-gray-700">{data.tutorRating || "New"}</span>
                </div>
              </div>

              <Button 
                onClick={() => setIsBookingOpen(true)}
                disabled={data.status !== "OPEN"}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-2xl font-black text-lg shadow-lg shadow-blue-100 transition-transform active:scale-95 uppercase"
              >
                {data.status === "OPEN" ? "Secure My Spot" : "Class Full"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOOKING MODAL OVERLAY ================= */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
            
            {/* Modal Header */}
            <div className="p-8 pb-0 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black text-gray-900 uppercase">Booking</h2>
                <p className="text-sm text-gray-500 font-medium">{data.title}</p>
              </div>
              <button 
                onClick={() => { setIsBookingOpen(false); setBookingSuccess(false); }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              {!bookingSuccess ? (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com" 
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Special Notes (Optional)</label>
                    <textarea 
                      placeholder="Any specific goals for this class?" 
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium h-24 resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <Button 
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl text-white font-black shadow-lg shadow-blue-100 uppercase"
                    >
                      {isSubmitting ? "Processing..." : `Pay $${data.basePrice.toFixed(2)} & Book`}
                    </Button>
                  </div>
                </form>
              ) : (
                /* Success View */
                <div className="text-center py-10 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                      <CheckCircle2 size={48} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">Success!</h3>
                  <p className="text-gray-500 font-medium px-4">
                    Your spot in <span className="text-blue-600 font-bold">{data.title}</span> has been reserved. Check your email for details.
                  </p>
                  <Button 
                    onClick={() => setIsBookingOpen(false)}
                    className="mt-6 bg-gray-900 text-white px-8 h-12 rounded-xl font-bold uppercase"
                  >
                    Got it
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}