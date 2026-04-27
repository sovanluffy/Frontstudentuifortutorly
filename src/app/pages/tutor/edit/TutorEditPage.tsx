"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  ArrowLeft, Save, Loader2, MapPin, DollarSign, Users,
  Info, BookOpen, Clock, Calendar, Plus, X, Monitor,
  Home, Layers, ChevronDown, Hash, Timer, CheckCircle2,
} from "lucide-react";
import { Toaster, toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE as string;

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] as const;
type Day = typeof DAYS[number];
const DURATION_TYPES = ["DAYS", "WEEKS", "MONTHS"] as const;
type DurationType = typeof DURATION_TYPES[number];
const LEARNING_MODES = ["ONLINE", "OFFLINE", "HYBRID"] as const;
type LearningMode = typeof LEARNING_MODES[number];

interface DayTimeSlot {
  day: Day;
  startTime: string;
  endTime: string;
  maxStudents: number;
}

interface Subject { id: number; name: string; }
interface Location {
  locationId: number;
  city: string;
  district?: string;
  fullAddress?: string;
}

interface FormData {
  title: string;
  description: string;
  selectedSubjectIds: number[];
  status: string;
  locationId: number | "";
  specificAddress: string;
  basePrice: number;
  maxStudents: number;
  learningModes: LearningMode[];
  dayTimeSlots: DayTimeSlot[];
  startDate: string;
  durationType: DurationType;
  durationValue: number;
}

interface TutorEditPageProps {
  classId?: number;
  onSuccess?: () => void;
}

