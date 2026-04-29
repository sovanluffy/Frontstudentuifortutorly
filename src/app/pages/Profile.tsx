"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Loader2, ShieldCheck, GraduationCap, ArrowRight, CheckCircle2,
  Camera, Edit2, Globe, EyeOff, Plus, BookOpen, Users, Star, MapPin,
  X, Sparkles, Search, Award, Clock, DollarSign, FileText, Save,
  ChevronDown, AlertTriangle, Info, Rocket, CheckSquare,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import PortfolioEditor from "@/app/pages/tutor/PortfolioEditor";
import ProfilePublish from "@/app/pages/tutor/ProfilePublish";
import { ProfileDetails } from "@/app/pages/tutor/ProfileDetails";
import { ProfileSidebar } from "@/app/pages/tutor/ProfileSidebar";
import { useLanguage } from "@/context/LanguageContext";

/* ─────────────────────────── TYPES ─────────────────────────── */
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

interface EditProfileForm {
  bio: string;
  location: string;
  subjects: string;
  experience: string;
  hourlyRate: string;
  education: string;
  languages: string;
  availability: string;
}

const API_BASE = import.meta.env.VITE_API_BASE as string;

/* ─────────────────────────────────────────────────────────────
   HELPERS — profile completeness check
   Returns an array of missing field labels.
───────────────────────────────────────────────────────────── */
function getMissingFields(tutor: any, t: (kh: string, en: string) => string): string[] {
  const missing: string[] = [];

  if (!tutor?.bio?.trim())
    missing.push(t("ជីវប្រវត្តិ (Bio)", "Bio"));

  const edu = tutor?.education;
  const hasEdu = Array.isArray(edu)
    ? edu.length > 0
    : typeof edu === "string"
    ? edu.trim().length > 0
    : false;
  if (!hasEdu)
    missing.push(t("ការអប់រំ (Education)", "Education"));

  const exp = tutor?.experience;
  const hasExp = Array.isArray(exp)
    ? exp.length > 0
    : typeof exp === "string"
    ? exp.trim().length > 0
    : false;
  if (!hasExp)
    missing.push(t("បទពិសោធន៍ (Experience)", "Experience"));

  return missing;
}

