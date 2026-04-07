"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";
import { toast } from "sonner";

interface TimeRange {
  startTime: string;
  endTime: string;
}

interface Schedule {
  scheduleType: "weekly" | "special-session";
  startDate: string;
  endDate: string;
  timeRanges: TimeRange[];
}

export default function CreateClassPage() {
  // Pre-fill state with your JSON data
  const [title, setTitle] = useState("Intro to Algebra");
  const [description, setDescription] = useState(
    "A beginner-friendly course covering basic algebra concepts, equations, and functions."
  );
  const [subjectIds, setSubjectIds] = useState<number[]>([1, 2]);
  const [learningModes, setLearningModes] = useState<string[]>(["ONLINE"]);
  const [locationId, setLocationId] = useState(1);
  const [specificAddress, setSpecificAddress] = useState(
    "123 Main Street, Phnom Penh, Cambodia"
  );
  const [basePrice, setBasePrice] = useState(50);
  const [maxStudents, setMaxStudents] = useState(20);
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      scheduleType: "weekly",
      startDate: "2026-04-10",
      endDate: "2026-06-30",
      timeRanges: [
        { startTime: "09:00", endTime: "11:00" },
        { startTime: "14:00", endTime: "16:00" },
      ],
    },
    {
      scheduleType: "special-session",
      startDate: "2026-05-15",
      endDate: "2026-05-15",
      timeRanges: [{ startTime: "10:00", endTime: "12:00" }],
    },
  ]);

  const [loading, setLoading] = useState(false);

  const token =
    typeof document !== "undefined"
      ? document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1]
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("No auth token found");
    if (!title || !description) return toast.error("Title and description are required");

    setLoading(true);
    try {
      const res = await fetch("https://toturhub-dev.onrender.com/api/v1/open-classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          subjectIds,
          learningModes,
          locationId,
          specificAddress,
          basePrice,
          maxStudents,
          schedules,
        }),
      });

      if (res.ok) {
        toast.success("Class created successfully!");
        handleReset();
      } else {
        toast.error("Failed to create class");
      }
    } catch (err) {
      toast.error("Connection error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle("Intro to Algebra");
    setDescription(
      "A beginner-friendly course covering basic algebra concepts, equations, and functions."
    );
    setSubjectIds([1, 2]);
    setLearningModes(["ONLINE"]);
    setLocationId(1);
    setSpecificAddress("123 Main Street, Phnom Penh, Cambodia");
    setBasePrice(50);
    setMaxStudents(20);
    setSchedules([
      {
        scheduleType: "weekly",
        startDate: "2026-04-10",
        endDate: "2026-06-30",
        timeRanges: [
          { startTime: "09:00", endTime: "11:00" },
          { startTime: "14:00", endTime: "16:00" },
        ],
      },
      {
        scheduleType: "special-session",
        startDate: "2026-05-15",
        endDate: "2026-05-15",
        timeRanges: [{ startTime: "10:00", endTime: "12:00" }],
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-6 px-2">
      <div className="bg-white w-full max-w-2xl p-6 rounded-xl border border-gray-200">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Create New Class</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 outline-none text-sm"
              placeholder="Class title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 outline-none text-sm"
              rows={3}
              placeholder="Class description"
              required
            />
          </div>

          {/* Subjects & Learning Modes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Subjects</label>
              <input
                type="text"
                value={subjectIds.join(",")}
                onChange={(e) =>
                  setSubjectIds(e.target.value.split(",").map((id) => Number(id.trim())))
                }
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-1 focus:ring-indigo-400 outline-none text-sm"
                placeholder="e.g., 1,2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Learning Modes</label>
              <input
                type="text"
                value={learningModes.join(",")}
                onChange={(e) =>
                  setLearningModes(e.target.value.split(",").map((mode) => mode.trim()))
                }
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-1 focus:ring-indigo-400 outline-none text-sm"
                placeholder="e.g., ONLINE, OFFLINE"
              />
            </div>
          </div>

          {/* Location & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Location ID</label>
              <input
                type="number"
                value={locationId}
                onChange={(e) => setLocationId(Number(e.target.value))}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-1 focus:ring-indigo-400 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Address</label>
              <input
                type="text"
                value={specificAddress}
                onChange={(e) => setSpecificAddress(e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-1 focus:ring-indigo-400 outline-none text-sm"
              />
            </div>
          </div>

          {/* Price & Max Students */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Base Price ($)</label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-1 focus:ring-indigo-400 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Max Students</label>
              <input
                type="number"
                value={maxStudents}
                onChange={(e) => setMaxStudents(Number(e.target.value))}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-1 focus:ring-indigo-400 outline-none text-sm"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-4 py-1.5 rounded-full"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-full flex items-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin h-4 w-4" />}
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}