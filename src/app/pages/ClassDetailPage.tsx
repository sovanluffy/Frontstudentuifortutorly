"use client";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  Loader2,
  CheckCircle2,
  BookOpen,
  Calendar,
  UserCheck,
  Clock,
  Info,
  ChevronRight,
  Navigation2,
  X,
} from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";
import BookingSidebar from "@/app/components/BookingSidebar";
import { toast, Toaster } from "sonner";

const API_BASE = "https://toturhub-dev.onrender.com/api/v1";
const getToken = () =>
  document.cookie.match(/token=([^;]+)/)?.[1] || "";

export default function ClassDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Booking States
  const [openBooking, setOpenBooking] = useState(false);
  const [telegram, setTelegram] = useState("");
  const [note, setNote] = useState("");
  const [loadingBook, setLoadingBook] = useState(false);
  const [bookingFinished, setBookingFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [myBookings, setMyBookings] = useState<any[]>([]);

  // Tutor Overall Reviews Modal
  const [showTutorReviewsModal, setShowTutorReviewsModal] = useState(false);
  const [tutorReviews, setTutorReviews] = useState<any[]>([]);
  const [tutorReviewsLoading, setTutorReviewsLoading] = useState(false);

  // Mock Data
  const mockClassData = {
    classId: 33,
    title: "Mathematics Tutoring Class (Copy)",
    description: "Learn algebra, geometry, and exam preparation in a structured way.",
    classImage: "https://res.cloudinary.com/djdfm5rrk/image/upload/v1776654018/user_avatars/evacd9kxsqchrdanjnzf.jpg",
    status: "OPEN",
    tutor: {
      tutorId: 31,
      name: "Visal Sk",
      avatar: "https://res.cloudinary.com/djdfm5rrk/image/upload/v1776653927/user_avatars/zdq7xnoiikqhozudkcck.jpg",
      rating: 3.6666666666666665,
      email: "visal12@gmail.com",
      phone: "012345678",
    },
    location: "Daun Penh, Phnom Penh",
    specificAddress: "Street 271, Phnom Penh",
    subjects: ["Mathematics", "Physics"],
    basePrice: 15.5,
    maxStudents: 10,
    currentStudents: 3,
    confirmedStudents: [
      {
        studentId: 42,
        studentName: "Visal Sk",
        avatar: "https://res.cloudinary.com/djdfm5rrk/image/upload/v1776653927/user_avatars/zdq7xnoiikqhozudkcck.jpg",
        email: "visal12@gmail.com",
        bookedSchedule: { day: "WEDNESDAY", startTime: "14:00:00", endTime: "16:00:00" },
      },
      {
        studentId: 52,
        studentName: "linn",
        avatar: "https://res.cloudinary.com/djdfm5rrk/image/upload/v1776842696/user_avatars/byavpxjoroe2yop8kooo.jpg",
        email: "lin@gmail.com",
        bookedSchedule: { day: "MONDAY", startTime: "09:00:00", endTime: "11:00:00" },
      },
    ],
    schedules: [
      { id: 22, day: "MONDAY", startTime: "09:00:00", endTime: "11:00:00", maxStudents: 10, bookedCount: 2 },
      { id: 23, day: "WEDNESDAY", startTime: "14:00:00", endTime: "16:00:00", maxStudents: 10, bookedCount: 1 },
    ],
  };

  // Fetch Class Details
  useEffect(() => {
    const fetchClass = async () => {
      setLoading(true);
      try {
        if (id === "33" || !id) {
          setData(mockClassData);
        } else {
          const res = await fetch(`${API_BASE}/open-classes/${id}`);
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load class details");
        setData(mockClassData);
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [id]);

  // Fetch Class Reviews
  useEffect(() => {
    if (data?.classId) fetchReviews(data.classId);
  }, [data?.classId]);

  const fetchReviews = async (classId: number) => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reviews/class/${classId}`);
      if (res.ok) {
        const reviewData = await res.json();
        setReviews(reviewData.reviews || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchTutorReviews = async (tutorId: number) => {
    setTutorReviewsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reviews/tutor/${tutorId}`);
      if (res.ok) {
        const tutorData = await res.json();
        setTutorReviews(tutorData.reviews || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTutorReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/bookings/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setMyBookings(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error(err);
    }
  };

  const isScheduleAlreadyBooked = (scheduleId: number) => {
    return myBookings.some(
      (b) =>
        b.classTitle === data?.title &&
        b.scheduleId === scheduleId &&
        (b.status === "PENDING" || b.status === "CONFIRMED")
    );
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule || !data) return;

    const toastId = toast.loading("Sending request to tutor...");
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
      if (!res.ok) throw new Error(result.message || "Booking failed");

      toast.success("Booking request sent successfully!", { id: toastId });
      setBookingFinished(true);

      setTimeout(async () => {
        setOpenBooking(false);
        setBookingFinished(false);
        setTelegram("");
        setNote("");
        setSelectedSchedule(null);
        await fetchUserBookings();
      }, 2000);
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message, { id: toastId });
    } finally {
      setLoadingBook(false);
    }
  };

  const handleWriteReviewClick = () => {
    toast.error("Action Denied: You can only review classes you have a confirmed booking for.", {
      description: "This class does not allow reviews at this time.",
      duration: 5000,
    });
  };

  const openTutorReviews = () => {
    if (data?.tutor?.tutorId) {
      fetchTutorReviews(data.tutor.tutorId);
      setShowTutorReviewsModal(true);
    }
  };

  const formatRating = (rating: number) => Math.round(rating * 10) / 10;

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-slate-400 bg-white">
        <Loader2 className="animate-spin mb-2 text-indigo-500" size={32} />
        <span className="text-xs font-black uppercase tracking-widest">Loading Details</span>
      </div>
    );
  }

  if (!data) return <div className="p-10 text-center">Class not found</div>;

  const confirmedStudents = data.confirmedStudents || [];
  const tutorOverallRating = formatRating(data.tutor.rating || 0);

  return (
    <div className="min-h-screen bg-[#FBFBFC] pb-10 text-slate-800 text-sm">
      <Toaster position="top-center" richColors />

      {/* Success Modal Overlay */}
      {bookingFinished && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/80 backdrop-blur-sm px-4">
          <div className="bg-white border border-slate-200 shadow-2xl p-8 rounded-3xl flex flex-col items-center gap-4 text-center max-w-sm w-full animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="font-black uppercase text-sm tracking-widest text-slate-900">Booking Finished!</h3>
              <p className="text-xs text-slate-500 mt-1">Your request has been sent to the tutor.</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SIMPLE NON-STICKY HEADER ==================== */}
      <header className="bg-white border-b border-slate-100 py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-all active:scale-95"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Status Badge */}
          <div className="flex-shrink-0">
            <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest rounded-full border border-indigo-100">
              {data.status}
            </div>
          </div>
        </div>
      </header>
      {/* ================================================================== */}

      <main className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* LEFT CONTENT */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Hero Card */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="relative aspect-video w-full overflow-hidden">
              <img src={data.classImage} className="w-full h-full object-cover" alt="Class Cover" />
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-4">
                {data.title}
              </h1>
              <div className="flex flex-col gap-3 text-sm text-slate-500">
                <span className="flex items-center gap-2 font-medium">
                  <MapPin size={18} className="text-indigo-500" /> {data.location}
                </span>
                {data.specificAddress && (
                  <span className="flex items-center gap-2 text-slate-400 pl-1">
                    <Navigation2 size={16} /> {data.specificAddress}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tutor Profile Card */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <img
                src={data.tutor.avatar}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/20"
                alt="Tutor"
              />
              <div className="flex-1">
                <h3 className="font-bold text-xl">{data.tutor.name}</h3>
                <p className="text-slate-400 text-sm">{data.tutor.email}</p>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-black text-amber-400">{tutorOverallRating}</div>
                <div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        fill={i < Math.floor(tutorOverallRating) ? "currentColor" : "none"}
                        stroke={i < tutorOverallRating ? "#fbbf24" : "#6b7280"}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Tutor Rating</p>
                </div>
              </div>
              <Button
                onClick={openTutorReviews}
                className="w-full md:w-auto bg-white/10 hover:bg-white/20 text-white border-none rounded-xl px-6"
              >
                View Tutor Profile <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-indigo-500" /> Course Details
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium mb-6">{data.description}</p>
            <div className="flex flex-wrap gap-2">
              {data.subjects?.map((subject: string, idx: number) => (
                <span key={idx} className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                  {subject}
                </span>
              ))}
            </div>
          </div>

          {/* Sessions Grid */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-2">
              <Calendar size={16} className="text-indigo-500" /> Available Sessions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.schedules?.map((schedule: any) => {
                const isBooked = isScheduleAlreadyBooked(schedule.id);
                const isSelected = selectedSchedule === schedule.id;
                const seatsTaken = schedule.bookedCount || 0;
                const totalSeats = schedule.maxStudents || data.maxStudents || 10;
                const percentage = Math.min((seatsTaken / totalSeats) * 100, 100);

                return (
                  <button
                    key={schedule.id}
                    disabled={isBooked}
                    onClick={() => !isBooked && setSelectedSchedule(schedule.id)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50 ring-4 ring-indigo-50"
                        : "bg-white border-slate-100 hover:border-indigo-200"
                    } ${isBooked ? "opacity-60 cursor-not-allowed bg-slate-50 border-slate-100" : "shadow-sm"}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-xl ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                        {isBooked ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                      </div>
                      <span className="font-black text-slate-900 text-sm uppercase">{schedule.day}</span>
                    </div>
                    <p className="text-lg font-bold text-slate-800 mb-4">
                      {schedule.startTime.slice(0, 5)} — {schedule.endTime.slice(0, 5)}
                    </p>
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col gap-1 w-full mr-4">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                          <span className={isBooked ? "text-emerald-600" : "text-slate-400"}>
                            {isBooked ? "Confirmed" : isSelected ? "Selected" : "Available"}
                          </span>
                          <span className="text-slate-900">{seatsTaken}/{totalSeats}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${isBooked ? "bg-emerald-500" : isSelected ? "bg-indigo-600" : "bg-slate-300"}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Star size={16} className="text-amber-500" /> Student Feedback
              </h2>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
                <Star size={16} className="text-amber-500" fill="currentColor" />
                <span className="font-bold text-slate-900">{tutorOverallRating}</span>
                <span className="text-slate-400 text-xs font-bold">({reviews.length} Reviews)</span>
              </div>
            </div>

            <Button
              onClick={handleWriteReviewClick}
              className="w-full mb-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black tracking-widest text-[11px] uppercase py-6 rounded-2xl shadow-lg shadow-emerald-100"
            >
              Write a Review
            </Button>

            {reviewsLoading ? (
              <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review: any) => (
                  <div key={review.id} className="group border-b border-slate-50 pb-6 last:border-none last:pb-0">
                    <div className="flex gap-4">
                      <img
                        src={review.studentAvatar || "https://via.placeholder.com/40"}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                        alt={review.studentName}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-slate-900">{review.studentName}</p>
                            <div className="flex text-amber-400 mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={1} />
                              ))}
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-3 leading-relaxed text-sm italic">"{review.comment}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-10 text-slate-400 italic">No reviews yet for this class.</p>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR - STICKY */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl p-6 sticky top-24">
            <div className="pb-6 border-b border-slate-50 mb-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment Fee</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-slate-900">${data.basePrice}</span>
                <span className="text-xs font-bold text-slate-400 uppercase">USD</span>
              </div>
            </div>

            <Button
              className={`w-full py-7 text-xs font-black rounded-2xl tracking-[0.15em] transition-all uppercase mb-4 ${
                selectedSchedule
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-100"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
              disabled={!selectedSchedule || loadingBook}
              onClick={() => setOpenBooking(true)}
            >
              {loadingBook ? (
                <Loader2 className="animate-spin text-white" size={20} />
              ) : selectedSchedule ? (
                "Enroll In Class"
              ) : (
                "Choose a Session"
              )}
              {!loadingBook && <ChevronRight size={18} className="ml-1" />}
            </Button>

            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3">
              <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 font-medium leading-tight">
                Tutor will contact you via Telegram to confirm payment and starting date.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50">
              <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                <UserCheck size={16} className="text-emerald-500" /> Active Students ({confirmedStudents.length})
              </h4>
              <div className="flex flex-wrap gap-3">
                {confirmedStudents.length > 0 ? (
                  confirmedStudents.map((student: any, index: number) => (
                    <div key={index} className="group relative flex flex-col items-center">
                      <img
                        src={student.avatar}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100 object-cover"
                        alt={student.studentName}
                      />
                      <div className="absolute -bottom-8 bg-slate-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {student.studentName}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Be the first to join!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Tutor All Reviews Modal */}
      {showTutorReviewsModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl scale-in-center">
            <div className="p-6 border-b flex justify-between items-center bg-slate-900 text-white">
              <div>
                <h3 className="font-black text-lg uppercase tracking-tight">Tutor Portfolio</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Reviews for {data?.tutor?.name}</p>
              </div>
              <button onClick={() => setShowTutorReviewsModal(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {tutorReviewsLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>
              ) : tutorReviews.length > 0 ? (
                tutorReviews.map((r: any) => (
                  <div key={r.id} className="pb-6 border-b border-slate-100 last:border-none">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold text-slate-900">{r.studentName}</p>
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 italic">"{r.comment}"</p>
                    <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center py-20 text-slate-500 italic">No feedback received yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Sidebar */}
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