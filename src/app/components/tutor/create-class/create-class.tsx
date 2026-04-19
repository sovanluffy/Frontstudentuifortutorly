"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
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
}

/* ================= PAGE ================= */
export default function CreateOpenClassPage() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [title, setTitle] = useState("Math Class for Grade 10");
  const [description, setDescription] = useState(
    "Basic to advanced algebra lessons"
  );

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [subjectIds, setSubjectIds] = useState<number[]>([]);
  const [locationId, setLocationId] = useState<number | null>(null);

  const [status, setStatus] = useState("OPEN");

  const [specificAddress, setSpecificAddress] = useState(
    "Street 123, Phnom Penh"
  );

  const [basePrice, setBasePrice] = useState(15.5);
  const [maxStudents, setMaxStudents] = useState(10);

  const [learningModes] = useState(["ONLINE"]);

  const [dayTimeSlots, setDayTimeSlots] = useState<DayTimeSlot[]>([
    { day: "MONDAY", startTime: "09:00", endTime: "11:00" },
  ]);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const token =
    typeof document !== "undefined"
      ? document.cookie
          .split("; ")
          .find((r) => r.startsWith("token="))
          ?.split("=")[1]
      : null;

  /* ================= LOAD ================= */
  useEffect(() => {
    fetch("https://toturhub-dev.onrender.com/api/subjects")
      .then((r) => r.json())
      .then(setSubjects);

    fetch("https://toturhub-dev.onrender.com/api/v1/locations")
      .then((r) => r.json())
      .then(setLocations);
  }, []);

  /* ================= IMAGE ================= */
  const handleImageChange = (file: File | null) => {
    setImage(file);

    if (preview) URL.revokeObjectURL(preview);

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  /* ================= SCHEDULE ================= */
  const dayOptions = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const addSlot = () => {
    setDayTimeSlots([
      ...dayTimeSlots,
      { day: "MONDAY", startTime: "09:00", endTime: "11:00" },
    ]);
  };

  const updateSlot = (i: number, f: keyof DayTimeSlot, v: string) => {
    const copy = [...dayTimeSlots];
    copy[i][f] = v;
    setDayTimeSlots(copy);
  };

  const removeSlot = (i: number) => {
    setDayTimeSlots(dayTimeSlots.filter((_, x) => x !== i));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!token) return toast.error("No token");
    if (!locationId) return toast.error("Select location");

    setLoading(true);

    try {
      const formData = new FormData();

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
        dayTimeSlots,
      };

      formData.append("data", JSON.stringify(payload));
      if (image) formData.append("image", image);

      const res = await fetch(
        "https://toturhub-dev.onrender.com/api/v1/open-classes",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (res.ok) {
        toast.success("Class created successfully!");
        setTimeout(() => navigate("/profile"), 700);
      } else {
        toast.error("Failed to create class");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">

      <div className="bg-white w-full max-w-3xl h-[90vh] rounded-2xl shadow-lg border flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="p-5 border-b flex justify-between items-center bg-white">
          <div>
            <h1 className="text-2xl font-bold">Create Open Class</h1>
            <p className="text-sm text-gray-500">
              Fill all required information
            </p>
          </div>

         
        </div>

        {/* SCROLL AREA */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">

          {/* TITLE */}
          <input
            className="w-full border p-3 rounded-xl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Class title"
          />

          {/* DESCRIPTION */}
          <textarea
            className="w-full border p-3 rounded-xl"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* SUBJECTS */}
          <div className="grid grid-cols-2 gap-2">
            {subjects.map((s) => (
              <label
                key={s.id}
                className="flex gap-2 border p-2 rounded-lg hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={subjectIds.includes(s.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSubjectIds([...subjectIds, s.id]);
                    } else {
                      setSubjectIds(subjectIds.filter((x) => x !== s.id));
                    }
                  }}
                />
                {s.name}
              </label>
            ))}
          </div>

          {/* LOCATION */}
          <select
            className="w-full border p-3 rounded-xl"
            value={locationId ?? ""}
            onChange={(e) => setLocationId(Number(e.target.value))}
          >
            <option>Select location</option>
            {locations.map((l) => (
              <option key={l.locationId} value={l.locationId}>
                {l.city} - {l.district}
              </option>
            ))}
          </select>

          {/* ADDRESS */}
          <input
            className="w-full border p-3 rounded-xl"
            value={specificAddress}
            onChange={(e) => setSpecificAddress(e.target.value)}
          />

          {/* PRICE */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              className="border p-3 rounded-xl"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
            />

            <input
              type="number"
              className="border p-3 rounded-xl"
              value={maxStudents}
              onChange={(e) => setMaxStudents(Number(e.target.value))}
            />
          </div>

          {/* SCHEDULE */}
          <div className="border p-4 rounded-xl bg-gray-50">
            <div className="flex justify-between mb-2">
              <p className="font-semibold">Schedule</p>
              <button onClick={addSlot} className="text-blue-600">
                + Add
              </button>
            </div>

            {dayTimeSlots.map((slot, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 mt-2">
                <select
                  className="border p-2 rounded-lg"
                  value={slot.day}
                  onChange={(e) => updateSlot(i, "day", e.target.value)}
                >
                  {dayOptions.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>

                <input
                  type="time"
                  className="border p-2 rounded-lg"
                  value={slot.startTime}
                  onChange={(e) =>
                    updateSlot(i, "startTime", e.target.value)
                  }
                />

                <input
                  type="time"
                  className="border p-2 rounded-lg"
                  value={slot.endTime}
                  onChange={(e) =>
                    updateSlot(i, "endTime", e.target.value)
                  }
                />

                <button
                  onClick={() => removeSlot(i)}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* IMAGE UPLOAD (IMPROVED UI) */}
          <div className="border rounded-xl p-4 bg-gray-50">

            <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-100">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  handleImageChange(e.target.files?.[0] || null)
                }
              />
              <p className="text-gray-500">Click to upload image</p>
            </label>

            {/* PREVIEW */}
            {preview && (
              <div className="mt-3 relative">
                <img
                  src={preview}
                  className="w-full h-52 object-cover rounded-xl border"
                />

                <button
                  onClick={() => handleImageChange(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="p-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white hover:bg-gray-900"
          >
            {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            Create Class
          </Button>
        </div>

      </div>
    </div>
  );
}