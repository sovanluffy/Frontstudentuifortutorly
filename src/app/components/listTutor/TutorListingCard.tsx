import {
  Star,
  MapPin,
  Users,
  BookOpen,
  Clock,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

/* ================= TYPES ================= */
interface ClassProps {
  classItem: {
    classId: number;
    title: string;
    description?: string;
    status?: string;

    tutor?: {
      tutorId: number;
      name: string;
      avatar?: string;
      rating?: number;
    };

    location?: string;
    specificAddress?: string;

    subjects?: string[];
    learningModes?: string[];

    basePrice?: number;
    maxStudents?: number;
    currentStudents?: number;

    classImage?: string;

    isNew?: boolean;
    createdAt?: string;

    confirmedStudents?: {
      studentId: number;
      studentName: string;
      avatar?: string;
      email?: string;
    }[];

    schedules?: {
      id: number;
      day: string;
      startTime: string;
      endTime: string;
      maxStudents: number;
      bookedCount: number;
    }[];
  };
}

/* ================= SUBJECT COLORS ================= */
const getSubjectColor = (subject: string) => {
  const s = subject.toLowerCase();

  if (s.includes("math")) return "bg-blue-100 text-blue-700";
  if (s.includes("physics")) return "bg-purple-100 text-purple-700";
  if (s.includes("chem")) return "bg-green-100 text-green-700";
  if (s.includes("english")) return "bg-amber-100 text-amber-700";
  if (s.includes("it") || s.includes("computer"))
    return "bg-indigo-100 text-indigo-700";

  return "bg-slate-100 text-slate-700";
};

export function ClassListingCard({ classItem }: ClassProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const rating = classItem.tutor?.rating ?? 0;

  const isFull =
    (classItem.currentStudents || 0) >= (classItem.maxStudents || 0);

  const statusLabel = isFull
    ? "FULL"
    : classItem.isNew
    ? "NEW"
    : classItem.status || "OPEN";

  const statusColor = isFull
    ? "bg-red-600"
    : classItem.isNew
    ? "bg-emerald-600"
    : "bg-blue-600";

  const description =
    classItem.description?.trim() || "No description available.";

  const isLong = description.length > 120;

  const displayDesc =
    expanded || !isLong
      ? description
      : description.slice(0, 120) + "...";

  return (
    <div className="
      bg-white rounded-xl border border-slate-100
      shadow-sm hover:shadow-md transition
      overflow-hidden cursor-pointer
      flex flex-col
    ">

      {/* IMAGE */}
      <div className="relative aspect-[4/3] bg-slate-50">

        <img
          src={
            classItem.classImage ||
            `https://ui-avatars.com/api/?name=${classItem.title}`
          }
          className="w-full h-full object-cover"
        />

        {/* STATUS */}
        <div className={`absolute top-2 right-2 ${statusColor} text-white text-[10px] px-2 py-1 rounded-md`}>
          {statusLabel}
        </div>

        {/* PRICE */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] px-2 py-1 rounded-md">
          ${classItem.basePrice || 0}/hr
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3 flex flex-col gap-2">

        {/* TITLE */}
        <h3 className="text-sm font-bold text-slate-900 truncate">
          {classItem.title}
        </h3>

        {/* TUTOR */}
        <div className="flex items-center gap-2 text-[11px] text-slate-600">
          <img
            src={
              classItem.tutor?.avatar ||
              `https://ui-avatars.com/api/?name=${classItem.tutor?.name}`
            }
            className="w-5 h-5 rounded-full"
          />
          <span className="font-medium">
            {classItem.tutor?.name}
          </span>

          <Star size={12} className="text-amber-500 fill-amber-500 ml-auto" />
          <span>{rating.toFixed(1)}</span>
        </div>

        {/* LOCATION + STUDENTS */}
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <MapPin size={10} />
            {classItem.location || "Remote"}
          </div>

          <div className="flex items-center gap-1">
            <Users size={10} />
            {classItem.currentStudents || 0}/{classItem.maxStudents || 0}
          </div>
        </div>

        {/* SUBJECTS */}
        <div className="flex flex-wrap gap-1">
          {classItem.subjects?.length ? (
            classItem.subjects.slice(0, 3).map((s, i) => (
              <span
                key={i}
                className={`text-[9px] px-2 py-1 rounded-md ${getSubjectColor(s)}`}
              >
                {s}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-slate-400">
              No subjects
            </span>
          )}
        </div>

        {/* DESCRIPTION */}
        <p className="text-[11px] text-slate-600">
          {displayDesc}
        </p>

        {isLong && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="text-blue-600 text-[10px] w-fit"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

        {/* SCHEDULE */}
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <CalendarDays size={10} />
          {classItem.schedules?.[0]?.day || "Flexible"}
          <Clock size={10} className="ml-2" />
          {classItem.schedules?.[0]?.startTime || "--:--"}
        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate(`/class/${classItem.classId}`)}
          className="
            mt-2 bg-blue-600 text-white
            text-[11px] py-2 rounded-lg
            hover:bg-blue-700 transition
          "
        >
          View Class
        </button>
      </div>
    </div>
  );
}