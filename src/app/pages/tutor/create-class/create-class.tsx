"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Trash2, Plus, Calendar, Clock, Users, MapPin, BookOpen, Monitor, Home, School, Map } from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */
interface Subject {
  id: number;
  name: string;
}

interface Location {
  locationId: number;
  city: string;
  district: string;
  fullAddress: string;
}

interface DayTimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
}

/* ================= PAGE ================= */
export default function CreateOpenClassPage() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [title, setTitle] = useState("Java Spring Boot Masterclass");
  const [description, setDescription] = useState("A comprehensive course on building REST APIs.");
  const [status, setStatus] = useState("OPEN");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [subjectIds, setSubjectIds] = useState<number[]>([1, 5, 12]);
  const [locationId, setLocationId] = useState<number | null>(101);
  const [specificAddress, setSpecificAddress] = useState("Room 302, Tech Hub Plaza");
  const [basePrice, setBasePrice] = useState(150.00);
  const [maxStudents, setMaxStudents] = useState(30);

  // LEARNING MODES (Matching your Java Enum)
  const [learningModes, setLearningModes] = useState<string[]>(["ONLINE", "TUTOR_CLASS"]);
  
  const [startDate, setStartDate] = useState("2026-05-01T09:00");
  const [durationType, setDurationType] = useState("WEEKS");
  const [durationValue, setDurationValue] = useState(4);

  const [dayTimeSlots, setDayTimeSlots] = useState<DayTimeSlot[]>([
    { day: "MONDAY", startTime: "09:00", endTime: "11:00", maxStudents: 15 },
    { day: "WEDNESDAY", startTime: "14:00", endTime: "16:00", maxStudents: 15 },
  ]);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = typeof document !== "undefined"
    ? document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1]
    : null;

  /* ================= HANDLERS ================= */
  const toggleLearningMode = (mode: string) => {
    setLearningModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (preview) URL.revokeObjectURL(preview);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  const addSlot = () => {
    setDayTimeSlots([...dayTimeSlots, { day: "MONDAY", startTime: "09:00", endTime: "11:00", maxStudents: 15 }]);
  };

  const updateSlot = (index: number, field: keyof DayTimeSlot, value: any) => {
    const updatedSlots = [...dayTimeSlots];
    (updatedSlots[index] as any)[field] = value;
    setDayTimeSlots(updatedSlots);
  };

  const removeSlot = (index: number) => {
    setDayTimeSlots(dayTimeSlots.filter((_, i) => i !== index));
  };

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetch("https://toturhub-dev.onrender.com/api/subjects")
      .then((r) => r.json())
      .then(setSubjects);

    fetch("https://toturhub-dev.onrender.com/api/v1/locations")
      .then((r) => r.json())
      .then(setLocations);
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!token) return toast.error("Log in required");
    if (learningModes.length === 0) return toast.error("Select at least one Learning Mode");
    if (!locationId) return toast.error("Please select a location");

    setLoading(true);

    try {
      const formData = new FormData();

      // PAYLOAD (Matching your backend OpenClass entity)
      const payload = {
        title,
        description,
        subjectIds,
        status,
        locationId,
        specificAddress,
        basePrice,
        maxStudents,
        learningModes,
        durationType,
        durationValue,
        startDate: startDate.includes("T") ? startDate : `${startDate}:00`,
        dayTimeSlots,
      };

      formData.append("data", JSON.stringify(payload));
      if (image) formData.append("image", image);

      const res = await fetch("https://toturhub-dev.onrender.com/api/v1/open-classes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        toast.success("Class published successfully!");
        setTimeout(() => navigate("/profile"), 1000);
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Failed to create class");
      }
    } catch (err) {
      toast.error("Network error. Please check your server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4">
      <div className="bg-white w-full max-w-4xl h-[92vh] rounded-3xl shadow-xl border flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="p-6 border-b shrink-0 bg-white">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Create Open Class</h1>
          <p className="text-sm text-gray-500 font-medium">Java Spring Boot Masterclass Configuration</p>
        </div>

        {/* SCROLLABLE FORM */}
        <div className="p-8 space-y-8 overflow-y-auto flex-1 bg-white">
          
          {/* LEARNING MODES SECTION */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
              <Monitor size={20} /> Learning Modes
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: "ONLINE", label: "Online", icon: <Monitor size={18} /> },
                { id: "STUDENT_HOME", label: "Student Home", icon: <Home size={18} /> },
                { id: "TUTOR_CLASS", label: "Tutor Class", icon: <School size={18} /> },
                { id: "OUTSIDE", label: "Outside", icon: <Map size={18} /> },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => toggleLearningMode(mode.id)}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all gap-2 ${
                    learningModes.includes(mode.id)
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-gray-100 text-gray-400 hover:border-blue-200"
                  }`}
                >
                  {mode.icon}
                  <span className="text-xs font-bold uppercase">{mode.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* BASIC INFO */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
              <BookOpen size={20} /> Course Details
            </h3>
            <input
              className="w-full border-2 p-4 rounded-2xl outline-none focus:border-blue-600 font-medium transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Class Title"
            />
            <textarea
              className="w-full border-2 p-4 rounded-2xl outline-none focus:border-blue-600 transition-all"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed course description..."
            />
          </section>

          {/* TIMING & CAPACITY */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2"><Calendar size={20} /> Schedule</h3>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Start Date</label>
                <input type="datetime-local" className="w-full border-2 p-3 rounded-xl bg-gray-50" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" className="border-2 p-3 rounded-xl" value={durationValue} onChange={(e) => setDurationValue(Number(e.target.value))} />
                <select className="border-2 p-3 rounded-xl bg-white" value={durationType} onChange={(e) => setDurationType(e.target.value)}>
                  <option value="WEEKS">Weeks</option>
                  <option value="DAYS">Days</option>
                  <option value="MONTHS">Months</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2"><Users size={20} /> Capacity & Fee</h3>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Price ($)</label>
                <input type="number" className="w-full border-2 p-3 rounded-xl" value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Total Capacity</label>
                <input type="number" className="w-full border-2 p-3 rounded-xl" value={maxStudents} onChange={(e) => setMaxStudents(Number(e.target.value))} />
              </div>
            </div>
          </section>

          {/* LOCATION & SUBJECTS */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2"><MapPin size={20} /> Venue & Subject</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="border-2 p-3 rounded-xl bg-white" value={locationId ?? ""} onChange={(e) => setLocationId(Number(e.target.value))}>
                <option value="">Select Location</option>
                {locations.map(l => <option key={l.locationId} value={l.locationId}>{l.city} - {l.district}</option>)}
              </select>
              <input className="border-2 p-3 rounded-xl" value={specificAddress} onChange={(e) => setSpecificAddress(e.target.value)} placeholder="Room / Street Address" />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {subjects.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSubjectIds(prev => prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id])}
                  className={`px-4 py-2 rounded-full border-2 text-xs font-black transition-all ${subjectIds.includes(s.id) ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white text-gray-500 hover:border-blue-300'}`}
                >
                  {s.name.toUpperCase()}
                </button>
              ))}
            </div>
          </section>

          {/* WEEKLY SLOTS */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-blue-700">Weekly Time Slots</h3>
              <Button onClick={addSlot} variant="outline" className="rounded-xl border-2 font-bold">+ ADD SLOT</Button>
            </div>
            <div className="space-y-3">
              {dayTimeSlots.map((slot, i) => (
                <div key={i} className="flex flex-wrap md:flex-nowrap items-center gap-3 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                  <select className="border-2 p-2 rounded-xl bg-white font-bold text-xs" value={slot.day} onChange={(e) => updateSlot(i, "day", e.target.value)}>
                    {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <div className="flex items-center gap-2 bg-white border-2 rounded-xl p-2 grow">
                    <Clock size={14} className="text-gray-400" />
                    <input type="time" className="outline-none text-xs font-bold" value={slot.startTime} onChange={(e) => updateSlot(i, "startTime", e.target.value)} />
                    <span className="text-gray-300">-</span>
                    <input type="time" className="outline-none text-xs font-bold" value={slot.endTime} onChange={(e) => updateSlot(i, "endTime", e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2 bg-white border-2 rounded-xl p-2">
                    <Users size={14} className="text-gray-400" />
                    <input type="number" className="w-12 outline-none text-xs font-bold" value={slot.maxStudents} onChange={(e) => updateSlot(i, "maxStudents", Number(e.target.value))} />
                  </div>
                  <button onClick={() => removeSlot(i)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
          </section>

          {/* COVER IMAGE */}
          <section className="space-y-4 pb-4">
            <h3 className="text-lg font-bold text-blue-700">Cover Poster</h3>
            <div className="border-4 border-dashed border-gray-100 rounded-3xl p-12 text-center bg-gray-50 relative hover:bg-gray-100 transition-all cursor-pointer">
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageChange(e.target.files?.[0] || null)} />
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Click to upload poster</p>
            </div>
            {preview && (
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                <img src={preview} className="w-full h-80 object-cover" alt="Preview" />
                <button onClick={() => handleImageChange(null)} className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:scale-110 transition-transform">✕</button>
              </div>
            )}
          </section>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="p-6 border-t bg-white shrink-0">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-2xl text-xl font-black shadow-xl shadow-blue-100 transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "PUBLISH MASTERCLASS"}
          </Button>
        </div>

      </div>
    </div>
  );
}