"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  ArrowLeft, Loader2, MapPin, DollarSign, Users,
  Info, BookOpen, Clock, Calendar, Plus, X, Monitor,
  ChevronDown, Timer, CheckCircle2, Save,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE as string;

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
const DAYS = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"] as const;
type Day = typeof DAYS[number];
const DURATION_TYPES = ["DAYS","WEEKS","MONTHS"] as const;
type DurationType = typeof DURATION_TYPES[number];
const LEARNING_MODES = ["ONLINE","OFFLINE","HYBRID"] as const;
type LearningMode = typeof LEARNING_MODES[number];

interface DayTimeSlot { day: Day; startTime: string; endTime: string; maxStudents: number; }
interface Subject { id: number; name: string; }
interface Location { locationId: number; city: string; district?: string; }

interface FormState {
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
   UI PRIMITIVES
───────────────────────────────────────── */
const inputCls =
  "w-full rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-300";

const labelCls = "block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5";

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p className={labelCls}>
      {children}
      {required && <span className="text-rose-400 ml-0.5">*</span>}
    </p>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
        active
          ? "bg-blue-600 border-blue-600 text-white shadow-sm"
          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function Card({
  icon, title, sub, action, children,
}: {
  icon: React.ReactNode;
  title: string;
  sub?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
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
}

function StyledSelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={inputCls + " appearance-none pr-9"} {...props}>
        {children}
      </select>
      <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

function ScheduleRow({
  slot, index, onChange, onRemove, t,
}: {
  slot: DayTimeSlot;
  index: number;
  onChange: (i: number, field: keyof DayTimeSlot, val: string | number) => void;
  onRemove: (i: number) => void;
  t: (kh: string, en: string) => string;
}) {
  const DAY_KH: Record<string, string> = {
    MONDAY: "ច័ន្ទ", TUESDAY: "អង្គារ", WEDNESDAY: "ពុធ",
    THURSDAY: "ព្រហស្បតិ៍", FRIDAY: "សុក្រ", SATURDAY: "សៅរ៍", SUNDAY: "អាទិត្យ",
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-slate-50 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <select
            value={slot.day}
            onChange={(e) => onChange(index, "day", e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm font-medium appearance-none outline-none focus:border-blue-400"
          >
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {t(DAY_KH[d] || d, d.charAt(0) + d.slice(1).toLowerCase())}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            {t("ម៉ោងចាប់ផ្តើម", "Start")}
          </p>
          <input
            type="time"
            value={slot.startTime}
            onChange={(e) => onChange(index, "startTime", e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:border-blue-400"
          />
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            {t("ម៉ោងបញ្ចប់", "End")}
          </p>
          <input
            type="time"
            value={slot.endTime}
            onChange={(e) => onChange(index, "endTime", e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:border-blue-400"
          />
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            {t("ចំនួន", "Max")}
          </p>
          <input
            type="number"
            min={1}
            value={slot.maxStudents}
            onChange={(e) => onChange(index, "maxStudents", Number(e.target.value))}
            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:border-blue-400"
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const TutorEditPage: React.FC<TutorEditPageProps> = ({ classId: classIdProp, onSuccess }) => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

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

  const [form, setForm] = useState<FormState>({
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
  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchMeta = useCallback(async () => {
    try {
      const [subRes, locRes] = await Promise.all([
        fetch(`${API_BASE}/subjects`, { headers: authHeaders }),
        fetch(`${API_BASE}/v1/locations`, { headers: authHeaders }),
      ]);
      if (subRes.ok) setSubjects(await subRes.json());
      if (locRes.ok) setLocations(await locRes.json());
    } catch {}
  }, []);

  useEffect(() => {
    if (!resolvedClassId) { toast.error("Class ID not found"); goBack(); return; }

    (async () => {
      await fetchMeta();
      try {
        const res = await fetch(`${API_BASE}/open-classes/${resolvedClassId}`, { headers: authHeaders });
        if (!res.ok) throw new Error();
        const d = await res.json();

        setForm({
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
      } catch {
        toast.error(t("មិនអាចផ្ទុកទិន្នន័យបាន", "Failed to load class"));
        goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, [resolvedClassId]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleSubject = (id: number) =>
    update("selectedSubjectIds",
      form.selectedSubjectIds.includes(id)
        ? form.selectedSubjectIds.filter((s) => s !== id)
        : [...form.selectedSubjectIds, id]
    );

  const toggleMode = (mode: LearningMode) =>
    update("learningModes",
      form.learningModes.includes(mode)
        ? form.learningModes.filter((m) => m !== mode)
        : [...form.learningModes, mode]
    );

  const addSlot = () =>
    update("dayTimeSlots", [
      ...form.dayTimeSlots,
      { day: "MONDAY", startTime: "08:00", endTime: "10:00", maxStudents: 10 },
    ]);

  const updateSlot = (i: number, field: keyof DayTimeSlot, val: string | number) => {
    const copy = [...form.dayTimeSlots];
    copy[i] = { ...copy[i], [field]: val };
    update("dayTimeSlots", copy);
  };

  const removeSlot = (i: number) =>
    update("dayTimeSlots", form.dayTimeSlots.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.selectedSubjectIds.length === 0) {
      toast.error(t("ជ្រើសរើសមុខវិជ្ជាយ៉ាងហោចណាស់មួយ", "Please select at least one subject"));
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        subjectIds: form.selectedSubjectIds,
        status: form.status,
        locationId: form.locationId === "" ? null : Number(form.locationId),
        specificAddress: form.specificAddress,
        basePrice: form.basePrice,
        maxStudents: form.maxStudents,
        learningModes: form.learningModes,
        dayTimeSlots: form.dayTimeSlots.map((s) => ({
          ...s,
          startTime: s.startTime.length === 5 ? `${s.startTime}:00` : s.startTime,
          endTime: s.endTime.length === 5 ? `${s.endTime}:00` : s.endTime,
        })),
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        durationType: form.durationType,
        durationValue: form.durationValue,
      };

      const res = await fetch(`${API_BASE}/open-classes/${resolvedClassId}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaved(true);
        toast.success(t("ថ្នាក់ត្រូវបានធ្វើបច្ចុប្បន្នភាព!", "Class updated!"));
        setTimeout(() => { setSaved(false); goBack(); }, 1500);
      } else {
        toast.error(t("បរាជ័យក្នុងការរក្សាទុក", "Failed to save"));
      }
    } catch {
      toast.error(t("កំហុសបណ្តាញ", "Network error"));
    } finally {
      setSaving(false);
    }
  };

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={36} />
      </div>
    );
  }

  /* ── PAGE ── */
  return (
    <div className="min-h-screen bg-slate-50 antialiased">
      {!isModal && <Toaster position="top-center" richColors closeButton />}

      {/* HEADER */}
      {!isModal && (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
            <button
              onClick={goBack}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 leading-none">
                {t("ថ្នាក់", "Class")} #{resolvedClassId}
              </p>
              <h1 className="text-sm font-bold text-gray-900 truncate leading-tight">
                {form.title || t("កែសម្រួលថ្នាក់", "Edit Class")}
              </h1>
            </div>
          </div>
        </header>
      )}

      {/* FORM */}
      <form id="edit-form" onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6 pb-28 space-y-4">

        {/* 1 · General Info */}
        <Card icon={<Info size={14} />} title={t("ព័ត៌មានទូទៅ", "General Info")}>
          <div>
            <FieldLabel required>{t("ចំណងជើង", "Title")}</FieldLabel>
            <input
              type="text"
              required
              className={inputCls}
              placeholder={t("ឈ្មោះថ្នាក់", "Class title")}
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel required>{t("ការពិពណ៌នា", "Description")}</FieldLabel>
            <textarea
              required
              rows={3}
              className={inputCls + " resize-none"}
              placeholder={t("ការពិពណ៌នា...", "Description...")}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>{t("ស្ថានភាព", "Status")}</FieldLabel>
            <div className="flex gap-2">
              {["OPEN", "CLOSED"].map((s) => (
                <Pill key={s} active={form.status === s} onClick={() => update("status", s)}>
                  {s === "OPEN" ? t("បើក", "Open") : t("បិទ", "Closed")}
                </Pill>
              ))}
            </div>
          </div>
        </Card>

        {/* 2 · Subjects */}
        <Card icon={<BookOpen size={14} />} title={t("មុខវិជ្ជា", "Subjects")}>
          {subjects.length === 0 ? (
            <div className="flex items-center gap-2">
              <Loader2 size={13} className="animate-spin text-gray-300" />
              <span className="text-sm text-gray-400">{t("កំពុងផ្ទុក...", "Loading...")}</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {subjects.map((sub) => (
                <Pill
                  key={sub.id}
                  active={form.selectedSubjectIds.includes(sub.id)}
                  onClick={() => toggleSubject(sub.id)}
                >
                  {sub.name}
                </Pill>
              ))}
            </div>
          )}
        </Card>

        {/* 3 · Pricing & Capacity */}
        <Card icon={<DollarSign size={14} />} title={t("តម្លៃ & ចំនួន", "Pricing & Capacity")}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>{t("តម្លៃ ($/នាក់)", "Price ($/person)")}</FieldLabel>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                <input
                  type="number"
                  min={0}
                  required
                  className={inputCls + " pl-8"}
                  value={form.basePrice}
                  onChange={(e) => update("basePrice", Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <FieldLabel required>{t("ចំនួនអតិបរមា", "Max Students")}</FieldLabel>
              <input
                type="number"
                min={1}
                required
                className={inputCls}
                value={form.maxStudents}
                onChange={(e) => update("maxStudents", Number(e.target.value))}
              />
            </div>
          </div>
        </Card>

        {/* 4 · Learning Modes */}
        <Card icon={<Monitor size={14} />} title={t("ទម្រង់រៀន", "Learning Modes")}>
          <div className="flex flex-wrap gap-2">
            {LEARNING_MODES.map((mode) => (
              <Pill
                key={mode}
                active={form.learningModes.includes(mode)}
                onClick={() => toggleMode(mode)}
              >
                {mode === "ONLINE"
                  ? t("អនឡាញ", "Online")
                  : mode === "OFFLINE"
                  ? t("ក្រៅបណ្តាញ", "Offline")
                  : t("ចំរុះ", "Hybrid")}
              </Pill>
            ))}
          </div>
        </Card>

        {/* 5 · Location */}
        <Card icon={<MapPin size={14} />} title={t("ទីតាំង", "Location")}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <FieldLabel>{t("ទីក្រុង / ស្រុក", "City / District")}</FieldLabel>
              <StyledSelect
                value={form.locationId}
                onChange={(e) =>
                  update("locationId", e.target.value === "" ? "" : Number(e.target.value))
                }
              >
                <option value="">{t("ជ្រើសរើស...", "Select...")}</option>
                {locations.map((loc) => (
                  <option key={loc.locationId} value={loc.locationId}>
                    {loc.city}{loc.district ? ` — ${loc.district}` : ""}
                  </option>
                ))}
              </StyledSelect>
            </div>
            <div>
              <FieldLabel>{t("អាសយដ្ឋានលម្អិត", "Specific Address")}</FieldLabel>
              <input
                type="text"
                className={inputCls}
                placeholder={t("ផ្លូវ / បន្ទប់", "Street / Room")}
                value={form.specificAddress}
                onChange={(e) => update("specificAddress", e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* 6 · Schedule */}
        <Card
          icon={<Calendar size={14} />}
          title={t("ម៉ោងប្រចាំសប្តាហ៍", "Weekly Schedule")}
          action={
            <button
              type="button"
              onClick={addSlot}
              className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:text-blue-700 transition-colors"
            >
              <Plus size={14} />
              {t("បន្ថែម", "Add")}
            </button>
          }
        >
          {form.dayTimeSlots.length === 0 ? (
            <button
              type="button"
              onClick={addSlot}
              className="w-full py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm hover:border-blue-300 hover:text-blue-500 transition-colors"
            >
              {t("ចុចដើម្បីបន្ថែមមេរៀន", "Click to add first time slot")}
            </button>
          ) : (
            <div className="space-y-3">
              {form.dayTimeSlots.map((slot, i) => (
                <ScheduleRow
                  key={i}
                  slot={slot}
                  index={i}
                  onChange={updateSlot}
                  onRemove={removeSlot}
                  t={t}
                />
              ))}
            </div>
          )}
        </Card>

        {/* 7 · Duration & Start Date */}
        <Card icon={<Timer size={14} />} title={t("កាលបរិច្ឆេទ & រយៈពេល", "Date & Duration")}>
          <div>
            <FieldLabel>{t("ថ្ងៃចាប់ផ្តើម", "Start Date & Time")}</FieldLabel>
            <input
              type="datetime-local"
              className={inputCls}
              value={form.startDate}
              onChange={(e) => update("startDate", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>{t("ប្រភេទ", "Duration Type")}</FieldLabel>
              <StyledSelect
                value={form.durationType}
                onChange={(e) => update("durationType", e.target.value as DurationType)}
              >
                <option value="DAYS">{t("ថ្ងៃ", "Days")}</option>
                <option value="WEEKS">{t("សប្តាហ៍", "Weeks")}</option>
                <option value="MONTHS">{t("ខែ", "Months")}</option>
              </StyledSelect>
            </div>
            <div>
              <FieldLabel>{t("រយៈពេល", "Value")}</FieldLabel>
              <input
                type="number"
                min={0}
                className={inputCls}
                value={form.durationValue}
                onChange={(e) => update("durationValue", Number(e.target.value))}
              />
            </div>
          </div>
        </Card>

      </form>

      {/* FLOATING SAVE */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-100 p-4 z-50">
        <div className="max-w-2xl mx-auto">
          <button
            type="submit"
            form="edit-form"
            disabled={saving || saved}
            className={`w-full h-12 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg ${
              saved
                ? "bg-emerald-500 text-white shadow-emerald-200"
                : saving
                ? "bg-gray-300 text-gray-500"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 size={16} />
                {t("រក្សាទុករួចរាល់!", "Saved!")}
              </>
            ) : saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Save size={15} />
                {t("រក្សាទុក", "Save Changes")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorEditPage;