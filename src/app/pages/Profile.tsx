"use client";

import React, { useState, useEffect } from "react";
import { Loader2, ShieldCheck, MapPin, User, BookOpen } from "lucide-react";
import PortfolioEditor from "@/app/pages/tutor/PortfolioEditor";
import ProfilePublish from "@/app/pages/tutor/ProfilePublish";
import { ProfileDetails } from "@/app/pages/tutor/ProfileDetails";
import { ProfileSidebar } from "@/app/pages/tutor/ProfileSidebar";
import CreateClassPage from "@/app/pages/tutor/create-class/create-class";
import { Button } from "@/app/components/figma/ui/button";

/* ✅ IMPORT API */
import { API_BASE } from "@/app/api/config";

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
  classImage?: string;
  priceOptions: { label: string; price: number }[];
  availableSlots: string[];
}

export default function TutorProfilePage() {
  const [tutor, setTutor] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [classes, setClasses] = useState<OpenClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateClass, setShowCreateClass] = useState(false);

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

  /* ================= API ================= */

  const fetchTutor = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/tutors/me`, {
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
        `${API_BASE}/open-classes/tutor/${tutorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
      const res = await fetch(`${API_BASE}/profile`, {
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

                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <h2 className="text-lg font-semibold text-slate-900 mb-6"> My Classes </h2>

                  {classes.length === 0 ? (
                    <p className="text-slate-400 text-sm">You haven’t created any classes yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                      {classes.map((cls) => (
                        <div key={cls.classId} className="group flex flex-col sm:flex-row border border-slate-100 rounded-3xl p-4 gap-5 transition-all hover:shadow-md bg-white">
                          <div className="w-full sm:w-40 h-32 bg-slate-100 rounded-2xl overflow-hidden relative flex-shrink-0">
                            {cls.classImage ? (
                              <img src={cls.classImage} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No Image</div>
                            )}
                          </div>

                          <div className="flex-1">
                            <h3 className="font-bold">{cls.title}</h3>
                            <p className="text-sm">{cls.description}</p>
                          </div>

                          <div>
                            <span>${cls.basePrice}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-4">
            {isTutor && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border">
                <ProfileSidebar tutor={tutor} />
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateClass && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <CreateClassPage />
        </div>
      )}
    </div>
  );
}