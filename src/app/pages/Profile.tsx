// app/tutor/profile/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import PortfolioEditor from "@/app/components/tutor/PortfolioEditor";
import { ProfileDetails } from "@/app/components/tutor/ProfileDetails";
import { ProfileSidebar } from "@/app/components/tutor/ProfileSidebar";
export default function TutorProfilePage() {
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const token = typeof document !== "undefined" ? document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1] : null;

  const fetchData = async () => {
    try {
      const res = await fetch(`https://toturhub-dev.onrender.com/api/v1/tutors/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTutor(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-12 px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* 1. Header Component */}
        <header className="bg-white rounded-[2.5rem] p-10 shadow-sm border flex justify-between items-center">
          <div className="flex items-center gap-10">
            <div className="relative">
              <img src={tutor?.profilePicture} className="w-36 h-36 rounded-[2.5rem] object-cover ring-8 ring-indigo-50" />
              <ShieldCheck className="absolute -bottom-2 -right-2 text-indigo-600 bg-white rounded-full p-1" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black">{tutor?.fullname}</h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Tutor ID: #{tutor?.tutorId}</p>
            </div>
          </div>
          <PortfolioEditor tutor={tutor} token={token || null} onRefresh={fetchData} />
        </header>

        {/* 2. Main Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <ProfileDetails tutor={tutor} />
          </div>
          <div className="lg:col-span-4">
            <ProfileSidebar tutor={tutor} />
          </div>
        </div>
      </div>
    </div>
  );
}