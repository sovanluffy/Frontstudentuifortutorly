"use client";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Loader2, ArrowLeft, MapPin, Users, Calendar, 
  DollarSign, ShieldCheck, CheckCircle2, Send
} from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";
import { Badge } from "@/app/components/figma/ui/badge";

export default function ClassDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- NEW STATES FOR BOOKING ---
  const [isBooking, setIsBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    scheduleId: "",
    telegram: "",
    note: ""
  });

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const res = await fetch(`https://toturhub-dev.onrender.com/api/v1/open-classes/${id}`, {
          headers: { accept: "*/*" },
        });
        if (!res.ok) throw new Error("Class not found");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching class details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClassDetails();
  }, [id]);

  // --- API FETCH FUNCTION ---
  const handleEnroll = async () => {
    if (!bookingForm.scheduleId) return alert("Please select a schedule slot first!");
    
    setIsBooking(true);
    const token = localStorage.getItem("token"); // Assumes you store your JWT here

    try {
      const res = await fetch(`https://toturhub-dev.onrender.com/api/v1/bookings/book-class/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "accept": "*/*"
        },
        body: JSON.stringify({
          scheduleId: parseInt(bookingForm.scheduleId),
          telegram: bookingForm.telegram || "@hidden",
          note: bookingForm.note || "Interested in this class"
        }),
      });

      if (res.ok) {
        const result = await res.json();
        alert("Booking Successful! Booking ID: " + result.bookingId);
        navigate("/student/bookings"); // Redirect to a success page or dashboard
      } else {
        const error = await res.json();
        alert(error.message || "Enrollment failed. Please check your login status.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft size={18} /> Back to Tutor
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            {/* MAIN CARD... (rest of your UI) */}
            
            {/* NEW: SCHEDULE SELECTION SECTION */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar size={22} className="text-blue-500" /> Select Your Schedule
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {data.schedules?.map((slot: any) => (
                  <label 
                    key={slot.id} 
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      bookingForm.scheduleId === String(slot.id) 
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" 
                      : "border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="schedule" 
                        className="hidden"
                        onChange={() => setBookingForm({...bookingForm, scheduleId: String(slot.id)})}
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{slot.startDate}</p>
                        <p className="text-xs text-slate-500">{slot.startTime} - {slot.endTime}</p>
                      </div>
                    </div>
                    {bookingForm.scheduleId === String(slot.id) && <CheckCircle2 size={20} className="text-blue-600" />}
                  </label>
                ))}
              </div>

              {/* CONTACT FIELDS */}
              <div className="mt-8 space-y-4">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Telegram Username</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-blue-500"
                      placeholder="@yourusername"
                      onChange={(e) => setBookingForm({...bookingForm, telegram: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Note to Tutor</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-blue-500"
                      placeholder="Tell the tutor about your level..."
                      onChange={(e) => setBookingForm({...bookingForm, note: e.target.value})}
                    />
                 </div>
              </div>
            </div>
          </div>

          {/* ACTION SIDEBAR */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl sticky top-24">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Price</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black">${data.basePrice}</span>
              </div>

              <Button 
                onClick={handleEnroll}
                disabled={isBooking}
                className="w-full bg-blue-600 hover:bg-blue-500 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isBooking ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>Enroll Now <Send className="ml-2" size={18} /></>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}