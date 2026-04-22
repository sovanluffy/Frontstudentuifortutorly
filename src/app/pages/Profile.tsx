"use client";

import React, { useState, useEffect } from "react";
import { Loader2, ShieldCheck, MapPin, User, BookOpen } from "lucide-react"; // Added icons
import PortfolioEditor from "@/app/pages/tutor/PortfolioEditor";
import ProfilePublish from "@/app/pages/tutor/ProfilePublish";
import { ProfileDetails } from "@/app/pages/tutor/ProfileDetails";
import { ProfileSidebar } from "@/app/pages/tutor/ProfileSidebar";
import CreateClassPage from "@/app/pages/tutor/create-class/create-class";
import { Button } from "@/app/components/figma/ui/button";

interface OpenClass {
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
  classImage?: string; // ✅ Added classImage to Interface
  priceOptions: { label: string; price: number }[];
  availableSlots: string[];
}

export default function TutorProfilePage() {
  const [tutor, setTutor] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [classes, setClasses] = useState<OpenClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateClass, setShowCreateClass] = useState(false);

  // Get token from cookies
  const token =
    typeof document !== "undefined"
      ? document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1]
      : null;

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  };

  const decodedToken = token ? parseJwt(token) : null;
  const roles = decodedToken?.roles || [];
  const isTutor = roles.includes("TUTOR");
  const isStudent = roles.includes("STUDENT");

  const fetchTutor = async () => {
    if (!token) return;
    try {
      const res = await fetch(`https://toturhub-dev.onrender.com/api/v1/tutors/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTutor(data);
      return data.tutorId;
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClasses = async (tutorId: number) => {
    if (!token) return;
    try {
      const res = await fetch(
        `https://toturhub-dev.onrender.com/api/v1/open-classes/tutor/${tutorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data: OpenClass[] = await res.json();
      setClasses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudentProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch(`https://toturhub-dev.onrender.com/api/v1/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudent(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    if (isTutor) {
      const tutorId = await fetchTutor();
      if (tutorId) await fetchClasses(tutorId);
    }
    if (isStudent) {
      await fetchStudentProfile();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={isTutor ? tutor?.profilePicture : student?.avatarUrl}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover border"
              />
              <ShieldCheck
                className="absolute -bottom-1 -right-1 text-indigo-600 bg-white rounded-full p-1 shadow"
                size={24}
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {isTutor ? tutor?.fullname : student?.fullname}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                ID #{isTutor ? tutor?.tutorId : student?.userId}
              </p>
            </div>
          </div>

          {isTutor && (
            <div className="flex flex-wrap gap-3">
              <PortfolioEditor tutor={tutor} token={token || null} onRefresh={fetchData} />
              <ProfilePublish
                token={token || null}
                initialPublished={tutor?.public || false}
                onRefresh={() => {
                  setTutor((prev: any) => (prev ? { ...prev, public: !prev.public } : prev));
                  fetchData();
                }}
              />
              <Button
                onClick={() => setShowCreateClass(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5"
              >
                + Create Class
              </Button>
            </div>
          )}
        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {isTutor && (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <ProfileDetails tutor={tutor} />
                </div>

                {/* MY CLASSES SECTION */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <h2 className="text-lg font-semibold text-slate-900 mb-6"> My Classes </h2>

                  {classes.length === 0 ? (
                    <p className="text-slate-400 text-sm">You haven’t created any classes yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                      {classes.map((cls) => (
                        <div
                          key={cls.classId}
                          className="group flex flex-col sm:flex-row border border-slate-100 rounded-3xl p-4 gap-5 transition-all hover:shadow-md bg-white"
                        >
                          {/* ✅ CLASS IMAGE SECTION */}
                          <div className="w-full sm:w-40 h-32 bg-slate-100 rounded-2xl overflow-hidden relative flex-shrink-0">
                            {cls.classImage ? (
                              <img
                                src={cls.classImage}
                                alt={cls.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 uppercase font-bold bg-slate-50">
                                No Image
                              </div>
                            )}
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                              {cls.status}
                            </div>
                          </div>

                          {/* CLASS CONTENT */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold text-slate-900 truncate text-lg uppercase leading-tight">
                                  {cls.title}
                                </h3>
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                                {cls.description}
                              </p>

                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {cls.subjects.map((sub, i) => (
                                  <span key={i} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg font-bold">
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                                <span className="flex items-center gap-1"> <MapPin size={12} className="text-rose-500"/> {cls.location} </span>
                                <span className="flex items-center gap-1"> <User size={12} className="text-orange-400"/> {cls.tutorName} </span>
                            </div>
                          </div>

                          {/* PRICING & STATS */}
                          <div className="sm:w-32 flex flex-col justify-between items-end border-l border-slate-50 pl-4">
                            <div className="text-right">
                                <span className="text-xl font-bold text-indigo-600">${cls.basePrice}</span>
                                <p className="text-[10px] text-slate-400 mt-1">{cls.currentStudents}/{cls.maxStudents} Students</p>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs border-slate-200">
                                Edit Class
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {isStudent && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-3">
                <h2 className="text-lg font-semibold text-slate-900">Student Profile</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
                  <p><strong>Email:</strong> {student?.email}</p>
                  <p><strong>Phone:</strong> {student?.phone}</p>
                  <p><strong>City:</strong> {student?.city}</p>
                  <p><strong>District:</strong> {student?.district}</p>
                  <p className="sm:col-span-2"><strong>Address:</strong> {student?.fullAddress}</p>
                  <p><strong>Status:</strong> {student?.status}</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            {isTutor && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border">
                <ProfileSidebar tutor={tutor} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE CLASS MODAL */}
      {showCreateClass && isTutor && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-16 z-50">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4">
            <CreateClassPage />
            <button
              onClick={() => setShowCreateClass(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}