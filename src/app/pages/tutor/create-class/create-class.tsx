"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Loader2, Trash2, Calendar, Clock, Users, MapPin, BookOpen,
  Monitor, Home, School, Map, ImageIcon, CheckCircle2,
  ChevronRight, Search, ChevronDown,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/* ================= TYPES ================= */
interface Subject { id: number; name: string; }
interface Location { locationId: number; city: string; district: string; }
interface DayTimeSlot { day: string; startTime: string; endTime: string; maxStudents: number; }

/* ================= TOAST ================= */
function showToast(msg: string, type: "success" | "error" = "error") {
  const el = document.createElement("div");
  el.style.cssText = `position:fixed;bottom:28px;right:28px;z-index:9999;padding:14px 22px;border-radius:14px;font-size:14px;font-weight:600;color:#fff;background:${type === "success" ? "#16a34a" : "#dc2626"};box-shadow:0 8px 32px rgba(0,0,0,.18);animation:toastIn .25s ease;pointer-events:none;`;
  el.textContent = msg;
  const s = document.createElement("style");
  s.textContent = `@keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`;
  document.head.appendChild(s);
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/* ================= UI PRIMITIVES ================= */
const inputCls = "w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-blue-400 focus:bg-white text-gray-900 font-medium transition-all placeholder:text-gray-300 text-sm";
const labelCls = "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
        {icon}
      </div>
      <span className="text-xs font-black text-gray-700 uppercase tracking-widest">{label}</span>
    </div>
  );
}