/* ─────────────────────────────────────────────────────────────
   INCOMPLETE PROFILE POPUP — shown when tutor tries to publish
   without filling in required fields.
───────────────────────────────────────────────────────────── */
function IncompleteProfileModal({
  missingFields,
  onClose,
  onGoEdit,
  t,
}: {
  missingFields: string[];
  onClose: () => void;
  onGoEdit: () => void;
  t: (kh: string, en: string) => string;
}) {
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease both" }}
      />
      {/* Card */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-500" />

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-900 leading-tight">
                {t("ប្រវត្តិរូបមិនទាន់គ្រប់គ្រាន់", "Profile Incomplete")}
              </h3>
              <p className="text-[12px] text-gray-400 mt-0.5">
                {t("បំពេញព័ត៌មានខាងក្រោមមុននឹងចុះផ្សាយ", "Complete the fields below to publish")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors flex-shrink-0 mt-0.5"
          >
            <X size={13} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pb-5">
          {/* What's missing */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 space-y-2 mb-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 mb-2">
              {t("ព័ត៌មានដែលខ្វះ", "Missing information")}
            </p>
            {missingFields.map((field, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full border-2 border-amber-300 bg-white flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-bold text-amber-500">{i + 1}</span>
                </div>
                <span className="text-[13px] font-semibold text-amber-800">{field}</span>
              </div>
            ))}
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5">
            <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-blue-700 leading-relaxed">
              {t(
                "ប្រវត្តិរូបដែលបំពេញពេញលេញ ធ្វើឱ្យសិស្សទុកចិត្តអ្នកច្រើនជាង 3 ដង!",
                "A complete profile makes students 3× more likely to book you!"
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-[13px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              {t("ក្រោយ", "Later")}
            </button>
            <button
              onClick={onGoEdit}
              className="flex-1 py-2.5 text-[13px] font-bold text-white bg-[#1877f2] hover:bg-[#166fe5] rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <Edit2 size={13} />
              {t("កែប្រែឥឡូវ", "Edit Now")}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popIn { from { opacity:0; transform:scale(0.88) translateY(18px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   BECOME TUTOR LOADING OVERLAY — smooth animated steps
───────────────────────────────────────────────────────────── */
function BecomeTutorLoadingOverlay({ name, t }: { name: string; t: (kh: string, en: string) => string }) {
  const [step, setStep] = useState(0);

  const steps = [
    { icon: <FileText size={18} />, label: t("កំពុងដំណើរការពាក្យ...", "Processing your request...") },
    { icon: <ShieldCheck size={18} />, label: t("ផ្ទៀងផ្ទាត់គណនី...", "Verifying your account...") },
    { icon: <GraduationCap size={18} />, label: t("ដំឡើងសិទ្ធិគ្រូ...", "Granting tutor access...") },
    { icon: <Rocket size={18} />, label: t("រៀបចំផ្ទាំងគ្រប់គ្រង...", "Preparing your dashboard...") },
  ];

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setStep(i), i * 900)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-white/80 backdrop-blur-md"
      style={{ animation: "fadeIn 0.3s ease both" }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1877f2] to-[#42a5f5]" />
        <div className="p-7 flex flex-col items-center text-center">
          {/* Animated icon */}
          <div className="relative w-20 h-20 mb-5">
            <div className="absolute inset-0 rounded-full bg-[#e7f3ff] animate-ping opacity-30" />
            <div className="relative w-20 h-20 bg-[#e7f3ff] rounded-full flex items-center justify-center">
              <GraduationCap size={36} className="text-[#1877f2]" />
            </div>
          </div>

          <h3 className="text-[20px] font-bold text-gray-900 mb-1">
            {t(`ចាប់ផ្តើម, ${name.split(" ")[0]}!`, `Starting, ${name.split(" ")[0]}!`)}
          </h3>
          <p className="text-[13px] text-gray-400 mb-6">
            {t("អ្នកកំពុងក្លាយជាគ្រូបង្រៀន", "You're becoming a tutor")}
          </p>

          {/* Step list */}
          <div className="w-full space-y-2.5 mb-6">
            {steps.map((s, i) => {
              const isDone = i < step;
              const isActive = i === step;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-500 ${
                    isActive
                      ? "bg-[#e7f3ff] border border-[#1877f2]/20"
                      : isDone
                      ? "bg-green-50 border border-green-100"
                      : "bg-gray-50 border border-gray-100 opacity-40"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isDone
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-[#1877f2] text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isDone ? <CheckCircle2 size={14} /> : isActive ? <Loader2 size={14} className="animate-spin" /> : s.icon}
                  </div>
                  <span
                    className={`text-[13px] font-semibold ${
                      isDone ? "text-green-700" : isActive ? "text-[#1877f2]" : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1877f2] to-[#42a5f5] rounded-full transition-all duration-700"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popIn { from { opacity:0; transform:scale(0.88) translateY(18px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STATIC COVER PRESETS
───────────────────────────────────────────────────────────── */
const COVER_PRESETS = [
  { id: "blue",     label: "Ocean",    style: "linear-gradient(135deg, #1877f2 0%, #42a5f5 60%, #90caf9 100%)" },
  { id: "sunset",   label: "Sunset",   style: "linear-gradient(135deg, #f97316 0%, #ec4899 60%, #8b5cf6 100%)" },
  { id: "forest",   label: "Forest",   style: "linear-gradient(135deg, #065f46 0%, #059669 60%, #6ee7b7 100%)" },
  { id: "midnight", label: "Midnight", style: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #2563eb 100%)" },
  { id: "rose",     label: "Rose",     style: "linear-gradient(135deg, #be123c 0%, #f43f5e 60%, #fda4af 100%)" },
  { id: "gold",     label: "Gold",     style: "linear-gradient(135deg, #78350f 0%, #d97706 60%, #fde68a 100%)" },
] as const;

type CoverPresetId = typeof COVER_PRESETS[number]["id"];

function getStoredCover(key: string): CoverPresetId {
  try {
    const stored = localStorage.getItem(key) as CoverPresetId | null;
    return stored && COVER_PRESETS.find((p) => p.id === stored) ? stored : "blue";
  } catch { return "blue"; }
}

/* ─────────────────────────────────────────────────────────────
   CLASS CARD
───────────────────────────────────────────────────────────── */
function ClassCard({ cls, t, onClick }: { cls: OpenClass; t: (kh: string, en: string) => string; onClick: () => void }) {
  const fillPct = cls.maxStudents > 0 ? Math.round((cls.currentStudents / cls.maxStudents) * 100) : 0;
  return (
    <button onClick={onClick} className="w-full text-left group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-[#1877f2]/20 active:scale-[0.98] transition-all duration-200">
      <div className="relative h-[140px] sm:h-[160px] w-full overflow-hidden bg-gradient-to-br from-[#1877f2] to-[#42a5f5]">
        {cls.classImage ? (
          <img src={cls.classImage} alt={cls.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20"><BookOpen size={56} className="text-white" /></div>
        )}
        <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${cls.status === "ACTIVE" ? "bg-green-500/90 text-white" : "bg-gray-500/80 text-white"}`}>{cls.status}</span>
        <span className="absolute top-3 right-3 text-[13px] font-black text-white bg-[#1877f2]/90 backdrop-blur-sm px-3 py-1 rounded-full">${cls.basePrice}<span className="text-[10px] font-semibold opacity-80">/{t("នាក់", "person")}</span></span>
        {cls.subjects?.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent flex gap-1.5 flex-wrap">
            {cls.subjects.slice(0, 3).map((sub) => (
              <span key={sub} className="text-[10px] font-semibold text-white/90 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">{sub}</span>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-1 mb-1">{cls.title}</h3>
        <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed mb-3">{cls.description || t("គ្មានការពិពណ៌នា", "No description")}</p>
        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5">
          <span className="flex items-center gap-1 font-medium"><Users size={11} className="text-[#1877f2]" />{cls.currentStudents}/{cls.maxStudents} {t("សិស្ស", "students")}</span>
          <span className="font-bold text-[#1877f2]">{fillPct}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#1877f2] to-[#42a5f5] rounded-full transition-all" style={{ width: `${fillPct}%` }} />
        </div>
        {cls.location && <div className="flex items-center gap-1 mt-2.5 text-[11px] text-gray-400"><MapPin size={10} /><span className="truncate">{cls.location}</span></div>}
      </div>
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between bg-[#f0f6ff] group-hover:bg-[#e7f3ff] rounded-xl px-3 py-2.5 transition-colors">
          <span className="text-[13px] font-semibold text-[#1877f2]">{t("មើលលម្អិត", "View Details")}</span>
          <ArrowRight size={14} className="text-[#1877f2] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   COVER PICKER MODAL
───────────────────────────────────────────────────────────── */
function CoverPickerModal({ storageKey, current, onSelect, onClose }: { storageKey: string; current: CoverPresetId; onSelect: (id: CoverPresetId) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" style={{ animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-[15px] font-bold text-gray-900">Choose Cover</h3>
          <button onClick={onClose} className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"><X size={14} className="text-gray-600" /></button>
        </div>
        <div className="p-4 grid grid-cols-3 gap-3">
          {COVER_PRESETS.map((preset) => (
            <button key={preset.id} onClick={() => { onSelect(preset.id); onClose(); }}
              className={`relative h-16 rounded-xl overflow-hidden transition-all hover:scale-105 ${current === preset.id ? "ring-2 ring-[#1877f2] ring-offset-2" : ""}`}
              style={{ background: preset.style }}>
              {current === preset.id && <div className="absolute inset-0 flex items-center justify-center"><CheckCircle2 size={20} className="text-white drop-shadow" /></div>}
              <span className="absolute bottom-1 left-0 right-0 text-center text-[10px] font-bold text-white/90 drop-shadow-sm">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>
      <style>{`@keyframes popIn{from{opacity:0;transform:scale(0.9) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   WELCOME POPUP
───────────────────────────────────────────────────────────── */
function WelcomePopup({ role, name, onClose, t }: { role: "tutor" | "student"; name: string; onClose: () => void; t: (kh: string, en: string) => string }) {
  const isTutor = role === "tutor";
  const tutorPills = [
    { icon: <Plus size={12} />, label: t("បង្កើតថ្នាក់", "Create Classes") },
    { icon: <Users size={12} />, label: t("គ្រប់គ្រងសិស្ស", "Manage Students") },
    { icon: <Globe size={12} />, label: t("ប្រវត្តិរូបសាធារណៈ", "Public Profile") },
    { icon: <Star size={12} />, label: t("ពង្រឹងការវាយតម្លៃ", "Build Rating") },
  ];
  const studentPills = [
    { icon: <Search size={12} />, label: t("រកគ្រូបង្រៀន", "Find Tutors") },
    { icon: <BookOpen size={12} />, label: t("ចូលរួមថ្នាក់", "Join Classes") },
    { icon: <Star size={12} />, label: t("វាយតម្លៃគ្រូ", "Rate Tutors") },
    { icon: <GraduationCap size={12} />, label: t("ក្លាយជាគ្រូ", "Become a Tutor") },
  ];
  const pills = isTutor ? tutorPills : studentPills;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <div className="h-2 w-full bg-gradient-to-r from-[#1877f2] to-[#42a5f5]" />
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors"><X size={16} /></button>
        <div className="p-6 pt-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#e7f3ff] flex items-center justify-center mx-auto mb-4">
            {isTutor ? <GraduationCap size={32} className="text-[#1877f2]" /> : <BookOpen size={32} className="text-[#1877f2]" />}
          </div>
          <h2 className="text-[22px] font-bold text-gray-900 mb-1">{t(`សូមស្វាគមន៍មកវិញ, ${name.split(" ")[0]}! 👋`, `Welcome back, ${name.split(" ")[0]}! 👋`)}</h2>
          <p className="text-[14px] text-gray-500 mb-5">
            {isTutor ? t("អ្នកបានចូលក្នុងគណនី គ្រូបង្រៀន។", "You're signed in as a Tutor.") : t("អ្នកបានចូលក្នុងគណនី សិស្ស។", "You're signed in as a Student.")}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {pills.map((pill, i) => (
              <span key={i} className="flex items-center gap-1 text-[12px] font-semibold px-3 py-1.5 rounded-full bg-[#e7f3ff] text-[#1877f2]">{pill.icon} {pill.label}</span>
            ))}
          </div>
          <button onClick={onClose} className="w-full py-2.5 rounded-xl text-[15px] font-bold text-white bg-[#1877f2] hover:bg-[#166fe5] transition-all">
            {isTutor ? t("ទៅកាន់ប្រវត្តិរូបរបស់ខ្ញុំ", "Go to My Profile") : t("ស្វែងរកឥឡូវនេះ", "Explore Now")}
          </button>
        </div>
      </div>
      <style>{`@keyframes popIn{from{opacity:0;transform:scale(0.85) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   EDIT PROFILE MODAL
───────────────────────────────────────────────────────────── */
function EditProfileModal({
  tutor,
  token,
  onClose,
  onSaved,
}: {
  tutor: any;
  token: string | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useLanguage();
  const [form, setForm] = useState<EditProfileForm>({
    bio: tutor?.bio || "",
    location: tutor?.location || "",
    subjects: Array.isArray(tutor?.subjects) ? tutor.subjects.join(", ") : tutor?.subjects || "",
    experience: typeof tutor?.experience === "string" ? tutor.experience : "",
    hourlyRate: tutor?.hourlyRate || "",
    education: typeof tutor?.education === "string" ? tutor.education : "",
    languages: Array.isArray(tutor?.languages) ? tutor.languages.join(", ") : tutor?.languages || "",
    availability: tutor?.availability || "",
  });
  const [saving, setSaving] = useState(false);

  /* track which fields are required and missing */
  const requiredFields: (keyof EditProfileForm)[] = ["bio", "education", "experience"];
  const isMissing = (key: keyof EditProfileForm) =>
    requiredFields.includes(key) && !form[key].trim();

  const handleSave = async () => {
    if (!token) return;

    /* client-side required-field guard */
    const stillMissing = requiredFields.filter((k) => !form[k].trim());
    if (stillMissing.length > 0) {
      toast.warning(
        t("សូមបំពេញព័ត៌មានចាំបាច់!", "Please fill in all required fields!"),
        {
          description: stillMissing
            .map((k) => {
              if (k === "bio") return t("ជីវប្រវត្តិ", "Bio");
              if (k === "education") return t("ការអប់រំ", "Education");
              if (k === "experience") return t("បទពិសោធន៍", "Experience");
              return k;
            })
            .join(", "),
          icon: <AlertTriangle size={16} className="text-amber-500" />,
          duration: 4000,
        }
      );
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        subjects: form.subjects.split(",").map((s) => s.trim()).filter(Boolean),
        languages: form.languages.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const res = await fetch(`${API_BASE}/tutors/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(
          t("ធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!", "Profile updated successfully!"),
          { icon: <CheckCircle2 size={16} className="text-green-500" /> }
        );
        onSaved();
        onClose();
      } else {
        toast.error(t("បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាព", "Failed to update profile"));
      }
    } catch {
      toast.error(t("កំហុសបណ្តាញ", "Network error — please try again"));
    } finally {
      setSaving(false);
    }
  };

  type FieldDef = {
    key: keyof EditProfileForm;
    label: string;
    icon: React.ReactNode;
    placeholder: string;
    multiline?: boolean;
    required?: boolean;
  };

  const fields: FieldDef[] = [
    {
      key: "bio",
      label: t("ជីវប្រវត្តិ", "Bio"),
      icon: <FileText size={14} />,
      multiline: true,
      placeholder: t("ប្រាប់សិស្សអំពីខ្លួនអ្នក...", "Tell students about yourself..."),
      required: true,
    },
    {
      key: "education",
      label: t("ការអប់រំ", "Education"),
      icon: <Award size={14} />,
      placeholder: "BSc Mathematics, University of...",
      required: true,
    },
    {
      key: "experience",
      label: t("បទពិសោធន៍", "Experience"),
      icon: <Clock size={14} />,
      placeholder: t("ឧ. 5 ឆ្នាំបង្រៀនគណិតវិទ្យា", "e.g. 5 years teaching Mathematics"),
      required: true,
    },
    {
      key: "location",
      label: t("ទីតាំង", "Location"),
      icon: <MapPin size={14} />,
      placeholder: t("ក្រុង, ប្រទេស", "City, Country"),
    },
    {
      key: "subjects",
      label: t("មុខវិជ្ជា (ក្បៀសបំបែក)", "Subjects (comma-separated)"),
      icon: <BookOpen size={14} />,
      placeholder: "Math, Physics, Chemistry",
    },
    {
      key: "hourlyRate",
      label: t("អត្រាម៉ោង ($)", "Hourly Rate ($)"),
      icon: <DollarSign size={14} />,
      placeholder: "30",
    },
    {
      key: "languages",
      label: t("ភាសា (ក្បៀសបំបែក)", "Languages (comma-separated)"),
      icon: <Globe size={14} />,
      placeholder: "English, Khmer",
    },
    {
      key: "availability",
      label: t("ពេលទំនេរ", "Availability"),
      icon: <Clock size={14} />,
      placeholder: "Weekdays 9am–5pm",
    },
  ];

  const inputBase =
    "w-full text-[14px] text-gray-800 bg-gray-50 border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1877f2]/30 focus:border-[#1877f2] transition-all";

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        style={{ animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        {/* Top accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1877f2] to-[#42a5f5]" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#e7f3ff] rounded-lg flex items-center justify-center">
              <Edit2 size={14} className="text-[#1877f2]" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-gray-900">{t("កែប្រវត្តិរូប", "Edit Profile")}</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {t("វាលដែលមានសញ្ញា * ចាំបាច់ត្រូវបំពេញ", "Fields marked * are required to publish")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Required fields banner */}
        <div className="mx-5 mt-4 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
          <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-amber-700 leading-relaxed">
            {t(
              "Bio, ការអប់រំ និងបទពិសោធន៍ ចាំបាច់ត្រូវវានមុននឹងអ្នកអាចចុះផ្សាយប្រវត្តិរូប។",
              "Bio, Education, and Experience are required before you can publish your profile."
            )}
          </p>
        </div>

        {/* Scrollable fields */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {fields.map((field) => {
            const missing = isMissing(field.key);
            const borderCls = missing
              ? "border-red-300 focus:border-red-400 focus:ring-red-200"
              : "border-gray-200";
            return (
              <div key={field.key}>
                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  {field.icon}
                  {field.label}
                  {field.required && (
                    <span className="text-red-400 font-black ml-0.5">*</span>
                  )}
                </label>
                {field.multiline ? (
                  <textarea
                    rows={3}
                    value={form[field.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className={`${inputBase} ${borderCls} resize-none`}
                  />
                ) : (
                  <input
                    type="text"
                    value={form[field.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className={`${inputBase} ${borderCls}`}
                  />
                )}
                {missing && (
                  <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                    <AlertTriangle size={10} />
                    {t("វាលនេះចាំបាច់", "This field is required")}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50/80">
          <p className="text-[11px] text-gray-400">
            <span className="text-red-400 font-black">*</span>{" "}
            {t("ចាំបាច់ដើម្បីចុះផ្សាយ", "Required to publish")}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {t("បោះបង់", "Cancel")}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#1877f2] hover:bg-[#166fe5] disabled:opacity-60 text-white text-[13px] font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              {t("រក្សាទុក", "Save Changes")}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes popIn{from{opacity:0;transform:scale(0.9) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   COVER SECTION
───────────────────────────────────────────────────────────── */
function CoverSection({ storageKey, canEdit }: { storageKey: string; canEdit: boolean }) {
  const [coverId, setCoverId] = useState<CoverPresetId>(() => getStoredCover(storageKey));
  const [showPicker, setShowPicker] = useState(false);
  const preset = COVER_PRESETS.find((p) => p.id === coverId) ?? COVER_PRESETS[0];
  const handleSelect = (id: CoverPresetId) => {
    setCoverId(id);
    try { localStorage.setItem(storageKey, id); } catch {}
  };
  return (
    <>
      <div className="relative h-[200px] md:h-[300px] rounded-b-xl overflow-hidden" style={{ background: preset.style }}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "256px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {canEdit && (
          <button
            onClick={() => setShowPicker(true)}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-800 text-[13px] font-semibold px-3 py-1.5 rounded-lg transition-all shadow-sm"
          >
            <Camera size={13} /> Edit Cover
          </button>
        )}
      </div>
      {showPicker && (
        <CoverPickerModal
          storageKey={storageKey}
          current={coverId}
          onSelect={handleSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function TutorProfilePage() {
  const [tutor, setTutor] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [classes, setClasses] = useState<OpenClass[]>([]);
  const [loading, setLoading] = useState(true);

  const [showBecomeTutorLoading, setShowBecomeTutorLoading] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [incompleteFields, setIncompleteFields] = useState<string[]>([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "classes">("about");
  const welcomeShownRef = useRef(false);
  const { t } = useLanguage();

  const getCookieToken = () => {
    if (typeof document === "undefined") return null;
    return document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1] || null;
  };
  const token = getCookieToken();

  const parseJwt = (tok: string) => {
    try { return JSON.parse(atob(tok.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))); }
    catch { return null; }
  };

  const decodedToken = token ? parseJwt(token) : null;
  const roles = decodedToken?.roles || [];
  const isTutor = roles.includes("TUTOR");
  const isStudent = roles.includes("STUDENT");

  const fetchTutor = async () => {
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/tutors/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTutor(data);
      return data.tutorId;
    } catch { return null; }
  };

  const fetchClasses = async (tutorId: number) => {
    if (!token || !tutorId) return;
    try {
      const res = await fetch(`${API_BASE}/open-classes/tutor/${tutorId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setClasses(Array.isArray(data) ? data : []); }
    } catch {}
  };

  const fetchStudentProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/profile`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setStudent(data); }
    } catch {}
  };

  const fetchData = async () => {
    setLoading(true);
    if (isTutor) { const id = await fetchTutor(); if (id) await fetchClasses(id); }
    if (isStudent) await fetchStudentProfile();
    setLoading(false);
  };

  /* ── Become Tutor ───────────────────────────────────────── */
  const handleRequestTutor = async () => {
    if (!token) return;
    setShowBecomeTutorLoading(true);
    try {
      const res = await fetch(`${API_BASE}/profile/request-tutor`, {
        method: "POST",
        headers: { accept: "*/*", Authorization: `Bearer ${token}` },
        body: "",
      });
      if (res.ok) {
        const data = await res.json();
        await new Promise((r) => setTimeout(r, 3600));
        toast.success(t("ដាក់ពាក្យដោយជោគជ័យ!", "Tutor request submitted!"), {
          icon: <GraduationCap size={16} className="text-green-500" />,
        });
        if (data.token) {
          document.cookie = `token=${data.token}; path=/; max-age=86400`;
          setTimeout(() => window.location.reload(), 800);
        }
      } else {
        await new Promise((r) => setTimeout(r, 900));
        toast.error(t("បរាជ័យ", "Request failed"));
        setShowBecomeTutorLoading(false);
      }
    } catch {
      await new Promise((r) => setTimeout(r, 900));
      toast.error(t("កំហុសបណ្តាញ", "Network error"));
      setShowBecomeTutorLoading(false);
    }
  };

  const handleFindTutor = () => {
    toast.info(t("កំពុងស្វែងរក...", "Opening tutor search..."));
    setTimeout(() => { window.location.href = "/tutors"; }, 800);
  };

  /* ── Publish toggle — guard: check profile completeness ── */
  const handlePublishChange = (published: boolean) => {
    if (published) {
      const missing = getMissingFields(tutor, t);
      if (missing.length > 0) {
        setIncompleteFields(missing);
        setShowIncompleteModal(true);

        /* Sonner warning toast with clear description */
        toast.warning(
          t("មិនអាចផ្សព្វផ្សាយបាន!", "Profile can't be published yet!"),
          {
            description: t(
              `សូមបំពេញ: ${missing.join(", ")}`,
              `Please complete: ${missing.join(", ")}`
            ),
            icon: <AlertTriangle size={16} className="text-amber-500" />,
            duration: 5000,
          }
        );
        return;
      }
    }

    setTutor((prev: any) => prev ? { ...prev, public: published } : prev);
    toast.success(
      published
        ? t("ប្រវត្តិរូបជាសាធារណៈ!", "Profile is now Public!")
        : t("ប្រវត្តិរូបជាឯកជន", "Profile set to Private"),
      {
        icon: published
          ? <Globe size={16} className="text-green-500" />
          : <EyeOff size={16} className="text-gray-400" />,
      }
    );
    fetchData();
  };

  /* When user clicks "Edit Now" from the incomplete warning */
  const handleIncompleteGoEdit = () => {
    setShowIncompleteModal(false);
    setShowEditProfile(true);
  };

  useEffect(() => {
    fetchData().then(() => {
      if (!welcomeShownRef.current) {
        welcomeShownRef.current = true;
        setTimeout(() => setShowWelcome(true), 400);
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f0f2f5]">
        <Loader2 className="animate-spin text-[#1877f2]" size={36} />
      </div>
    );
  }

  const avatar = isTutor
    ? tutor?.profilePicture || tutor?.avatar || "https://via.placeholder.com/150"
    : student?.avatarUrl || "https://via.placeholder.com/150";
  const displayName = isTutor ? tutor?.fullname : student?.fullname || "Student";
  const coverKey = isTutor ? "tutor_cover" : "student_cover";

  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <Toaster position="top-right" richColors toastOptions={{ style: { borderRadius: "12px", fontSize: "14px" } }} />

      {/* Become Tutor Animated Loading Overlay */}
      {showBecomeTutorLoading && <BecomeTutorLoadingOverlay name={displayName} t={t} />}

      {/* Incomplete Profile Modal */}
      {showIncompleteModal && (
        <IncompleteProfileModal
          missingFields={incompleteFields}
          onClose={() => setShowIncompleteModal(false)}
          onGoEdit={handleIncompleteGoEdit}
          t={t}
        />
      )}

      {/* Welcome Popup */}
      {showWelcome && (
        <WelcomePopup
          role={isTutor ? "tutor" : "student"}
          name={displayName}
          t={t}
          onClose={() => {
            setShowWelcome(false);
            toast.success(
              t(`សូមស្វាគមន៍, ${displayName.split(" ")[0]}!`, `Welcome, ${displayName.split(" ")[0]}!`),
              {
                description: isTutor
                  ? t("ផ្ទាំងគ្រប់គ្រងរបស់អ្នករួចរាល់។", "Your dashboard is ready.")
                  : t("រកគ្រូល្អបំផុតថ្ងៃនេះ។", "Find your perfect tutor today."),
              }
            );
          }}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && isTutor && (
        <EditProfileModal
          tutor={tutor}
          token={token}
          onClose={() => setShowEditProfile(false)}
          onSaved={fetchData}
        />
      )}

      {/* ── COVER + PROFILE HEADER ── */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[940px] mx-auto">
          <CoverSection storageKey={coverKey} canEdit={true} />
          <div className="px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-10 md:-mt-14 pb-4 border-b border-gray-200">
              {/* Left — avatar + name */}
              <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4">
                <div className="relative self-start">
                  <img
                    src={avatar}
                    alt={displayName}
                    className="w-[120px] h-[120px] md:w-[148px] md:h-[148px] rounded-full border-4 border-white object-cover shadow-md bg-white"
                  />
                  <button
                    onClick={() => toast.info(t("មុខងារនឹងមកដល់ឆាប់ៗ!", "Avatar upload coming soon!"))}
                    className="absolute bottom-1.5 right-1.5 w-8 h-8 bg-[#e4e6ea] hover:bg-[#d8dadf] rounded-full flex items-center justify-center shadow transition-colors"
                  >
                    <Camera size={14} className="text-gray-700" />
                  </button>
                </div>
                <div className="pb-1 md:pb-3">
                  <h1 className="text-[22px] md:text-[28px] font-bold text-gray-900 leading-tight">{displayName}</h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#e7f3ff] text-[#1877f2]">
                      {isTutor ? t("គ្រូបង្រៀន", "Tutor") : t("សិស្ស", "Student")}
                    </span>
                    {isTutor && tutor?.public && (
                      <span className="flex items-center gap-1 text-[12px] text-green-600 font-medium">
                        <Globe size={11} /> {t("សាធារណៈ", "Public")}
                      </span>
                    )}
                    {isTutor && !tutor?.public && (
                      <span className="flex items-center gap-1 text-[12px] text-gray-400">
                        <EyeOff size={11} /> {t("ឯកជន", "Private")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right — action buttons */}
              <div className="flex flex-wrap items-center gap-2 pb-1 md:pb-3">
                {isTutor ? (
                  <div className="flex items-center gap-2">
                    <PortfolioEditor tutor={tutor} token={token} onRefresh={fetchData} />
                    <ProfilePublish
                      token={token}
                      initialPublished={tutor?.public || false}
                      onRefresh={() => handlePublishChange(!tutor?.public)}
                    />
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleFindTutor}
                      className="flex items-center gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white text-[14px] font-semibold px-5 py-2 rounded-lg transition-colors"
                    >
                      <Search size={15} /> {t("រកគ្រូ", "Find a Tutor")}
                    </button>
                    <button
                      onClick={handleRequestTutor}
                      disabled={showBecomeTutorLoading}
                      className="flex items-center gap-2 bg-white hover:bg-[#f0f2f5] disabled:opacity-60 text-[#1877f2] border border-[#1877f2] text-[14px] font-semibold px-5 py-2 rounded-lg transition-colors"
                    >
                      <GraduationCap size={15} />
                      {t("ក្លាយជាគ្រូ", "Become a Tutor")}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Tab bar — tutor only */}
            {isTutor && (
              <div className="flex gap-1 -mb-px">
                {[
                  { key: "about", label: t("អំពី", "About") },
                  { key: "classes", label: `${t("ថ្នាក់", "Classes")} (${classes.length})` },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-4 py-3 text-[15px] font-semibold border-b-[3px] transition-colors ${
                      activeTab === tab.key
                        ? "border-[#1877f2] text-[#1877f2]"
                        : "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-t-lg"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PAGE BODY ── */}
      <div className="max-w-[940px] mx-auto px-0 sm:px-4 md:px-6 py-4">

        {/* TUTOR LAYOUT */}
        {isTutor && tutor && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-3 px-4 sm:px-0">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[17px] font-bold text-gray-900">{t("ការណែនាំ", "Intro")}</h2>
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="flex items-center gap-1 text-[12px] text-[#1877f2] hover:bg-[#e7f3ff] px-2 py-1 rounded-lg transition-colors font-semibold"
                  >
                    <Edit2 size={12} /> {t("កែ", "Edit")}
                  </button>
                </div>
                {tutor?.bio ? (
                  <p className="text-[14px] text-gray-700 leading-relaxed text-center mb-3">{tutor.bio}</p>
                ) : (
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="w-full text-[13px] text-[#1877f2] hover:bg-[#e7f3ff] py-2 rounded-lg transition-colors font-semibold mb-2"
                  >
                    + {t("បន្ថែមជីវប្រវត្តិ", "Add a bio")}
                  </button>
                )}
                {tutor?.location && (
                  <div className="flex items-center gap-2 text-[14px] text-gray-600 py-1">
                    <MapPin size={15} className="text-gray-400 shrink-0" />
                    <span>{t("រស់នៅ", "Lives in")} <strong className="text-gray-900">{tutor.location}</strong></span>
                  </div>
                )}
                {tutor?.subjects?.length > 0 && (
                  <div className="flex items-start gap-2 text-[14px] text-gray-600 py-1">
                    <BookOpen size={15} className="text-gray-400 shrink-0 mt-0.5" />
                    <span>{t("បង្រៀន", "Teaches")} <strong className="text-gray-900">{tutor.subjects.join(", ")}</strong></span>
                  </div>
                )}
                {tutor?.tutorRating > 0 && (
                  <div className="flex items-center gap-2 text-[14px] text-gray-600 py-1">
                    <Star size={15} className="text-yellow-400 shrink-0" />
                    <span>{t("ការវាយតម្លៃ", "Rated")} <strong className="text-gray-900">{tutor.tutorRating}/5</strong></span>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <ProfileSidebar tutor={tutor} />
              </div>
            </div>

            {/* Main */}
            <div className="lg:col-span-3 space-y-3">
              {(activeTab === "about" || (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
                <div className="bg-white rounded-xl shadow-sm p-4 mx-4 sm:mx-0">
                  <ProfileDetails tutor={tutor} />
                </div>
              )}
              <div className={`bg-white rounded-none sm:rounded-xl shadow-sm ${activeTab === "about" ? "hidden lg:block" : ""}`}>
                <div className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-3 border-b border-gray-100">
                  <div>
                    <h2 className="text-[17px] font-bold text-gray-900">{t("ថ្នាក់រៀន", "Classes")}</h2>
                    <p className="text-[13px] text-gray-500">{classes.length} {t("សកម្ម", "active")}</p>
                  </div>
                </div>
                {classes.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <BookOpen size={28} className="text-gray-300" />
                    </div>
                    <p className="text-[15px] font-semibold text-gray-400">{t("មិនទាន់មានថ្នាក់", "No classes yet")}</p>
                    <p className="text-[13px] text-gray-300 mt-1">{t("ថ្នាក់របស់អ្នកនឹងបង្ហាញនៅទីនេះ", "Your classes will appear here")}</p>
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {classes.map((cls) => (
                      <ClassCard
                        key={cls.classId}
                        cls={cls}
                        t={t}
                        onClick={() => toast.info(`Opening "${cls.title}"...`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STUDENT LAYOUT ── */}
        {isStudent && !isTutor && student && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 px-4 sm:px-0">
            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-3">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-[17px] font-bold text-gray-900 mb-3">{t("ការណែនាំ", "Intro")}</h2>
                <div className="space-y-3">
                  {[
                    { label: t("ឈ្មោះពេញ", "Full Name"), value: student.fullname },
                    { label: t("អ៊ីមែល", "Email"), value: student.email },
                    { label: t("ទូរស័ព្ទ", "Phone"), value: student.phone || t("មិនបានផ្ដល់", "Not provided") },
                    { label: t("ទីតាំង", "Location"), value: student.fullAddress || t("មិនបានកំណត់", "Not set") },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{item.label}</span>
                      <span className="text-[14px] text-gray-800 font-medium mt-0.5">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-[15px] font-bold text-gray-900 mb-3">{t("ស្ថិតិ", "Stats")}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: t("ថ្នាក់បានចូលរួម", "Classes Joined"), value: "—", icon: <BookOpen size={16} className="text-[#1877f2]" /> },
                    { label: t("គ្រូដែលបាន​ស្វែងរក", "Tutors Viewed"), value: "—", icon: <Users size={16} className="text-[#1877f2]" /> },
                  ].map((s, i) => (
                    <div key={i} className="bg-[#f0f6ff] rounded-xl p-3 flex flex-col gap-1">
                      {s.icon}
                      <span className="text-[20px] font-black text-[#1877f2]">{s.value}</span>
                      <span className="text-[11px] text-gray-500 font-medium leading-tight">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main */}
            <div className="lg:col-span-3 space-y-3">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-[#1877f2] to-[#42a5f5]" />
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-[#e7f3ff] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={28} className="text-[#1877f2]" />
                  </div>
                  <h3 className="text-[18px] font-bold text-gray-900 mb-2">{t("រកគ្រូបង្រៀនដ៏ល្អ", "Find Your Perfect Tutor")}</h3>
                  <p className="text-[14px] text-gray-500 max-w-xs mx-auto mb-5 leading-relaxed">
                    {t("រកមើលគ្រូបង្រៀនដែលបានផ្ទៀងផ្ទាត់រាប់រយនាក់គ្រប់មុខវិជ្ជា។", "Browse hundreds of verified tutors across every subject.")}
                  </p>
                  <button
                    onClick={handleFindTutor}
                    className="inline-flex items-center gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white text-[15px] font-semibold px-7 py-2.5 rounded-lg transition-colors"
                  >
                    <Search size={16} /> {t("រកឥឡូវ", "Browse Tutors")}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-[#42a5f5] to-[#1877f2]" />
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-[#e7f3ff] rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap size={28} className="text-[#1877f2]" />
                  </div>
                  <h3 className="text-[18px] font-bold text-gray-900 mb-2">{t("ក្លាយជាគ្រូបង្រៀន", "Become a Tutor")}</h3>
                  <p className="text-[14px] text-gray-500 max-w-xs mx-auto mb-5 leading-relaxed">
                    {t("ចែករំលែកចំណេះដឹង បង្កើតថ្នាក់ ហើយកំណត់ផ្ទាល់ខ្លួន។", "Share your knowledge, create classes, set your own schedule and rates.")}
                  </p>
                  <button
                    onClick={handleRequestTutor}
                    disabled={showBecomeTutorLoading}
                    className="inline-flex items-center gap-2 bg-white hover:bg-[#f0f6ff] disabled:opacity-60 text-[#1877f2] border-2 border-[#1877f2] text-[15px] font-semibold px-7 py-2.5 rounded-lg transition-colors"
                  >
                    <GraduationCap size={16} />
                    {t("ចាប់ផ្តើម", "Get Started")}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-[15px] font-bold text-gray-900 mb-3">{t("ទំព័រ​ដែល​ខ្ញុំ​ចូលចិត្ត", "Quick Links")}</h2>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: <BookOpen size={16} />, label: t("ថ្នាក់ទាំងអស់", "All Classes"), href: "/classes" },
                    { icon: <Users size={16} />, label: t("គ្រូទាំងអស់", "All Tutors"), href: "/tutors" },
                    { icon: <Star size={16} />, label: t("ថ្នាក់ល្អ", "Top Rated"), href: "/classes?sort=rating" },
                    { icon: <MapPin size={16} />, label: t("នៅជិតខ្ញុំ", "Near Me"), href: "/classes?nearby=1" },
                  ].map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#f0f2f5] hover:bg-[#e7f3ff] text-gray-700 hover:text-[#1877f2] text-[13px] font-semibold transition-colors"
                    >
                      <span className="text-[#1877f2]">{link.icon}</span>{link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}