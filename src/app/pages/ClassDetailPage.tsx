"use client";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  Lock,
  PenLine,
} from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";
import BookingSidebar from "@/app/components/BookingSidebar";
import { toast, Toaster } from "sonner";

const API_BASE = "https://toturhub-dev.onrender.com/api/v1";
const getToken = () => document.cookie.match(/token=([^;]+)/)?.[1] || "";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Schedule {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  bookedCount: number;
}

interface ConfirmedStudent {
  studentId: number;
  studentName: string;
  avatar: string;
  email: string;
  bookedSchedule: { day: string; startTime: string; endTime: string };
}

interface ClassData {
  classId: number;
  title: string;
  description: string;
  classImage: string;
  status: string;
  startDate: string;
  endDate: string;
  durationType: string;
  durationValue: number;
  tutor: {
    tutorId: number;
    name: string;
    avatar: string;
    rating: number;
    email: string;
    phone: string;
  };
  location: string;
  specificAddress?: string;
  subjects: string[];
  basePrice: number;
  maxStudents: number;
  currentStudents: number;
  confirmedStudents: ConfirmedStudent[];
  schedules: Schedule[];
}

interface Review {
  id: number;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockClassData: ClassData = {
  classId: 33,
  title: "Mathematics Tutoring Class",
  description:
    "Learn algebra, geometry, and exam preparation in a structured way. Build problem-solving skills from the ground up with personalized guidance.",
  classImage:
    "https://res.cloudinary.com/djdfm5rrk/image/upload/v1776654018/user_avatars/evacd9kxsqchrdanjnzf.jpg",
  status: "OPEN",
  startDate: "2026-04-28T02:28:02.071Z",
  endDate: "2026-06-28T02:28:02.071Z",
  durationType: "DAYS",
  durationValue: 61,
  tutor: {
    tutorId: 31,
    name: "Visal Sk",
    avatar:
      "https://res.cloudinary.com/djdfm5rrk/image/upload/v1776653927/user_avatars/zdq7xnoiikqhozudkcck.jpg",
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
      avatar:
        "https://res.cloudinary.com/djdfm5rrk/image/upload/v1776653927/user_avatars/zdq7xnoiikqhozudkcck.jpg",
      email: "visal12@gmail.com",
      bookedSchedule: { day: "WEDNESDAY", startTime: "14:00:00", endTime: "16:00:00" },
    },
    {
      studentId: 52,
      studentName: "linn",
      avatar:
        "https://res.cloudinary.com/djdfm5rrk/image/upload/v1776842696/user_avatars/byavpxjoroe2yop8kooo.jpg",
      email: "lin@gmail.com",
      bookedSchedule: { day: "MONDAY", startTime: "09:00:00", endTime: "11:00:00" },
    },
  ],
  schedules: [
    { id: 22, day: "MONDAY", startTime: "09:00:00", endTime: "11:00:00", maxStudents: 10, bookedCount: 2 },
    { id: 23, day: "WEDNESDAY", startTime: "14:00:00", endTime: "16:00:00", maxStudents: 10, bookedCount: 1 },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getClassDateStatus(startDate: string, endDate: string): "upcoming" | "active" | "expired" {
  const now = new Date();
  if (now < new Date(startDate)) return "upcoming";
  if (now > new Date(endDate)) return "expired";
  return "active";
}

function formatRating(rating: number) {
  return Math.round(rating * 10) / 10;
}

// ─── Duration Banner ──────────────────────────────────────────────────────────

function DurationBanner({
  startDate,
  endDate,
  durationType,
  durationValue,
}: {
  startDate: string;
  endDate: string;
  durationType: string;
  durationValue: number;
}) {
  const status = getClassDateStatus(startDate, endDate);
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  const label = durationValue + " " + durationType.toLowerCase();

  const configs = {
    active: {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: "📗",
      msg: `Class is currently active · ${start} → ${end} · ${label} total`,
    },
    expired: {
      bg: "bg-red-50 border-red-200 text-red-800",
      icon: "📕",
      msg: `This class has ended · Ran from ${start} to ${end}`,
    },
    upcoming: {
      bg: "bg-blue-50 border-blue-200 text-blue-800",
      icon: "📘",
      msg: `Class starts on ${start} · Runs for ${label}`,
    },
  };

  const cfg = configs[status];

  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium mb-4 ${cfg.bg}`}>
      <span className="text-base flex-shrink-0 mt-0.5">{cfg.icon}</span>
      <span className="leading-relaxed">{cfg.msg}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ClassDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const token = getToken();
  const isLoggedIn = !!token;

  // ── Redirect to login, saving current path so user returns after login ───────
  const redirectToLogin = () => {
    navigate("/login", {
      replace: true,
      state: { from: location.pathname },
    });
  };

  const [data, setData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Booking
  const [openBooking, setOpenBooking] = useState(false);
  const [telegram, setTelegram] = useState("");
  const [note, setNote] = useState("");
  const [loadingBook, setLoadingBook] = useState(false);
  const [bookingFinished, setBookingFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [myBookings, setMyBookings] = useState<any[]>([]);

  // Tutor reviews modal
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [tutorReviews, setTutorReviews] = useState<Review[]>([]);
  const [tutorReviewsLoading, setTutorReviewsLoading] = useState(false);

  // ── Fetch class — PUBLIC, no token needed ────────────────────────────
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
      } catch {
        toast.error("Failed to load class details");
        setData(mockClassData);
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [id]);

  // ── Fetch class reviews — PUBLIC, no token needed ────────────────────
  useEffect(() => {
    if (data?.classId) {
      setReviewsLoading(true);
      fetch(`${API_BASE}/reviews/class/${data.classId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((json) => setReviews(json?.reviews || []))
        .catch(() => {})
        .finally(() => setReviewsLoading(false));
    }
  }, [data?.classId]);