/* ─────────────────────────────────────────
   UI COMPONENTS
───────────────────────────────────────── */
const inputCls = "w-full rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const Pill: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
      active
        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
    }`}
  >
    {children}
  </button>
);

const FieldLabel: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
    {children}{required && <span className="text-rose-400">*</span>}
  </p>
);

const Section: React.FC<{
  icon: React.ReactNode;
  title: string;
  sub?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ icon, title, sub, action, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
    <div className="flex items-center justify-between px-5 pt-4 pb-3.5 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">{title}</p>
          {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      {action}
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </div>
);

const StyledSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, ...props }) => (
  <div className="relative">
    <select className={inputCls + " appearance-none pr-9"} {...props}>
      {children}
    </select>
    <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
);

const ScheduleRow: React.FC<{
  slot: DayTimeSlot;
  index: number;
  onChange: (i: number, field: keyof DayTimeSlot, val: string | number) => void;
  onRemove: (i: number) => void;
}> = ({ slot, index, onChange, onRemove }) => (
  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <select
          value={slot.day}
          onChange={(e) => onChange(index, "day", e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm font-medium appearance-none focus:border-blue-400"
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d.charAt(0) + d.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-rose-50 hover:text-rose-500"
      >
        <X size={16} />
      </button>
    </div>

    <div className="grid grid-cols-3 gap-3">
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">Start Time</p>
        <input
          type="time"
          value={slot.startTime}
          onChange={(e) => onChange(index, "startTime", e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-sm"
        />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">End Time</p>
        <input
          type="time"
          value={slot.endTime}
          onChange={(e) => onChange(index, "endTime", e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-sm"
        />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">Max Students</p>
        <input
          type="number"
          min={1}
          value={slot.maxStudents}
          onChange={(e) => onChange(index, "maxStudents", Number(e.target.value))}
          className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-sm"
        />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const TutorEditPage: React.FC<TutorEditPageProps> = ({ classId: classIdProp, onSuccess }) => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const resolvedClassId = classIdProp ?? (paramId ? Number(paramId) : undefined);
  const isModal = !!classIdProp && !!onSuccess;

  const goBack = () => {
    if (isModal && onSuccess) onSuccess();
    else navigate("/tutor/classes");
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    selectedSubjectIds: [],
    status: "OPEN",
    locationId: "",
    specificAddress: "",
    basePrice: 0,
    maxStudents: 0,
    learningModes: [],
    dayTimeSlots: [],
    startDate: new Date().toISOString().slice(0, 16),
    durationType: "WEEKS",
    durationValue: 0,
  });

  const token = Cookies.get("token");
  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  /* Fetch Subjects & Locations */
  const fetchMeta = useCallback(async () => {
    try {
      const [subRes, locRes] = await Promise.all([
        fetch(`${API_BASE}/subjects`, { headers: authHeaders }),
        fetch(`${API_BASE}/v1/locations`, { headers: authHeaders }),
      ]);
      if (subRes.ok) setSubjects(await subRes.json());
      if (locRes.ok) setLocations(await locRes.json());
    } catch (err) {
      console.error("Meta fetch failed", err);
    }
  }, []);

  /* Load Class Data */
  useEffect(() => {
    if (!resolvedClassId) {
      toast.error("Class ID not found");
      goBack();
      return;
    }

    const loadClass = async () => {
      await fetchMeta();
      try {
        const res = await fetch(`${API_BASE}/open-classes/${resolvedClassId}`, { headers: authHeaders });
        if (!res.ok) throw new Error();

        const d = await res.json();

        setFormData({
          title: d.title ?? "",
          description: d.description ?? "",
          selectedSubjectIds: Array.isArray(d.subjectIds) ? d.subjectIds : [],
          status: d.status ?? "OPEN",
          locationId: d.locationId ?? "",
          specificAddress: d.specificAddress ?? "",
          basePrice: d.basePrice ?? 0,
          maxStudents: d.maxStudents ?? 0,
          learningModes: (d.learningModes ?? []) as LearningMode[],
          dayTimeSlots: (d.schedules ?? d.dayTimeSlots ?? []).map((s: any) => ({
            day: s.day as Day,
            startTime: s.startTime?.slice(0, 5) ?? "",
            endTime: s.endTime?.slice(0, 5) ?? "",
            maxStudents: s.maxStudents ?? 10,
          })),
          startDate: d.startDate ? d.startDate.slice(0, 16) : new Date().toISOString().slice(0, 16),
          durationType: (d.durationType as DurationType) ?? "WEEKS",
          durationValue: d.durationValue ?? 0,
        });
      } catch (err) {
        toast.error("Failed to load class details");
        goBack();
      } finally {
        setLoading(false);
      }
    };

    loadClass();
  }, [resolvedClassId]);

  const updateForm = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSubject = (id: number) => {
    updateForm(
      "selectedSubjectIds",
      formData.selectedSubjectIds.includes(id)
        ? formData.selectedSubjectIds.filter((sid) => sid !== id)
        : [...formData.selectedSubjectIds, id]
    );
  };

  const toggleMode = (mode: LearningMode) => {
    updateForm(
      "learningModes",
      formData.learningModes.includes(mode)
        ? formData.learningModes.filter((m) => m !== mode)
        : [...formData.learningModes, mode]
    );
  };

  const addSlot = () => {
    updateForm("dayTimeSlots", [
      ...formData.dayTimeSlots,
      { day: "MONDAY", startTime: "08:00", endTime: "10:00", maxStudents: 10 },
    ]);
  };

  const updateSlot = (index: number, field: keyof DayTimeSlot, value: string | number) => {
    const newSlots = [...formData.dayTimeSlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    updateForm("dayTimeSlots", newSlots);
  };

  const removeSlot = (index: number) => {
    updateForm("dayTimeSlots", formData.dayTimeSlots.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.selectedSubjectIds.length === 0) {
      toast.error("Please select at least one subject");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        subjectIds: formData.selectedSubjectIds,           // ← as per your JSON
        status: formData.status,
        locationId: formData.locationId === "" ? null : Number(formData.locationId),
        specificAddress: formData.specificAddress,
        basePrice: formData.basePrice,
        maxStudents: formData.maxStudents,
        learningModes: formData.learningModes,
        dayTimeSlots: formData.dayTimeSlots.map((s) => ({
          day: s.day,
          startTime: s.startTime + ":00",
          endTime: s.endTime + ":00",
          maxStudents: s.maxStudents,
        })),
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        durationType: formData.durationType,
        durationValue: formData.durationValue,
      };

      const res = await fetch(`${API_BASE}/open-classes/${resolvedClassId}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaved(true);
        toast.success("Class updated successfully!");
        setTimeout(() => {
          setSaved(false);
          goBack();
        }, 1500);
      } else {
        toast.error("Failed to update class");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 antialiased pb-20">
      {!isModal && <Toaster position="top-center" richColors closeButton />}

      {/* Header */}
      {!isModal && (
        <div className="sticky top-0 z-40 bg-white border-b px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button onClick={goBack} className="p-2 rounded-xl hover:bg-gray-100">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Class #{resolvedClassId}</p>
              <h1 className="font-bold text-lg truncate">{formData.title || "Edit Class"}</h1>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* 1. General Info */}
        <Section icon={<Info size={18} />} title="General Info">
          <FieldLabel required>Class Title</FieldLabel>
          <input
            type="text"
            required
            className={inputCls}
            value={formData.title}
            onChange={(e) => updateForm("title", e.target.value)}
          />

          <FieldLabel required>Description</FieldLabel>
          <textarea
            required
            rows={4}
            className={inputCls + " resize-y"}
            value={formData.description}
            onChange={(e) => updateForm("description", e.target.value)}
          />

          <FieldLabel>Status</FieldLabel>
          <div className="flex gap-2">
            {["OPEN", "CLOSED"].map((s) => (
              <Pill key={s} active={formData.status === s} onClick={() => updateForm("status", s)}>
                {s}
              </Pill>
            ))}
          </div>
        </Section>

        {/* 2. Subjects */}
        <Section icon={<BookOpen size={18} />} title="Subjects">
          <div className="flex flex-wrap gap-2">
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <Pill
                  key={subject.id}
                  active={formData.selectedSubjectIds.includes(subject.id)}
                  onClick={() => toggleSubject(subject.id)}
                >
                  {subject.name}
                </Pill>
              ))
            ) : (
              <p className="text-gray-400">Loading subjects...</p>
            )}
          </div>
        </Section>

        {/* 3. Pricing & Capacity */}
        <Section icon={<DollarSign size={18} />} title="Pricing & Capacity">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Base Price (USD)</FieldLabel>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input
                  type="number"
                  min={0}
                  required
                  className={inputCls + " pl-8"}
                  value={formData.basePrice}
                  onChange={(e) => updateForm("basePrice", Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <FieldLabel required>Max Students</FieldLabel>
              <input
                type="number"
                min={1}
                required
                className={inputCls}
                value={formData.maxStudents}
                onChange={(e) => updateForm("maxStudents", Number(e.target.value))}
              />
            </div>
          </div>
        </Section>

        {/* 4. Learning Modes */}
        <Section icon={<Monitor size={18} />} title="Learning Modes">
          <div className="flex flex-wrap gap-2">
            {LEARNING_MODES.map((mode) => (
              <Pill
                key={mode}
                active={formData.learningModes.includes(mode)}
                onClick={() => toggleMode(mode)}
              >
                {mode}
              </Pill>
            ))}
          </div>
        </Section>

        {/* 5. Location */}
        <Section icon={<MapPin size={18} />} title="Location">
          <FieldLabel>Location</FieldLabel>
          <StyledSelect
            value={formData.locationId}
            onChange={(e) => updateForm("locationId", e.target.value === "" ? "" : Number(e.target.value))}
          >
            <option value="">— Select Location —</option>
            {locations.map((loc) => (
              <option key={loc.locationId} value={loc.locationId}>
                {loc.city} {loc.district ? `- ${loc.district}` : ""}
              </option>
            ))}
          </StyledSelect>

          <FieldLabel>Specific Address</FieldLabel>
          <input
            type="text"
            className={inputCls}
            placeholder="Room 101, Building A, Street 123"
            value={formData.specificAddress}
            onChange={(e) => updateForm("specificAddress", e.target.value)}
          />
        </Section>

        {/* 6. Schedule */}
        <Section
          icon={<Calendar size={18} />}
          title="Weekly Schedule"
          action={
            <button
              type="button"
              onClick={addSlot}
              className="flex items-center gap-1 text-blue-600 text-sm font-medium"
            >
              <Plus size={16} /> Add Slot
            </button>
          }
        >
          {formData.dayTimeSlots.length === 0 ? (
            <button
              type="button"
              onClick={addSlot}
              className="w-full py-12 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 hover:border-blue-400"
            >
              Click to add first time slot
            </button>
          ) : (
            <div className="space-y-4">
              {formData.dayTimeSlots.map((slot, i) => (
                <ScheduleRow
                  key={i}
                  slot={slot}
                  index={i}
                  onChange={updateSlot}
                  onRemove={removeSlot}
                />
              ))}
            </div>
          )}
        </Section>

        {/* 7. Duration */}
        <Section icon={<Timer size={18} />} title="Duration & Start Date">
          <FieldLabel>Start Date & Time</FieldLabel>
          <input
            type="datetime-local"
            className={inputCls}
            value={formData.startDate}
            onChange={(e) => updateForm("startDate", e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Duration Type</FieldLabel>
              <StyledSelect
                value={formData.durationType}
                onChange={(e) => updateForm("durationType", e.target.value as DurationType)}
              >
                {DURATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </StyledSelect>
            </div>
            <div>
              <FieldLabel>Value</FieldLabel>
              <input
                type="number"
                min={0}
                className={inputCls}
                value={formData.durationValue}
                onChange={(e) => updateForm("durationValue", Number(e.target.value))}
              />
            </div>
          </div>
        </Section>
      </form>

      {/* Floating Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <button
            type="submit"
            form="edit-form"
            disabled={saving || saved}
            className={`w-full h-12 rounded-2xl font-bold text-white transition-all ${
              saved ? "bg-emerald-600" : saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saved ? "✓ All changes saved!" : saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorEditPage;