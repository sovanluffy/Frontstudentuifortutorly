import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, User, Users } from "lucide-react";
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
    e.stopPropagation(); // Prevent triggering the card's onClick
    navigate(`/booking?classId=${openClass.classId}`);
  };

  // Helper for progress bar percentage
  const enrollmentPercentage = Math.min(
    (openClass.currentStudents / openClass.maxStudents) * 100,
    100
  );

  return (
    <div
      onClick={handleOpen}
      className="group w-[360px] bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 p-5 cursor-pointer flex flex-col gap-4"
    >
      {/* TOP SECTION: IMAGE & INFO */}
      <div className="flex gap-4">
        {/* IMAGE CONTAINER */}
        <div className="w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden relative flex-shrink-0 border border-gray-50">
          {openClass.classImage ? (
            <img
              src={openClass.classImage}
              alt={openClass.title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=No+Image";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-medium">
              No Image
            </div>
          )}

          {/* STATUS BADGE */}
          <div className={`absolute top-2 right-2 text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm ${
            openClass.status === "OPEN" ? "bg-[#00D64F]" : "bg-gray-400"
          }`}>
            {openClass.status}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h2 className="font-black text-lg text-[#1A1A1A] truncate leading-tight uppercase group-hover:text-blue-600 transition-colors">
            {openClass.title}
          </h2>
          <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed italic">
            {openClass.description}
          </p>

          {/* SUBJECT TAGS */}
          <div className="flex flex-wrap gap-1 mt-2">
            {openClass.subjects?.slice(0, 2).map((subject, i) => (
              <span
                key={i}
                className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-bold uppercase border border-indigo-100"
              >
                {subject}
              </span>
            ))}
          </div>

          {/* METADATA */}
          <div className="mt-auto pt-2 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <MapPin size={12} className="text-pink-500" />
              <span className="truncate">{openClass.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center">
                <User size={8} className="text-orange-600" />
              </div>
              <span className="truncate font-semibold text-gray-600">{openClass.tutorName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: PROGRESS & ACTIONS */}
      <div className="mt-auto space-y-4">
        {/* PROGRESS BAR */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Availability</span>
            <span className="text-[10px] text-gray-600 font-black">
              {openClass.currentStudents}/{openClass.maxStudents} <span className="text-gray-400 font-normal">Students</span>
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full transition-all duration-700 ease-out ${
                enrollmentPercentage > 80 ? "bg-orange-400" : "bg-blue-500"
              }`}
              style={{ width: `${enrollmentPercentage}%` }}
            />
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Starting at</span>
            <span className="text-2xl font-black text-blue-600 leading-none">
              ${openClass.basePrice.toFixed(2)}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              className="border-gray-200 text-gray-600 rounded-2xl px-4 h-10 text-xs font-bold hover:bg-gray-50 active:scale-95 transition-all"
            >
              Details
            </Button>
            <Button
              onClick={handleBooking}
              disabled={openClass.status !== "OPEN"}
              className="bg-[#2563EB] hover:bg-blue-700 text-white rounded-2xl px-6 h-10 text-xs font-black shadow-lg shadow-blue-100 active:scale-95 transition-all disabled:opacity-50 disabled:bg-gray-300"
            >
              {openClass.status === "OPEN" ? "BOOK NOW" : "FULL"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};