  // ── Fetch my bookings — only if logged in ────────────────────────────
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/bookings/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => setMyBookings(Array.isArray(json) ? json : []))
      .catch(() => {});
  }, [token]);

  // ── Fetch tutor reviews ──────────────────────────────────────────────
  const fetchTutorReviews = (tutorId: number) => {
    setTutorReviewsLoading(true);
    fetch(`${API_BASE}/reviews/tutor/${tutorId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => setTutorReviews(json?.reviews || []))
      .catch(() => {})
      .finally(() => setTutorReviewsLoading(false));
  };

  // ── Derived state ────────────────────────────────────────────────────
  const hasConfirmedBooking =
    isLoggedIn &&
    myBookings.some((b) => b.classId === data?.classId && b.status === "CONFIRMED");

  const isScheduleAlreadyBooked = (scheduleId: number) =>
    isLoggedIn &&
    myBookings.some(
      (b) =>
        b.classId === data?.classId &&
        b.scheduleId === scheduleId &&
        (b.status === "PENDING" || b.status === "CONFIRMED")
    );

  // ── Booking submit ───────────────────────────────────────────────────
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule || !data) return;

    const toastId = toast.loading("Sending request to tutor...");
    setLoadingBook(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/bookings/book-class/${data.classId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dayTimeSlotId: selectedSchedule, telegram, note }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Booking failed");

      toast.success("Booking request sent successfully!", { id: toastId });
      setOpenBooking(false);
      setBookingFinished(true);

      setTimeout(() => {
        setBookingFinished(false);
        setTelegram("");
        setNote("");
        setSelectedSchedule(null);
        fetch(`${API_BASE}/bookings/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => r.json())
          .then((json) => setMyBookings(Array.isArray(json) ? json : []))
          .catch(() => {});
      }, 3000);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message, { id: toastId });
    } finally {
      setLoadingBook(false);
    }
  };

  // ── Enroll click ─────────────────────────────────────────────────────
  // Not logged in → auto redirect to login (with return path)
  // Logged in but no session selected → warning
  // Logged in + session selected → open booking sidebar
  const handleEnrollClick = () => {
    if (!isLoggedIn) {
      // Save chosen schedule so we can restore it after login if needed
      if (selectedSchedule) {
        sessionStorage.setItem("pendingScheduleId", String(selectedSchedule));
      }
      redirectToLogin();
      return;
    }
    if (!selectedSchedule) {
      toast.warning("No session selected", {
        description: "Please choose a session from the list first.",
      });
      return;
    }
    setOpenBooking(true);
  };

  // ── Write review click ───────────────────────────────────────────────
  // Not logged in → auto redirect to login
  // Logged in but no confirmed booking → access denied toast
  // Logged in + confirmed booking → open review form
  const handleWriteReviewClick = () => {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }
    if (!hasConfirmedBooking) {
      toast.error("Access denied", {
        description:
          "Only students with a confirmed booking can write a review. Your booking must be confirmed by the tutor first.",
        duration: 6000,
      });
      return;
    }
    // TODO: open review form
    toast.success("Opening review form...");
  };

  // ── Loading ──────────────────────────────────────────────────────────
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
  const tutorRating = formatRating(data.tutor.rating || 0);

  return (
    <div className="min-h-screen bg-[#FBFBFC] pb-10 text-slate-800 text-sm">
      <Toaster position="top-right" richColors />

      {/* ── Booking Success Overlay ── */}
      {bookingFinished && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/85 backdrop-blur-sm px-4 animate-in fade-in duration-300">
          <div className="bg-white border border-slate-200 shadow-2xl p-8 rounded-3xl flex flex-col items-center gap-4 text-center max-w-sm w-full animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="font-black uppercase text-sm tracking-widest text-slate-900 mb-1">
                Booking Sent!
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your request has been sent to the tutor. They will contact you on Telegram to confirm
                payment and the starting date.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-100 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-all active:scale-95"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest rounded-full border border-indigo-100">
              {data.status}
            </div>
            {/* Show login button in header when guest */}
            {!isLoggedIn && (
              <button
                onClick={redirectToLogin}
                className="px-4 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-full transition-colors"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Grid ── */}
      <main className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">

        {/* ════════════════ LEFT COLUMN ════════════════ */}
        <div className="lg:col-span-8 space-y-4">

          {/* Hero Card */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="relative aspect-video w-full overflow-hidden">
              <img src={data.classImage} className="w-full h-full object-cover" alt="Class Cover" />
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-4">{data.title}</h1>
              <div className="flex flex-col gap-2 text-sm text-slate-500">
                <span className="flex items-center gap-2 font-medium">
                  <MapPin size={16} className="text-indigo-500" /> {data.location}
                </span>
                {data.specificAddress && (
                  <span className="flex items-center gap-2 text-slate-400 pl-1">
                    <Navigation2 size={14} /> {data.specificAddress}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Duration Banner */}
          <DurationBanner
            startDate={data.startDate}
            endDate={data.endDate}
            durationType={data.durationType}
            durationValue={data.durationValue}
          />

          {/* Tutor Card */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
              <img
                src={data.tutor.avatar}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/20"
                alt="Tutor"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{data.tutor.name}</h3>
                <p className="text-slate-400 text-xs">{data.tutor.email}</p>
              </div>
            </div>
            <div className="bg-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-black text-amber-400">{tutorRating}</div>
                <div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={i < Math.floor(tutorRating) ? "currentColor" : "none"}
                        stroke={i < tutorRating ? "#fbbf24" : "#6b7280"}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                    Tutor Rating
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  fetchTutorReviews(data.tutor.tutorId);
                  setShowTutorModal(true);
                }}
                className="w-full md:w-auto bg-white/10 hover:bg-white/20 text-white border-none rounded-xl px-5 text-xs"
              >
                View Tutor Profile <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-3">
              <BookOpen size={14} className="text-indigo-500" /> Course Details
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm mb-4">{data.description}</p>
            <div className="flex flex-wrap gap-2">
              {data.subjects?.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Sessions */}
          <div className="space-y-3">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
              <Calendar size={14} className="text-indigo-500" /> Available Sessions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.schedules?.map((schedule) => {
                const isBooked = isScheduleAlreadyBooked(schedule.id);
                const isSelected = selectedSchedule === schedule.id;
                const seatsTaken = schedule.bookedCount || 0;
                const totalSeats = schedule.maxStudents || data.maxStudents || 10;
                const pct = Math.min((seatsTaken / totalSeats) * 100, 100);

                return (
                  <button
                    key={schedule.id}
                    disabled={isBooked}
                    onClick={() => {
                      if (!isBooked) {
                        setSelectedSchedule(schedule.id);
                        toast.info("Session selected", {
                          description: isLoggedIn
                            ? 'Click "Enroll in class" to continue.'
                            : 'Click "Log In to Enroll" to continue.',
                        });
                      }
                    }}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50 ring-4 ring-indigo-50"
                        : "bg-white border-slate-100 hover:border-indigo-200"
                    } ${isBooked ? "opacity-60 cursor-not-allowed bg-slate-50 border-slate-100" : "shadow-sm"}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={`p-2 rounded-xl ${
                          isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {isBooked ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                      </div>
                      <span className="font-black text-slate-900 text-xs uppercase">{schedule.day}</span>
                    </div>
                    <p className="text-base font-bold text-slate-800 mb-4">
                      {schedule.startTime.slice(0, 5)} — {schedule.endTime.slice(0, 5)}
                    </p>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                        <span className={isBooked ? "text-emerald-600" : isSelected ? "text-indigo-600" : "text-slate-400"}>
                          {isBooked ? "Confirmed" : isSelected ? "Selected" : "Available"}
                        </span>
                        <span className="text-slate-900">{seatsTaken}/{totalSeats}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isBooked ? "bg-emerald-500" : isSelected ? "bg-indigo-600" : "bg-slate-300"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Reviews — ALWAYS VISIBLE to everyone ── */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Star size={14} className="text-amber-500" /> Student Feedback
              </h2>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
                <Star size={14} className="text-amber-500" fill="currentColor" />
                <span className="font-bold text-slate-900 text-sm">{tutorRating}</span>
                <span className="text-slate-400 text-xs font-bold">({reviews.length} Reviews)</span>
              </div>
            </div>

            {/* Write Review Button — adapts to auth state */}
            <button
              onClick={handleWriteReviewClick}
              className={`w-full mb-2 py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-black tracking-widest uppercase transition-all ${
                hasConfirmedBooking
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 hover:-translate-y-0.5"
                  : !isLoggedIn
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-0.5 shadow-lg shadow-indigo-100"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              {hasConfirmedBooking ? (
                <><PenLine size={14} /> Write a Review</>
              ) : !isLoggedIn ? (
                <><PenLine size={14} /> Log In to Write a Review</>
              ) : (
                <><Lock size={14} /> Write a Review</>
              )}
            </button>

            {/* Hint under button */}
            <p className="text-center text-[11px] text-slate-400 mb-5">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={redirectToLogin}
                    className="text-indigo-500 underline underline-offset-2 hover:text-indigo-700 font-semibold"
                  >
                    Log in
                  </button>{" "}
                  and enroll to write a review.
                </>
              ) : !hasConfirmedBooking ? (
                "Only students with a confirmed booking can write a review."
              ) : null}
            </p>

            {/* Review list — always rendered */}
            {reviewsLoading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="animate-spin text-indigo-500" />
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex gap-4 border-b border-slate-50 pb-5 last:border-none last:pb-0"
                  >
                    <img
                      src={review.studentAvatar || "https://via.placeholder.com/40"}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                      alt={review.studentName}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{review.studentName}</p>
                          <div className="flex text-amber-400 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                fill={i < review.rating ? "currentColor" : "none"}
                                strokeWidth={1}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-2 leading-relaxed text-sm italic">
                        "{review.comment}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-slate-400 text-sm italic">
                No reviews yet for this class.
              </p>
            )}
          </div>
        </div>

        {/* ════════════════ RIGHT SIDEBAR ════════════════ */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl p-6 sticky top-24">

            {/* Price */}
            <div className="pb-5 border-b border-slate-50 mb-5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Enrollment Fee
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-slate-900">${data.basePrice}</span>
                <span className="text-xs font-bold text-slate-400 uppercase">USD</span>
              </div>
            </div>

            {/* Enroll / Login CTA Button */}
            <Button
              className={`w-full py-7 text-xs font-black rounded-2xl tracking-[0.12em] uppercase mb-4 flex items-center justify-center gap-2 transition-all ${
                !isLoggedIn || selectedSchedule
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-100 hover:-translate-y-0.5"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
              disabled={loadingBook}
              onClick={handleEnrollClick}
            >
              {loadingBook ? (
                <Loader2 className="animate-spin" size={18} />
              ) : !isLoggedIn ? (
                <>Log In to Enroll <ChevronRight size={16} /></>
              ) : selectedSchedule ? (
                <>Enroll In Class <ChevronRight size={16} /></>
              ) : (
                "Choose a Session"
              )}
            </Button>

            {/* Info box */}
            <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex gap-2">
              <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 font-medium leading-tight">
                {isLoggedIn
                  ? "Tutor will contact you via Telegram to confirm payment and starting date."
                  : "Log in to enroll. Tutor will confirm payment and schedule via Telegram."}
              </p>
            </div>

            {/* Active students — visible to everyone */}
            <div className="mt-6 pt-5 border-t border-slate-50">
              <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                <UserCheck size={14} className="text-emerald-500" /> Active Students ({confirmedStudents.length})
              </h4>
              <div className="flex flex-wrap gap-3">
                {confirmedStudents.length > 0 ? (
                  confirmedStudents.map((student, index) => (
                    <div key={index} className="group relative flex flex-col items-center">
                      <img
                        src={student.avatar}
                        className="w-9 h-9 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100 object-cover"
                        alt={student.studentName}
                      />
                      <div className="absolute -bottom-7 bg-slate-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
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

      {/* ── Tutor Reviews Modal ── */}
      {showTutorModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-200">
            <div className="p-5 border-b flex justify-between items-center bg-slate-900 text-white">
              <div>
                <h3 className="font-black text-base uppercase tracking-tight">Tutor Portfolio</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                  Reviews for {data?.tutor?.name}
                </p>
              </div>
              <button
                onClick={() => setShowTutorModal(false)}
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {tutorReviewsLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="animate-spin text-indigo-500" size={36} />
                </div>
              ) : tutorReviews.length > 0 ? (
                tutorReviews.map((r) => (
                  <div key={r.id} className="pb-5 border-b border-slate-100 last:border-none">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-slate-900 text-sm">{r.studentName}</p>
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 italic">"{r.comment}"</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center py-16 text-slate-500 text-sm italic">
                  No feedback received yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Booking Sidebar ── */}
      <BookingSidebar
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        onNavigateLogin={redirectToLogin}
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