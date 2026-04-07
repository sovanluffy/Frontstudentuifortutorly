"use client";

import React, { useState, useEffect } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import PortfolioEditor from "@/app/components/tutor/PortfolioEditor";
import ProfilePublish from "@/app/components/tutor/ProfilePublish";
import { ProfileDetails } from "@/app/components/tutor/ProfileDetails";
import { ProfileSidebar } from "@/app/components/tutor/ProfileSidebar";
import CreateClassPage from "@/app/components/tutor/create-class/create-class"; // your create class component
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
  priceOptions: { label: string; price: number }[];
  availableSlots: string[];
}

export default function TutorProfilePage() {
  const [tutor, setTutor] = useState<any>(null);
  const [classes, setClasses] = useState<OpenClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateClass, setShowCreateClass] = useState(false);

  // Read token from cookies
  const token =
    typeof document !== "undefined"
      ? document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1]
      : null;

  // Decode JWT to check roles
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
  const isTutor = decodedToken?.roles?.includes("TUTOR");

  // Fetch tutor profile
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

  // Fetch tutor classes
  const fetchClasses = async (tutorId: number) => {
    if (!token) return;
    try {
      const res = await fetch(
        `https://toturhub-dev.onrender.com/api/v1/open-classes/tutor/${tutorId}`,
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

  // Load both tutor & classes
  const fetchData = async () => {
    setLoading(true);
    const tutorId = await fetchTutor();
    if (tutorId) await fetchClasses(tutorId);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* LOADING */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8F9FB]">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-6 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <header className="bg-white rounded-2xl p-5 shadow-sm border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <img
                src={tutor?.profilePicture}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <ShieldCheck
                className="absolute -bottom-1 -right-1 text-indigo-600 bg-white rounded-full p-[2px]"
                size={18}
              />
            </div>

            {/* Info */}
            <div>
              <h1 className="text-lg font-semibold text-slate-900">{tutor?.fullname}</h1>
              <p className="text-xs text-slate-400">ID #{tutor?.tutorId}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-2 justify-end">
            <PortfolioEditor tutor={tutor} token={token || null} onRefresh={fetchData} />
            <ProfilePublish
              token={token || null}
              initialPublished={tutor?.isPublished || false}
              onRefresh={fetchData}
            />
            {isTutor && (
              <Button
                onClick={() => setShowCreateClass(true)}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2 rounded-full"
              >
                + Create Class
              </Button>
            )}
          </div>
        </header>

        {/* BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-6">
            <ProfileDetails tutor={tutor} />

            {/* Classes Section */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">My Classes</h2>
              {classes.length === 0 ? (
                <p className="text-gray-500">No classes available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classes.map((cls) => (
                    <div
                      key={cls.classId}
                      className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
                    >
                      <h3 className="font-semibold text-lg">{cls.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{cls.description}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Subjects: {cls.subjects.join(", ")}
                      </p>
                      <p className="text-sm text-gray-600">
                        Mode: {cls.learningModes.join(", ")}
                      </p>
                      <p className="text-sm text-gray-600">
                        Location: {cls.specificAddress}
                      </p>
                      <p className="text-sm text-gray-600">Price: ${cls.basePrice}</p>
                      <p className="text-sm text-gray-600">
                        Students: {cls.currentStudents}/{cls.maxStudents}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-indigo-600">
                        Status: {cls.status}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <ProfileSidebar tutor={tutor} />
          </div>
        </div>
      </div>

      {/* CREATE CLASS MODAL */}
      {showCreateClass && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-10 px-4">
          <div className="relative w-full max-w-2xl">
            <CreateClassPage />
            <button
              onClick={() => setShowCreateClass(false)}
              className="absolute top-2 right-2 text-gray-500 text-xl font-bold hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}