/* ================= SUBJECT SELECT ================= */
function SubjectSelect({
  subjects, subjectId, onChange, t,
}: {
  subjects: Subject[];
  subjectId: number | null;
  onChange: (id: number) => void;
  t: (kh: string, en: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = subjects.find((s) => s.id === subjectId) ?? null;
  const filtered = subjects.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); setQuery(""); }}
        className={`w-full flex items-center justify-between gap-2 border px-4 py-3 rounded-xl text-sm font-medium transition-all ${
          open
            ? "border-blue-400 bg-white"
            : selected
            ? "border-blue-200 bg-blue-50 text-blue-800"
            : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"
        }`}
      >
        <span className={selected ? "font-bold text-blue-800" : "text-gray-400"}>
          {selected ? selected.name : t("ជ្រើសរើសមុខវិជ្ជា...", "Select a subject...")}
        </span>
        <ChevronDown size={14} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-2.5 border-b bg-gray-50">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("ស្វែងរក...", "Search...")}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 outline-none text-sm"
              />
            </div>
          </div>
          <div className="max-h-56 overflow-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400 text-center">
                {t("រកមិនឃើញ", "No results")}
              </p>
            ) : (
              filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { onChange(s.id); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 ${
                    s.id === subjectId ? "bg-blue-50 font-bold text-blue-700" : "text-gray-700"
                  }`}
                >
                  {s.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= MAIN PAGE ================= */
export default function CreateOpenClassPage() {
  const { t } = useLanguage();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [specificAddress, setSpecificAddress] = useState("");
  const [basePrice, setBasePrice] = useState(50);
  const [maxStudents, setMaxStudents] = useState(20);
  const [learningModes, setLearningModes] = useState<string[]>([]);
  const [startDateOnly, setStartDateOnly] = useState("");
  const [startTimeOnly, setStartTimeOnly] = useState("09:00");
  const [durationType, setDurationType] = useState<"DAYS" | "WEEKS" | "MONTHS">("WEEKS");
  const [durationValue, setDurationValue] = useState(4);
  const [dayTimeSlots, setDayTimeSlots] = useState<DayTimeSlot[]>([
    { day: "MONDAY", startTime: "09:00", endTime: "11:00", maxStudents: 15 },
  ]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof document !== "undefined"
      ? document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1]
      : null;

  useEffect(() => {
    fetch("https://toturhub-dev.onrender.com/api/v1/subjects")
      .then((r) => r.json()).then(setSubjects).catch(() => {});
    fetch("https://toturhub-dev.onrender.com/api/v1/locations")
      .then((r) => r.json()).then(setLocations).catch(() => {});
  }, []);

  const toggleMode = (mode: string) =>
    setLearningModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const addSlot = () =>
    setDayTimeSlots([...dayTimeSlots, { day: "MONDAY", startTime: "09:00", endTime: "11:00", maxStudents: 15 }]);

  const updateSlot = (i: number, field: keyof DayTimeSlot, value: string | number) => {
    const copy = [...dayTimeSlots];
    (copy[i] as any)[field] = value;
    setDayTimeSlots(copy);
  };

  const removeSlot = (i: number) => setDayTimeSlots(dayTimeSlots.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    if (!token) return showToast(t("តម្រូវការចូលប្រើ", "Login required"), "error");
    if (!title.trim()) return showToast(t("ចំណងជើងត្រូវការ", "Title is required"), "error");
    if (learningModes.length === 0) return showToast(t("ជ្រើសរើសទម្រង់រៀន", "Select a learning mode"), "error");
    if (!subjectId) return showToast(t("ជ្រើសរើសមុខវិជ្ជា", "Select a subject"), "error");
    if (!locationId) return showToast(t("ជ្រើសរើសទីតាំង", "Select a location"), "error");
    if (!startDateOnly) return showToast(t("ជ្រើសរើសកាលបរិច្ឆេទ", "Select a start date"), "error");

    setLoading(true);
    try {
      const payload = {
        title, description, subjectIds: [subjectId], status, locationId,
        specificAddress, basePrice, maxStudents, learningModes,
        durationType, durationValue,
        startDate: `${startDateOnly}T${startTimeOnly}:00`,
        dayTimeSlots: dayTimeSlots.map((s) => ({
          ...s,
          startTime: s.startTime.length === 5 ? `${s.startTime}:00` : s.startTime,
          endTime: s.endTime.length === 5 ? `${s.endTime}:00` : s.endTime,
        })),
      };

      const form = new FormData();
      form.append("data", JSON.stringify(payload));
      if (image) form.append("imageFile", image);

      const res = await fetch("https://toturhub-dev.onrender.com/api/v1/open-classes", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (res.ok) {
        showToast(t("ថ្នាក់ត្រូវបានបោះផ្សាយ!", "Class published!"), "success");
        setTimeout(() => window.history.back(), 1500);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.message || t("បរាជ័យ", "Failed"), "error");
      }
    } catch {
      showToast(t("កំហុសបណ្តាញ", "Network error"), "error");
    } finally {
      setLoading(false);
    }
  };

  const MODES = [
    { id: "ONLINE",       kh: "អនឡាញ",    en: "Online",       icon: <Monitor size={18} /> },
    { id: "STUDENT_HOME", kh: "ផ្ទះសិស្ស", en: "Student Home", icon: <Home size={18} /> },
    { id: "TUTOR_CLASS",  kh: "ថ្នាក់គ្រូ", en: "Tutor Class",  icon: <School size={18} /> },
    { id: "OUTSIDE",      kh: "ខាងក្រៅ",   en: "Outside",      icon: <Map size={18} /> },
  ];

  const DAYS = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];
  const DAY_KH: Record<string, string> = {
    MONDAY: "ច័ន្ទ", TUESDAY: "អង្គារ", WEDNESDAY: "ពុធ",
    THURSDAY: "ព្រហស្បតិ៍", FRIDAY: "សុក្រ", SATURDAY: "សៅរ៍", SUNDAY: "អាទិត្យ",
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <BookOpen size={14} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 leading-none">TutorHub</p>
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {t("បង្កើតថ្នាក់រៀន", "Create Open Class")}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-7 space-y-4">

        {/* LEARNING MODES */}
        <Card>
          <SectionTitle icon={<Monitor size={14} />} label={t("ទម្រង់រៀន", "Learning Modes")} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {MODES.map((mode) => {
              const active = learningModes.includes(mode.id);
              return (
                <button
                  key={mode.id}
                  onClick={() => toggleMode(mode.id)}
                  className={`relative flex flex-col items-center gap-2 py-4 rounded-xl border transition-all duration-200 ${
                    active
                      ? "border-blue-400 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {active && (
                    <CheckCircle2 size={12} className="absolute top-2 right-2 text-blue-500" />
                  )}
                  <span className={active ? "text-blue-500" : "text-gray-400"}>{mode.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide">
                    {t(mode.kh, mode.en)}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* COURSE DETAILS */}
        <Card>
          <SectionTitle icon={<BookOpen size={14} />} label={t("ព័ត៌មានថ្នាក់", "Course Details")} />
          <div className="space-y-4">
            <div>
              <label className={labelCls}>{t("ចំណងជើង", "Title")}</label>
              <input
                className={inputCls}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("ឈ្មោះថ្នាក់", "Class title")}
              />
            </div>
            <div>
              <label className={labelCls}>{t("ការពិពណ៌នា", "Description")}</label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("ការពិពណ៌នា...", "Description...")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>{t("ស្ថានភាព", "Status")}</label>
                <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="OPEN">{t("បើក", "Open")}</option>
                  <option value="CLOSED">{t("បិទ", "Closed")}</option>
                  <option value="DRAFT">{t("ព្រាង", "Draft")}</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>{t("ចំនួនសិស្សអតិបរមា", "Max Students")}</label>
                <input
                  type="number"
                  min={1}
                  className={inputCls}
                  value={maxStudents}
                  onChange={(e) => setMaxStudents(Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>{t("តម្លៃ ($/នាក់)", "Price ($/person)")}</label>
              <input
                type="number"
                min={0}
                className={inputCls}
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
              />
            </div>
          </div>
        </Card>

        {/* START DATE + DURATION */}
        <Card>
          <SectionTitle icon={<Calendar size={14} />} label={t("កាលបរិច្ឆេទ & រយៈពេល", "Date & Duration")} />
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelCls}>{t("កាលបរិច្ឆេទ", "Date")}</label>
              <input
                type="date"
                className={inputCls}
                value={startDateOnly}
                onChange={(e) => setStartDateOnly(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>{t("ម៉ោង", "Time")}</label>
              <input
                type="time"
                className={inputCls}
                value={startTimeOnly}
                onChange={(e) => setStartTimeOnly(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t("រយៈពេល", "Duration")}</label>
              <input
                type="number"
                min={1}
                className={inputCls}
                value={durationValue}
                onChange={(e) => setDurationValue(Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelCls}>{t("ប្រភេទ", "Type")}</label>
              <select
                className={inputCls}
                value={durationType}
                onChange={(e) => setDurationType(e.target.value as "DAYS" | "WEEKS" | "MONTHS")}
              >
                <option value="DAYS">{t("ថ្ងៃ", "Days")}</option>
                <option value="WEEKS">{t("សប្តាហ៍", "Weeks")}</option>
                <option value="MONTHS">{t("ខែ", "Months")}</option>
              </select>
            </div>
          </div>
        </Card>

        {/* LOCATION & SUBJECT */}
        <Card>
          <SectionTitle icon={<MapPin size={14} />} label={t("ទីតាំង & មុខវិជ្ជា", "Venue & Subject")} />
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>{t("ទីតាំង", "Location")}</label>
                <select
                  className={inputCls}
                  value={locationId ?? ""}
                  onChange={(e) => setLocationId(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">{t("ជ្រើសរើស...", "Select...")}</option>
                  {locations.map((l) => (
                    <option key={l.locationId} value={l.locationId}>
                      {l.city} — {l.district}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>{t("អាសយដ្ឋានលម្អិត", "Address")}</label>
                <input
                  className={inputCls}
                  value={specificAddress}
                  onChange={(e) => setSpecificAddress(e.target.value)}
                  placeholder={t("ផ្លូវ / បន្ទប់", "Street / Room")}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>
                {t("មុខវិជ្ជា", "Subject")} <span className="text-red-400">*</span>
              </label>
              {subjects.length === 0 ? (
                <div className="flex items-center gap-2 border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl">
                  <Loader2 size={13} className="animate-spin text-gray-300" />
                  <span className="text-sm text-gray-300">{t("កំពុងផ្ទុក...", "Loading...")}</span>
                </div>
              ) : (
                <SubjectSelect subjects={subjects} subjectId={subjectId} onChange={setSubjectId} t={t} />
              )}
            </div>
          </div>
        </Card>

        {/* WEEKLY SLOTS */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <SectionTitle icon={<Clock size={14} />} label={t("ម៉ោងប្រចាំសប្តាហ៍", "Weekly Slots")} />
            <button
              onClick={addSlot}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wide hover:bg-blue-700 transition-colors"
            >
              + {t("បន្ថែម", "Add")}
            </button>
          </div>
          <div className="space-y-3">
            {dayTimeSlots.map((slot, i) => (
              <div
                key={i}
                className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-3 bg-slate-50 rounded-xl border border-gray-100"
              >
                <select
                  className="border border-gray-200 bg-white px-3 py-2 rounded-lg text-xs font-bold outline-none focus:border-blue-400 min-w-[110px]"
                  value={slot.day}
                  onChange={(e) => updateSlot(i, "day", e.target.value)}
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{t(DAY_KH[d] || d, d)}</option>
                  ))}
                </select>

                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1">
                  <input
                    type="time"
                    className="outline-none text-xs font-bold bg-transparent text-gray-700 w-20"
                    value={slot.startTime}
                    onChange={(e) => updateSlot(i, "startTime", e.target.value)}
                  />
                  <ChevronRight size={11} className="text-gray-300" />
                  <input
                    type="time"
                    className="outline-none text-xs font-bold bg-transparent text-gray-700 w-20"
                    value={slot.endTime}
                    onChange={(e) => updateSlot(i, "endTime", e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <Users size={12} className="text-gray-300" />
                  <input
                    type="number"
                    className="w-10 outline-none text-xs font-bold bg-transparent text-gray-700"
                    value={slot.maxStudents}
                    min={1}
                    onChange={(e) => updateSlot(i, "maxStudents", Number(e.target.value))}
                  />
                </div>

                <button
                  onClick={() => removeSlot(i)}
                  className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* COVER IMAGE */}
        <Card>
          <SectionTitle icon={<ImageIcon size={14} />} label={t("រូបភាពគម្រប", "Cover Image")} />
          {!preview ? (
            <label className="relative flex flex-col items-center justify-center gap-2 py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
              />
              <ImageIcon size={24} className="text-gray-300" />
              <p className="text-xs font-semibold text-gray-400">
                {t("ចុចដើម្បីផ្ទុករូបភាព", "Click to upload")}
              </p>
            </label>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-gray-100">
              <img src={preview} className="w-full h-56 object-cover" alt="Preview" />
              <button
                onClick={() => handleImageChange(null)}
                className="absolute top-2.5 right-2.5 bg-white px-3 py-1 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 border border-red-100 transition-colors"
              >
                {t("លុប", "Remove")}
              </button>
            </div>
          )}
        </Card>

        {/* SUBMIT */}
        <div className="pb-10">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white h-13 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
          >
            {loading
              ? <Loader2 className="animate-spin w-5 h-5" />
              : t("បោះផ្សាយថ្នាក់", "Publish Class")}
          </button>
        </div>

      </main>
    </div>
  );
}