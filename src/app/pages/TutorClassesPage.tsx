"use client";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface PriceOption {
  label: string;
  price: number;
}

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
  priceOptions: PriceOption[];
  availableSlots: string[];
}

interface TutorClassesPageProps {
  tutorId: number;
}

export default function TutorClassesPage({ tutorId }: TutorClassesPageProps) {
  const [classes, setClasses] = useState<OpenClass[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof document !== "undefined"
      ? document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1]
      : null;

  const fetchClasses = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://toturhub-dev.onrender.com/api/v1/open-classes/tutor/${tutorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch classes");
      const data: OpenClass[] = await res.json();
      setClasses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [tutorId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (classes.length === 0) {
    return <p className="text-center mt-10 text-gray-500">No classes found</p>;
  }

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">My Classes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.classId}
            className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold">{cls.title}</h2>
            <p className="text-sm text-gray-500 my-2">{cls.description}</p>
            <p className="text-sm text-gray-600">
              Subjects: {cls.subjects.join(", ")}
            </p>
            <p className="text-sm text-gray-600">
              Mode: {cls.learningModes.join(", ")}
            </p>
            <p className="text-sm text-gray-600">
              Location: {cls.specificAddress}
            </p>
            <p className="text-sm text-gray-600">
              Price: ${cls.basePrice} (for 1 student)
            </p>
            <p className="text-sm text-gray-600">
              Students: {cls.currentStudents}/{cls.maxStudents}
            </p>
            <p className="mt-2 text-sm font-semibold text-indigo-600">
              Status: {cls.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}