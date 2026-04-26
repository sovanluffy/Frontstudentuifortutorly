"use client";

import React, { useState, useEffect } from "react";
import { Loader2, ShieldCheck, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";
import PortfolioEditor from "@/app/pages/tutor/PortfolioEditor";
import ProfilePublish from "@/app/pages/tutor/ProfilePublish";
import { ProfileDetails } from "@/app/pages/tutor/ProfileDetails";
import { ProfileSidebar } from "@/app/pages/tutor/ProfileSidebar";
import CreateClassPage from "@/app/pages/tutor/create-class/create-class";
import { Button } from "@/app/components/figma/ui/button";

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
  basePrice: number;
  maxStudents: number;
  currentStudents: number;
  classImage?: string;
}

export default function TutorProfilePage() {
  const [tutor, setTutor] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [classes, setClasses] = useState<OpenClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [showCreateClass, setShowCreateClass] = useState(false);

  // Helper to get token
  const getCookieToken = () => {
    if (typeof document === "undefined") return null;
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1] || null;
  };

  const token = getCookieToken();

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

  /* ================= FETCH FUNCTIONS ================= */

  const fetchTutor = async () => {
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/tutors/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch tutor");
      const data = await res.json();
      setTutor(data);
      return data.tutorId;
    } catch (err) {
      console.error("Fetch tutor error:", err);
      return null;
    }
  };

  const fetchClasses = async (tutorId: number) => {
    if (!token || !tutorId) return;
    try {
      const res = await fetch(`${API_BASE}/open-classes/tutor/${tutorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setClasses(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Fetch classes error:", err);
    }
  };

  const fetchStudentProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStudent(data);
      }
    } catch (err) {
      console.error("Fetch student profile error:", err);
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

  /* ================= ACTION FUNCTIONS ================= */

  const handleRequestTutor = async () => {
    if (!token) return;
    setRequestLoading(true);
    try {
      const res = await fetch(`${API_BASE}/profile/request-tutor`, {
        method: "POST",
        headers: { 
          "accept": "*/*",
          "Authorization": `Bearer ${token}` 
        },
        body: ""
      });

      if (res.ok) {
        const data = await res.json();
        // Save the new token received from response to cookies
        if (data.token) {
          document.cookie = `token=${data.token}; path=/; max-age=86400`;
          // Refresh to apply new roles
          window.location.reload();
        }
      } else {
        alert("Failed to submit tutor request.");
      }
    } catch (err) {
      console.error("Request tutor error:", err);
    } finally {
      setRequestLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-all">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={isTutor ? tutor?.profilePicture || tutor?.avatar : student?.avatarUrl || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow border">
                <ShieldCheck className="text-indigo-600" size={20} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {isTutor ? tutor?.fullname : student?.fullname || "Student"}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {isTutor ? "Tutor Account" : "Student Account"}
                </span>
                <span className="text-xs text-slate-400">• ID #{isTutor ? tutor?.tutorId : student?.userId}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {isTutor ? (
              <>
                <PortfolioEditor tutor={tutor} token={token} onRefresh={fetchData} />
                <ProfilePublish
                  token={token}
                  initialPublished={tutor?.public || false}
                  onRefresh={() => {
                    setTutor((prev: any) => prev ? { ...prev, public: !prev.public } : prev);
                    fetchData();
                  }}
                />
                <Button
                  onClick={() => setShowCreateClass(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 font-bold shadow-lg shadow-indigo-200"
                >
                  + Create Class
                </Button>
              </>
            ) : (
              <Button
                onClick={handleRequestTutor}
                disabled={requestLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 font-bold flex items-center gap-2"
              >
                {requestLoading ? <Loader2 className="animate-spin" size={18} /> : <GraduationCap size={18} />}
                Become a Tutor
              </Button>
            )}
          </div>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            
            {/* TUTOR VIEW */}
            {isTutor && tutor && (
              <>
                <div className="bg-white rounded-2xl p-8 shadow-sm border">
                  <ProfileDetails tutor={tutor} />
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold text-slate-900">My Classes</h2>
                    <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {classes.length} Active
                    </span>
                  </div>
                  
                  {classes.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                       <p className="text-slate-400 text-sm">You haven’t created any classes yet.</p>
                       <Button variant="link" className="text-indigo-600 mt-2" onClick={() => setShowCreateClass(true)}>
                         Create your first class now <ArrowRight size={14} className="ml-1" />
                       </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {classes.map((cls) => (
                        <div key={cls.classId} className="group border border-slate-100 rounded-3xl p-6 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all flex justify-between items-center">
                          <div>
                            <h3 className="font-extrabold text-lg text-slate-800">{cls.title}</h3>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-1">{cls.description}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                                ${cls.basePrice}
                              </span>
                              <span className="text-slate-400 text-xs flex items-center gap-1">
                                <CheckCircle2 size={14} /> {cls.currentStudents}/{cls.maxStudents} Slots
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" className="rounded-full w-10 h-10 p-0 group-hover:bg-indigo-600 group-hover:text-white">
                            <ArrowRight size={18} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* STUDENT ONLY VIEW */}
            {isStudent && !isTutor && student && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-xl font-bold text-slate-900">Student Profile</h2>
                   <Button variant="outline" className="rounded-xl border-slate-200 text-xs">Edit Profile</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</p>
                      <p className="text-slate-700 font-medium">{student.fullname}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Address</p>
                      <p className="text-slate-700 font-medium">{student.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone Number</p>
                      <p className="text-slate-700 font-medium">{student.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Home Location</p>
                      <p className="text-slate-700 font-medium">{student.fullAddress || "Address not set"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4">
            {isTutor && tutor ? (
              <div className="bg-white rounded-2xl p-5 shadow-sm border sticky top-6">
                <ProfileSidebar tutor={tutor} />
              </div>
            ) : (
              <div className="bg-indigo-600 rounded-3xl p-8 text-white sticky top-6 overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3">Want to share your knowledge?</h3>
                  <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                    Join our community of elite tutors. Create classes, set your own prices, and help students reach their goals.
                  </p>
                  <Button 
                    onClick={handleRequestTutor}
                    className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-2xl py-6"
                  >
                    Get Started Now
                  </Button>
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-indigo-500 rounded-full blur-2xl opacity-50"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE CLASS MODAL */}
      {showCreateClass && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setShowCreateClass(false)}
              className="absolute top-6 right-6 z-50 bg-slate-100 hover:bg-slate-200 p-2 rounded-full text-slate-500 transition-colors"
            >
              ✕
            </button>
            <div className="overflow-y-auto h-full p-4">
               <CreateClassPage />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}