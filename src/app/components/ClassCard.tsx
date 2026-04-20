import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, User, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";

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
export const ClassCard = ({ openClass }: ClassCardProps) => {
  const navigate = useNavigate();

  // Navigation Handlers
  const handleOpen = () => navigate(`/classes/${openClass.classId}`);
  
  const handleBooking = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop parent onClick
    navigate(`/booking?classId=${openClass.classId}`);
  };

  const enrollmentPercentage = Math.min(
    (openClass.currentStudents / openClass.maxStudents) * 100,
    100
  );

  return (
    <div
      onClick={handleOpen}
      className="group w-full max-w-[480px] bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 p-3 cursor-pointer flex flex-col gap-3"
    >
      {/* TOP SECTION: IMAGE & PRIMARY INFO */}
      <div className="flex gap-4">
        {/* THUMBNAIL */}
        <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden relative flex-shrink-0 border border-slate-100">
          <img
            src={openClass.classImage || "https://via.placeholder.com/150"}
            alt={openClass.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[8px] font-black text-white uppercase tracking-tighter ${
            openClass.status === "OPEN" ? "bg-emerald-500" : "bg-slate-400"
          }`}>
            {openClass.status}
          </div>
        </div>

        {/* HEADER CONTENT */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex justify-between items-start">
            <h2 className="font-bold text-sm text-slate-900 truncate uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
              {openClass.title}
            </h2>
            <div className="text-sm font-black text-indigo-600 flex flex-col items-end leading-none">
              <span>${openClass.basePrice}</span>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">USD</span>
            </div>
          </div>

          {/* INSTRUCTOR & LOCATION */}
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1 min-w-0">
              <div className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center">
                <User size={10} className="text-indigo-600" />
              </div>
              <span className="text-[10px] font-bold text-slate-600 truncate">{openClass.tutorName}</span>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <MapPin size={10} className="text-slate-400" />
              <span className="text-[10px] text-slate-500 truncate">{openClass.location}</span>
            </div>
          </div>

          {/* TAGS */}
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
            {openClass.subjects?.slice(0, 2).map((subject, i) => (
              <span
                key={i}
                className="text-[8px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded font-black uppercase border border-slate-100"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: PROGRESS & ACTIONS */}
      <div className="flex items-center gap-4 pt-2 border-t border-slate-50">
        {/* COMPACT PROGRESS */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Enrollment</span>
            <span className="text-[9px] font-bold text-slate-700">
              {openClass.currentStudents}/{openClass.maxStudents}
            </span>
          </div>
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out ${
                enrollmentPercentage > 85 ? "bg-amber-400" : "bg-indigo-500"
              }`}
              style={{ width: `${enrollmentPercentage}%` }}
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            className="h-8 w-8 p-0 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <Info size={16} />
          </Button>
          <Button
            onClick={handleBooking}
            disabled={openClass.status !== "OPEN"}
            className="h-8 px-4 text-[10px] font-black uppercase rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-30 disabled:bg-slate-200 transition-all active:scale-95"
          >
            {openClass.status === "OPEN" ? "Book Now" : "Full"}
          </Button>
        </div>
      </div>
    </div>
  );
};