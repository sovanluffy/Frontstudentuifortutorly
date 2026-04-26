"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; 
import { 
  Check, X, Calendar, Clock, MessageSquare, 
  Send, Loader2, Mail, Phone, Hash, MessageCircle 
} from "lucide-react";
import { toast, Toaster } from "sonner"; 
import { useLanguage } from "@/context/LanguageContext"; // Import context សម្រាប់ដូរភាសា

const API_BASE = import.meta.env.VITE_API_BASE;

/* ================= TYPES ================= */
interface Booking {
  bookingId: number;
  userId: number; 
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentAvatar?: string | null;
  classTitle: string;
  day: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  note?: string;
  telegram?: string;
}

type FilterStatus = "ALL" | "PENDING" | "CONFIRMED" | "REJECTED";

const TutorBookingsPage = () => {
  const navigate = useNavigate(); 
  const { t } = useLanguage(); // ប្រើសម្រាប់ប្តូរភាសា
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  const getToken = () => (typeof window !== "undefined" ? Cookies.get("token") : null);

  /* ================= DATA FETCHING ================= */
  const fetchBookings = useCallback(async () => {
    const token = getToken();
    if (!token) return setLoading(false);
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/bookings/tutor/me`, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Accept": "application/json" 
        },
      });
      if (res.ok) {
        const data: Booking[] = await res.json();
        const sorted = data.sort((a, b) => {
          if (a.status === "PENDING" && b.status !== "PENDING") return -1;
          if (a.status !== "PENDING" && b.status === "PENDING") return 1;
          return b.bookingId - a.bookingId;
        });
        setBookings(sorted);
      }
    } catch (err) { 
      console.error("Fetch Error:", err); 
      toast.error(t("ការទាញយកការកក់បរាជ័យ", "Failed to load bookings"));
    } finally { 
      setLoading(false); 
    }
  }, [t]);

  /* ================= UPDATE ACTION ================= */
  const updateStatus = async (id: number, action: "confirm" | "reject") => {
    const token = getToken();
    if (!token) return;

    const actionLabel = action === "confirm" 
      ? t("កំពុងទទួលយក...", "Accepting...") 
      : t("កំពុងបដិសេធ...", "Rejecting...");
    
    toast.promise(
      fetch(`${API_BASE}/bookings/${action}/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }),
      {
        loading: actionLabel,
        success: (res) => {
          if (!res.ok) throw new Error("Failed");
          fetchBookings();
          window.dispatchEvent(new Event("refreshCounts"));
          return action === "confirm" 
            ? t("បានបញ្ជាក់ការកក់ជោគជ័យ!", "Booking Confirmed!") 
            : t("បានបដិសេធការកក់រួចរាល់!", "Booking Rejected!");
        },
        error: t("មិនអាចធ្វើបច្ចុប្បន្នភាពស្ថានភាពបានទេ", "Could not update status."),
      }
    );
  };

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const filtered = useMemo(() => 
    filter === "ALL" ? bookings : bookings.filter(b => b.status === filter)
  , [bookings, filter]);

  /* ================= CHAT NAVIGATION ================= */
  const handleOpenChat = (student: Booking) => {
    navigate("/messages", { 
      state: { 
        recipientId: student.userId, 
        recipientName: student.studentName, 
        avatar: student.studentAvatar 
      } 
    });
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F4F7FE]">
      <Loader2 className="animate-spin text-[#4318FF]" size={40} />
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#F4F7FE] flex flex-col">
      <Toaster position="top-center" richColors />
      
      <header className="sticky top-0 z-30 w-full bg-[#F4F7FE]/90 backdrop-blur-xl border-b border-slate-200">
        <div className="w-full px-4 sm:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-xl md:text-2xl font-black text-[#1B2559]">
              {t("គ្រប់គ្រងការកក់", "Booking Management")}
            </h1>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              {filtered.length} {filter === "ALL" ? t("សរុប", "Total") : filter} {t("ការណាត់ជួប", "Appointments")}
            </p>
          </div>
          
          <div className="flex bg-white/60 p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar max-w-full">
            <div className="flex gap-1">
              {(["ALL", "PENDING", "CONFIRMED", "REJECTED"] as FilterStatus[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-xl px-5 py-2 text-[11px] font-black transition-all whitespace-nowrap ${
                    filter === f 
                      ? "bg-[#4318FF] text-white shadow-lg shadow-indigo-200" 
                      : "text-slate-500 hover:text-[#4318FF]"
                  }`}
                >
                  {f === "ALL" ? t("ទាំងអស់", "ALL") : 
                   f === "PENDING" ? t("រង់ចាំ", "PENDING") :
                   f === "CONFIRMED" ? t("បានបញ្ជាក់", "CONFIRMED") :
                   t("បានបដិសេធ", "REJECTED")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="w-full flex-1 px-4 sm:px-8 py-6">
        <div className="w-full flex flex-col gap-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-100 w-full">
              <Hash className="text-slate-100 mb-4" size={64} />
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                {t("មិនមានការកក់ទុកឡើយ", "No matching bookings found")}
              </p>
            </div>
          ) : (
            filtered.map((b) => {
              const isPending = b.status === "PENDING";
              return (
                <div 
                  key={b.bookingId} 
                  className={`group relative rounded-[32px] bg-white p-5 md:p-6 transition-all duration-300 border shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 w-full ${
                    isPending ? "border-indigo-500 ring-2 ring-indigo-500/5 scale-[1.01]" : "border-white"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative shrink-0">
                        <img 
                          src={b.studentAvatar || `https://ui-avatars.com/api/?name=${b.studentName}&background=4318FF&color=fff&bold=true`} 
                          className="h-14 w-14 md:h-16 md:w-16 rounded-full object-cover shadow-inner ring-4 ring-slate-50" 
                          alt={b.studentName} 
                        />
                        {isPending && (
                          <span className="absolute bottom-0 right-0 h-4 w-4 bg-indigo-500 border-[3px] border-white rounded-full animate-pulse" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="text-lg font-black text-[#1B2559] truncate">{b.studentName}</h3>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-black text-indigo-500 uppercase tracking-wide truncate">{b.classTitle}</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1.5 font-medium truncate">
                            <Mail size={12} className="shrink-0 text-slate-300"/> {b.studentEmail}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:flex items-center gap-3">
                      <div className="flex flex-col bg-[#F4F7FE] px-4 py-2.5 rounded-2xl border border-slate-100/50 min-w-[120px]">
                        <span className="text-[8px] font-black text-slate-400 uppercase mb-0.5">{t("ថ្ងៃ", "Date")}</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B2559]">
                          <Calendar size={13} className="text-indigo-400" /> {b.day}
                        </div>
                      </div>
                      <div className="flex flex-col bg-[#F4F7FE] px-4 py-2.5 rounded-2xl border border-slate-100/50 min-w-[120px]">
                        <span className="text-[8px] font-black text-slate-400 uppercase mb-0.5">{t("ម៉ោងចាប់ផ្តើម", "Start Time")}</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B2559]">
                          <Clock size={13} className="text-indigo-400" /> {b.startTime.slice(0, 5)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 lg:ml-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-50">
                      <div className="flex items-center gap-2">
                        {isPending ? (
                          <>
                            <button 
                              onClick={() => updateStatus(b.bookingId, "confirm")} 
                              className="h-11 px-6 rounded-2xl bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-100 hover:bg-emerald-600 active:scale-95 transition-all flex items-center gap-2"
                            >
                              <Check size={18} strokeWidth={3} /> <span className="hidden sm:inline">{t("យល់ព្រម", "ACCEPT")}</span>
                            </button>
                            <button 
                              onClick={() => updateStatus(b.bookingId, "reject")} 
                              className="h-11 w-11 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center active:scale-95"
                            >
                              <X size={20} strokeWidth={3} />
                            </button>
                          </>
                        ) : (
                          <div className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl border ${
                            b.status === "CONFIRMED" 
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                              : "bg-rose-50 text-rose-500 border-rose-100"
                          }`}>
                            {b.status === "CONFIRMED" ? t("បានបញ្ជាក់", "CONFIRMED") : t("បានបដិសេធ", "REJECTED")}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleOpenChat(b)}
                          className="h-11 w-11 flex items-center justify-center rounded-2xl bg-slate-50 text-[#1B2559] border border-slate-100 hover:bg-[#4318FF] hover:text-white transition-all duration-300"
                          title={t("បើកការសន្ទនា", "Open Messenger")}
                        >
                          <MessageCircle size={20} />
                        </button>

                        {b.status === "CONFIRMED" && b.telegram && b.telegram !== "string" && (
                          <a 
                            href={`https://t.me/${b.telegram.replace('@','')}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="h-11 w-11 flex items-center justify-center rounded-2xl bg-[#4318FF] text-white shadow-lg shadow-indigo-100 hover:scale-110 active:scale-95 transition-all"
                          >
                            <Send size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {(b.studentPhone || (b.note && b.note !== "string")) && (
                    <div className="mt-5 flex flex-col md:flex-row md:items-center gap-4 border-t border-slate-50 pt-4">
                      {b.studentPhone && (
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg w-max">
                          <Phone size={13} className="text-indigo-300"/> {b.studentPhone}
                        </span>
                      )}
                      {b.note && b.note !== "string" && (
                        <div className="text-[11px] text-slate-400 italic flex items-start gap-2 bg-slate-50/30 p-2.5 rounded-xl flex-1">
                          <MessageSquare size={13} className="shrink-0 mt-0.5 text-indigo-200" />
                          <p className="line-clamp-1 group-hover:line-clamp-none transition-all">"{b.note}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default TutorBookingsPage;