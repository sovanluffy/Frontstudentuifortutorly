import * as React from "react";
import { useLoaderData } from "react-router-dom";
import {
  Star,
  Users,
  MapPin,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  PlayCircle,
  ExternalLink,
  Award,
  BookOpen,
  Loader2,
  Globe,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { ClassListingCard } from "../components/listClass/ClassCard";
import { useClasses } from "@/hooks/useClasses";
import { useLanguage } from "@/context/LanguageContext";

/* ─────────────────────────────────────────────────────────────
   COVER PRESETS
───────────────────────────────────────────────────────────── */
const COVER_PRESETS = [
  { id: "blue",     style: "linear-gradient(135deg, #1877f2 0%, #42a5f5 60%, #90caf9 100%)" },
  { id: "sunset",   style: "linear-gradient(135deg, #f97316 0%, #ec4899 60%, #8b5cf6 100%)" },
  { id: "forest",   style: "linear-gradient(135deg, #065f46 0%, #059669 60%, #6ee7b7 100%)" },
  { id: "midnight", style: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #2563eb 100%)" },
  { id: "rose",     style: "linear-gradient(135deg, #be123c 0%, #f43f5e 60%, #fda4af 100%)" },
  { id: "gold",     style: "linear-gradient(135deg, #78350f 0%, #d97706 60%, #fde68a 100%)" },
] as const;

function getTutorCover(tutorId?: number): string {
  if (!tutorId) return COVER_PRESETS[0].style;
  return COVER_PRESETS[tutorId % COVER_PRESETS.length].style;
}

/* ─────────────────────────────────────────────────────────────
   COLLAPSIBLE CARD — mobile accordion
───────────────────────────────────────────────────────────── */
function CollapsibleCard({
  icon,
  title,
  defaultOpen = true,
  accentColor = "#1877f2",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  defaultOpen?: boolean;
  accentColor?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `${accentColor}18`, color: accentColor }}
          >
            {icon}
          </div>
          <span className="text-[14px] font-bold text-gray-900">{title}</span>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-gray-400 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-gray-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-50">{children}</div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   EXPERIENCE LIST
───────────────────────────────────────────────────────────── */
function ExperienceList({ experience }: { experience?: any[] }) {
  if (!experience?.length)
    return (
      <p className="text-[13px] text-gray-400 italic pt-3">
        No experience listed.
      </p>
    );
  return (
    <div className="space-y-4 pt-3">
      {experience.map((e: any, i: number) => (
        <div key={i} className="flex gap-3 relative">
          {i !== experience.length - 1 && (
            <div className="absolute left-3.5 top-7 w-px h-full bg-gray-100" />
          )}
          <div className="z-10 bg-white border-2 border-blue-400 w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[9px] font-bold text-blue-500">{i + 1}</span>
          </div>
          <div>
            <p className="font-bold text-[13px] text-gray-900">{e.role}</p>
            <p className="text-[12px] text-blue-500 font-medium">{e.company}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 uppercase font-semibold tracking-wider">
              {e.duration}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   EDUCATION LIST
───────────────────────────────────────────────────────────── */
function EducationList({
  education,
  t,
}: {
  education?: any[];
  t: (kh: string, en: string) => string;
}) {
  if (!education?.length)
    return (
      <p className="text-[13px] text-gray-400 italic pt-3">
        {t("គ្មានព័ត៌មាន", "No education listed.")}
      </p>
    );
  return (
    <div className="grid gap-2.5 pt-3">
      {education.map((e: any, i: number) => (
        <div key={i} className="bg-indigo-950/90 p-3.5 rounded-xl">
          <p className="font-bold text-indigo-300 text-[13px]">{e.school}</p>
          <p className="text-slate-300 text-[11px]">{e.degree}</p>
          <span className="text-[9px] font-bold bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded mt-1.5 inline-block uppercase tracking-widest">
            {e.year}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STAT PILL
───────────────────────────────────────────────────────────── */
function StatPill({
  icon,
  value,
  color,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold"
      style={{ background: `${color}15`, color }}
    >
      {icon}
      {value}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CLASSES SECTION (shared between mobile + desktop)
───────────────────────────────────────────────────────────── */
function ClassesSection({
  classes,
  classesLoading,
  t,
  cols = "grid-cols-1 sm:grid-cols-2",
}: {
  classes: any[];
  classesLoading: boolean;
  t: (kh: string, en: string) => string;
  cols?: string;
}) {
  return (
    <>
      {classesLoading ? (
        <div className={`grid ${cols} gap-3`}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-52 bg-slate-100 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : classes?.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <BookOpen size={28} className="text-gray-300 mx-auto mb-2" />
          <p className="text-[13px] text-gray-400">
            {t("មិនទាន់មានថ្នាក់", "No classes available yet")}
          </p>
        </div>
      ) : (
        <div className={`grid ${cols} gap-3`}>
          {classes?.map((c: any) => (
            <ClassListingCard key={c.classId} classItem={c} />
          ))}
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function TutorDetailPage() {
  const tutor = useLoaderData() as any;
  const { classes, loading: classesLoading } = useClasses(tutor?.tutorId);
  const { t } = useLanguage();

  if (!tutor) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#1877f2] animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">
          {t("កំពុងផ្ទុកប្រវត្តិរូបគ្រូ...", "Loading tutor profile…")}
        </p>
      </div>
    );
  }

  const coverStyle = getTutorCover(tutor?.tutorId);
  const ratingDisplay =
    tutor?.rating != null ? Number(tutor.rating).toFixed(2) : "5.00";

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        background: "#f0f2f5",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* ══════════════════════════════════════
          COVER + PROFILE HEADER
      ══════════════════════════════════════ */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[940px] mx-auto">

          {/* Cover banner */}
          <div
            className="relative h-[150px] sm:h-[220px] md:h-[300px] overflow-hidden"
            style={{ background: coverStyle }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
                backgroundSize: "256px",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Avatar + name row */}
          <div className="px-3 sm:px-5 md:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 -mt-10 sm:-mt-12 md:-mt-14 pb-3 border-b border-gray-200">

              {/* Left: avatar + name */}
              <div className="flex items-end gap-3">
                <div className="relative shrink-0">
                  <img
                    src={
                      tutor?.profilePicture ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        tutor?.fullname || "T"
                      )}&size=160`
                    }
                    alt={tutor?.fullname}
                    className="w-[88px] h-[88px] sm:w-[120px] sm:h-[120px] md:w-[148px] md:h-[148px] rounded-full border-4 border-white object-cover shadow-lg bg-white"
                  />
                  <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-2 border-white rounded-full shadow" />
                </div>

                <div className="pb-1 sm:pb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h1 className="text-[17px] sm:text-[22px] md:text-[26px] font-extrabold text-gray-900 leading-tight">
                      {tutor?.fullname}
                    </h1>
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e7f3ff] text-[#1877f2]">
                      <ShieldCheck size={10} />
                      {t("បានផ្ទៀងផ្ទាត់", "Verified")}
                    </span>
                  </div>

                  {/* Subject pills */}
                  {tutor?.subjects?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {tutor.subjects.slice(0, 3).map((sub: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stat pills — sm and above */}
                  <div className="hidden sm:flex flex-wrap gap-2 mt-2">
                    <StatPill
                      icon={<Star size={12} className="fill-current" />}
                      value={ratingDisplay}
                      color="#f59e0b"
                    />
                    <StatPill
                      icon={<Users size={12} />}
                      value={`${tutor?.studentsTaught || 0} ${t("សិស្ស", "students")}`}
                      color="#1877f2"
                    />
                    {tutor?.location && (
                      <StatPill
                        icon={<MapPin size={12} />}
                        value={tutor.location}
                        color="#64748b"
                      />
                    )}
                    {tutor?.hourlyRate && (
                      <StatPill
                        icon={<DollarSign size={12} />}
                        value={`$${tutor.hourlyRate}/hr`}
                        color="#059669"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Contact button */}
              <div className="pb-1 sm:pb-3 self-end">
                {tutor?.telegram && (
                  <a
                    href={`https://t.me/${tutor.telegram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#1877f2] hover:bg-[#166fe5] active:scale-95 text-white text-[13px] font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    <Globe size={14} />
                    {t("ទំនាក់ទំនង", "Contact")}
                  </a>
                )}
              </div>
            </div>

            {/* Stat pills — mobile only */}
            <div className="flex sm:hidden flex-wrap gap-2 py-3">
              <StatPill
                icon={<Star size={12} className="fill-current" />}
                value={ratingDisplay}
                color="#f59e0b"
              />
              <StatPill
                icon={<Users size={12} />}
                value={`${tutor?.studentsTaught || 0} ${t("សិស្ស", "students")}`}
                color="#1877f2"
              />
              {tutor?.location && (
                <StatPill
                  icon={<MapPin size={12} />}
                  value={tutor.location}
                  color="#64748b"
                />
              )}
              {tutor?.hourlyRate && (
                <StatPill
                  icon={<DollarSign size={12} />}
                  value={`$${tutor.hourlyRate}/hr`}
                  color="#059669"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          PAGE BODY
          Mobile  : single column — info cards first, classes last
          Desktop : 5-col sidebar | 7-col classes
      ══════════════════════════════════════ */}
      <div className="max-w-[940px] mx-auto px-3 sm:px-5 md:px-6 py-4">

        {/* ── MOBILE (< lg) ── */}
        <div className="flex flex-col gap-3 lg:hidden">

          {/* 1. About */}
          <CollapsibleCard
            icon={<BookOpen size={15} />}
            title={t("ការណែនាំ", "About")}
            accentColor="#1877f2"
            defaultOpen
          >
            <p className="text-[13px] text-gray-600 leading-relaxed pt-3">
              {tutor?.bio || t("គ្មានព័ត៌មានបន្ថែម", "No bio available.")}
            </p>
            <div className="mt-3 space-y-2">
              {tutor?.location && (
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <MapPin size={13} className="text-gray-400 shrink-0" />
                  <span>
                    {t("រស់នៅ", "Lives in")}{" "}
                    <strong className="text-gray-900">{tutor.location}</strong>
                  </span>
                </div>
              )}
              {tutor?.languages?.length > 0 && (
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <Globe size={13} className="text-gray-400 shrink-0" />
                  <span>
                    {t("ភាសា", "Speaks")}{" "}
                    <strong className="text-gray-900">{tutor.languages.join(", ")}</strong>
                  </span>
                </div>
              )}
              {tutor?.availability && (
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <Clock size={13} className="text-gray-400 shrink-0" />
                  <span className="text-gray-900">{tutor.availability}</span>
                </div>
              )}
            </div>
          </CollapsibleCard>

          {/* 2. Experience */}
          <CollapsibleCard
            icon={<Briefcase size={15} />}
            title={t("បទពិសោធន៍", "Experience")}
            accentColor="#3b82f6"
            defaultOpen={false}
          >
            <ExperienceList experience={tutor?.experience} />
          </CollapsibleCard>

          {/* 3. Education */}
          <CollapsibleCard
            icon={<GraduationCap size={15} />}
            title={t("ការអប់រំ", "Education")}
            accentColor="#6366f1"
            defaultOpen={false}
          >
            <EducationList education={tutor?.education} t={t} />
          </CollapsibleCard>

          {/* 4. Intro Video */}
          <CollapsibleCard
            icon={<PlayCircle size={15} />}
            title={t("វីដេអូណែនាំ", "Intro Video")}
            accentColor="#8b5cf6"
            defaultOpen={false}
          >
            <div className="pt-3 group relative aspect-video bg-[#f0f2f5] rounded-xl flex items-center justify-center overflow-hidden cursor-pointer border border-gray-200 hover:border-[#1877f2] transition-all">
              {tutor?.introVideoUrl ? (
                <>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all" />
                  <PlayCircle
                    className="text-[#1877f2] z-10 group-hover:scale-110 transition-transform"
                    size={44}
                  />
                </>
              ) : (
                <p className="text-[13px] text-gray-400 italic">
                  {t("វីដេអូនឹងមកដល់ឆាប់ៗ", "Video coming soon")}
                </p>
              )}
            </div>
          </CollapsibleCard>

          {/* 5. Certificates */}
          {tutor?.certificateImages?.length > 0 && (
            <CollapsibleCard
              icon={<Award size={15} />}
              title={t("វិញ្ញាបនប័ត្រ", "Certificates")}
              accentColor="#f59e0b"
              defaultOpen={false}
            >
              <div className="grid grid-cols-3 gap-2 pt-3">
                {tutor.certificateImages.map((img: string, i: number) => (
                  <div
                    key={i}
                    className="group relative rounded-xl overflow-hidden aspect-square border border-gray-100"
                  >
                    <img src={img} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-[#1877f2]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ExternalLink className="text-white" size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleCard>
          )}

          {/* 6. Classes — always last on mobile */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "#1877f215", color: "#1877f2" }}
                >
                  <BookOpen size={15} />
                </div>
                <span className="text-[14px] font-bold text-gray-900">
                  {t("ថ្នាក់រៀន", "Classes")}
                </span>
              </div>
              <span className="bg-[#1877f2] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {classes?.length || 0}
              </span>
            </div>
            <div className="p-3">
              <ClassesSection
                classes={classes || []}
                classesLoading={classesLoading}
                t={t}
                cols="grid-cols-1 sm:grid-cols-2"
              />
            </div>
          </div>
        </div>

        {/* ── DESKTOP (lg+) ── */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-5">

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">

            {/* About */}
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-[#1877f215] text-[#1877f2] flex items-center justify-center">
                  <BookOpen size={15} />
                </div>
                <h2 className="text-[15px] font-bold text-gray-900">
                  {t("ការណែនាំ", "About")}
                </h2>
              </div>
              <p className="text-[13px] text-gray-600 leading-relaxed">{tutor?.bio}</p>
              <div className="mt-3 space-y-2">
                {tutor?.location && (
                  <div className="flex items-center gap-2 text-[13px] text-gray-600">
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    <span>
                      {t("រស់នៅ", "Lives in")}{" "}
                      <strong className="text-gray-900">{tutor.location}</strong>
                    </span>
                  </div>
                )}
                {tutor?.languages?.length > 0 && (
                  <div className="flex items-center gap-2 text-[13px] text-gray-600">
                    <Globe size={14} className="text-gray-400 shrink-0" />
                    <span>
                      {t("ភាសា", "Speaks")}{" "}
                      <strong className="text-gray-900">{tutor.languages.join(", ")}</strong>
                    </span>
                  </div>
                )}
                {tutor?.availability && (
                  <div className="flex items-center gap-2 text-[13px] text-gray-600">
                    <Clock size={14} className="text-gray-400 shrink-0" />
                    <span className="text-gray-900">{tutor.availability}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Briefcase size={15} />
                </div>
                <h2 className="text-[15px] font-bold text-gray-900">
                  {t("បទពិសោធន៍", "Experience")}
                </h2>
              </div>
              <ExperienceList experience={tutor?.experience} />
            </div>

            {/* Education */}
            <div
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #2563eb 100%)",
              }}
            >
              <div className="absolute -bottom-4 -right-4 opacity-10 rotate-12">
                <GraduationCap size={90} color="white" />
              </div>
              <h2 className="text-[14px] font-bold mb-4 flex items-center gap-2 relative z-10 text-indigo-200">
                <GraduationCap size={16} className="text-indigo-400" />
                {t("ការអប់រំ", "Education")}
              </h2>
              <EducationList education={tutor?.education} t={t} />
            </div>

            {/* Intro Video */}
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                {t("វីដេអូណែនាំ", "Intro Video")}
              </p>
              <div className="group relative aspect-video bg-[#f0f2f5] rounded-xl flex items-center justify-center overflow-hidden cursor-pointer border border-gray-200 hover:border-[#1877f2] transition-all">
                {tutor?.introVideoUrl ? (
                  <>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all" />
                    <PlayCircle
                      className="text-[#1877f2] z-10 group-hover:scale-110 transition-transform"
                      size={48}
                    />
                  </>
                ) : (
                  <p className="text-[13px] text-gray-400 italic">
                    {t("វីដេអូនឹងមកដល់ឆាប់ៗ", "Video coming soon")}
                  </p>
                )}
              </div>
            </div>

            {/* Certificates */}
            {tutor?.certificateImages?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    {t("វិញ្ញាបនប័ត្រ", "Certificates")}
                  </p>
                  <Award size={14} className="text-[#1877f2]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {tutor.certificateImages.map((img: string, i: number) => (
                    <div
                      key={i}
                      className="group relative rounded-xl overflow-hidden aspect-square border border-gray-100"
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-[#1877f2]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ExternalLink className="text-white" size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main: Classes */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-[17px] font-bold text-gray-900">
                  {t("ថ្នាក់រៀន", "Available Classes")}
                </h2>
                <span className="bg-[#1877f2] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {classes?.length || 0}
                </span>
              </div>
              <div className="p-4">
                <ClassesSection
                  classes={classes || []}
                  classesLoading={classesLoading}
                  t={t}
                  cols="grid-cols-1 md:grid-cols-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}