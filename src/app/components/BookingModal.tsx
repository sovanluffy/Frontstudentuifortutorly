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
  tutorId: number;
  tutorName: string;
  tutorRating: number;
  location: string;
  specificAddress: string;
  subjects: string[];
  learningModes: string[];
  basePrice: number;
  maxStudents: number;
  currentStudents: number;
  classImage: string | null;
  schedules: Schedule[];
}

/* ================= COMPONENT ================= */

export default function ClassDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<ClassDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetch(
      `https://toturhub-dev.onrender.com/api/v1/open-classes/${id}`
    )
      .then((res) => res.json())
      .then(setData)
      .catch(() => console.error("Fetch error"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSuccess(true);
    }, 1200);
  };

  /* ================= HELPERS ================= */

  const formatTime = (t: string) => t?.slice(0, 5);
  const safe = <T,>(arr: T[] | null | undefined): T[] => arr ?? [];

  /* ================= STATES ================= */

  if (loading)
    return (
      <div className="p-20 text-center text-gray-500">
        Loading class...
      </div>
    );

  if (!data)
    return (
      <div className="p-20 text-center text-red-500">
        Class not found
      </div>
    );

  const d: ClassDetails = {
    ...data,
    subjects: data.subjects ?? [],
    learningModes: data.learningModes ?? [],
    schedules: data.schedules ?? [],
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 font-medium"
        >
          <ChevronLeft size={20} /> Back
        </button>

        <div className="grid lg:grid-cols-12 gap-10">

          {/* LEFT */}
          <div className="lg:col-span-7 space-y-6">

            <img
              src={
                d.classImage ||
                "https://via.placeholder.com/800x500?text=No+Image"
              }
              alt={d.title}
              className="w-full h-96 object-cover rounded-3xl border"
            />

            <div className="flex gap-2 flex-wrap">
              <span className="bg-green-500 text-white px-3 py-1 rounded-xl text-xs font-black uppercase">
                {d.status}
              </span>

              {safe(d.learningModes).map((m) => (
                <span
                  key={m}
                  className="bg-white text-blue-600 px-3 py-1 rounded-xl text-xs font-black uppercase"
                >
                  {m}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-black uppercase">
              {d.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              {safe(d.subjects).map((s) => (
                <span
                  key={s}
                  className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase"
                >
                  {s}
                </span>
              ))}
            </div>

            <p className="text-gray-600">{d.description}</p>

            <div className="bg-white p-5 rounded-2xl border">
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={18} className="text-pink-500" />
                <span className="text-xs font-black uppercase">
                  Location
                </span>
              </div>

              <p className="font-black text-lg">
                {d.specificAddress}
              </p>
              <p className="text-gray-500">{d.location}</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5">
            <div className="sticky top-10 bg-white p-8 rounded-3xl shadow-xl space-y-8">

              {/* PRICE */}
              <div className="flex justify-between">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase">
                    Price
                  </p>
                  <p className="text-4xl font-black text-blue-600">
                    ${d.basePrice.toFixed(2)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-gray-400 uppercase">
                    Enrolled
                  </p>
                  <p className="text-2xl font-black">
                    {d.currentStudents}/{d.maxStudents}
                  </p>
                </div>
              </div>

              {/* SCHEDULE */}
              <div>
                <h3 className="text-xs font-black uppercase flex items-center gap-2 mb-3">
                  <Calendar size={16} /> Schedule
                </h3>

                {safe(d.schedules).map((s, i) => (
                  <div
                    key={i}
                    className="flex justify-between bg-blue-50 p-3 rounded-xl mb-2"
                  >
                    <span className="font-black">{s.day}</span>
                    <span className="flex items-center gap-2 text-blue-600 font-bold">
                      <Clock size={14} />
                      {formatTime(s.startTime)} -{" "}
                      {formatTime(s.endTime)}
                    </span>
                  </div>
                ))}
              </div>

              {/* TUTOR */}
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <User size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase">
                      Tutor
                    </p>
                    <p className="font-bold">{d.tutorName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-black">
                    {d.tutorRating || "New"}
                  </span>
                </div>
              </div>

              {/* BUTTON */}
              <Button
                onClick={() => setIsBookingOpen(true)}
                disabled={d.status !== "OPEN"}
                className="w-full h-14 bg-blue-600 text-white font-black uppercase rounded-2xl"
              >
                {d.status === "OPEN"
                  ? "Secure My Spot"
                  : "Class Full"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {isBookingOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl">

            <div className="p-6 flex justify-between">
              <div>
                <h2 className="text-xl font-black">Booking</h2>
                <p className="text-sm text-gray-500">{d.title}</p>
              </div>

              <button
                onClick={() => {
                  setIsBookingOpen(false);
                  setBookingSuccess(false);
                }}
              >
                <X />
              </button>
            </div>

            <div className="p-6">

              {!bookingSuccess ? (
                <form onSubmit={handleBookingSubmit} className="space-y-4">

                  <input
                    required
                    placeholder="Full Name"
                    className="w-full p-3 bg-gray-50 rounded-xl"
                  />

                  <input
                    required
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 bg-gray-50 rounded-xl"
                  />

                  <textarea
                    placeholder="Notes"
                    className="w-full p-3 bg-gray-50 rounded-xl h-20"
                  />

                  <Button className="w-full bg-blue-600 text-white h-12 uppercase font-black">
                    {isSubmitting
                      ? "Processing..."
                      : `Pay $${d.basePrice.toFixed(2)}`}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-10">
                  <CheckCircle2
                    size={50}
                    className="text-green-500 mx-auto"
                  />
                  <h3 className="text-xl font-black mt-3">
                    Success!
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Booking confirmed
                  </p>

                  <Button
                    onClick={() => setIsBookingOpen(false)}
                    className="mt-5 bg-black text-white"
                  >
                    Close
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