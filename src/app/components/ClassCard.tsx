import React, { useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, User, Star, Eye } from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */
interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface ExtendedOpenClass {
  classId: number;
  title: string;
  description: string;
  status: "OPEN" | "FULL" | "CLOSED" | "ARCHIVED";
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
  classImage: string;
  schedules?: Schedule[];
}

interface ClassCardProps {
  openClass: ExtendedOpenClass;
}

/* ================= COMPONENT ================= */
const ClassCardComponent = ({ openClass }: ClassCardProps) => {
  const navigate = useNavigate();

  const isFull =
    openClass.status !== "OPEN" ||
    openClass.currentStudents >= openClass.maxStudents;

  const enrollmentPercentage = useMemo(() => {
    if (!openClass.maxStudents) return 0;
    return Math.min(
      (openClass.currentStudents / openClass.maxStudents) * 100,
      100
    );
  }, [openClass.currentStudents, openClass.maxStudents]);

  // Unified navigation to Detail Page
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/classes/${openClass.classId}`);
  };

  return (
    <article
      onClick={handleViewDetails}
      className={cn(
        "group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden",
        "hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      )}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={openClass.classImage || "https://via.placeholder.com/400x250"}
          alt={openClass.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* TOP BADGES */}
        <div className="absolute top-3 inset-x-3 flex justify-between items-start">
          <span
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md",
              isFull ? "bg-slate-900/80 text-white" : "bg-white/90 text-indigo-600"
            )}
          >
            {isFull ? "Full" : "Open"}
          </span>
          
          <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-[11px] font-bold text-slate-700">
              {openClass.tutorRating ?? "5.0"}
            </span>
          </div>
        </div>

        {/* OVERLAY ON HOVER */}
        <div className="absolute inset-0 bg-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <div className="bg-white p-2 rounded-full shadow-lg scale-75 group-hover:scale-100 transition-transform duration-300">
                <Eye size={20} className="text-indigo-600" />
             </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">
        {/* TITLE & PRICE */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <h2 className="text-[15px] font-extrabold text-slate-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
            {openClass.title}
          </h2>
          <div className="text-right">
            <span className="text-lg font-black text-indigo-600">
              ${openClass.basePrice}
            </span>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">/Session</p>
          </div>
        </div>

        {/* TAGS */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {openClass.subjects?.slice(0, 2).map((sub, i) => (
            <span
              key={i}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-500 border border-indigo-100"
            >
              {sub}
            </span>
          ))}
        </div>

        {/* METADATA */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-slate-500">
            <User size={14} className="text-slate-400" />
            <span className="text-xs font-medium truncate">{openClass.tutorName}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin size={14} />
            <span className="text-xs truncate">{openClass.location}</span>
          </div>
        </div>

        {/* PROGRESS & ACTION */}
        <div className="mt-auto pt-4 border-t border-slate-50">
          <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-2">
            <span className="text-slate-500">Class Capacity</span>
            <span className={cn(isFull ? "text-rose-500" : "text-indigo-600")}>
              {openClass.currentStudents}/{openClass.maxStudents}
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
            <div
              className={cn(
                "h-full transition-all duration-1000 ease-out rounded-full",
                isFull ? "bg-slate-400" : "bg-indigo-500"
              )}
              style={{ width: `${enrollmentPercentage}%` }}
            />
          </div>

          <Button
            onClick={handleViewDetails}
            className="w-full h-10 text-xs font-bold rounded-xl bg-slate-900 hover:bg-indigo-600 text-white shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Eye size={14} />
            View Class Details
          </Button>
        </div>
      </div>
    </article>
  );
};

export const ClassCard = memo(ClassCardComponent);