import { Star, MapPin, Users, Clock, CalendarDays, CheckCircle2, ArrowRight, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OpenClass } from "@/hooks/useOpenClasses";

/* --- Helper: Dynamic Subject Colors --- */
const getSubjectStyles = (subject: string) => {
  const s = subject.toLowerCase();
  if (s.includes("math") || s.includes("science")) return "bg-blue-50 text-blue-600 ring-blue-100";
  if (s.includes("art") || s.includes("design")) return "bg-rose-50 text-rose-600 ring-rose-100";
  if (s.includes("language") || s.includes("english")) return "bg-emerald-50 text-emerald-600 ring-emerald-100";
  return "bg-slate-50 text-slate-600 ring-slate-100";
};

const formatTime = (timeStr?: string) => {
  if (!timeStr) return "TBD";
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${minutes} ${ampm}`;
};

export function ClassListingCard({ classItem }: { classItem: OpenClass }) {
  const navigate = useNavigate();
  const schedule = classItem.schedules?.[0];
  const tutor = classItem.tutor;
  const rating = tutor?.rating > 0 ? tutor.rating : 5.0;

  return (
    <div 
      onClick={() => navigate(`/class/${classItem.classId}`)}
      className="group bg-white flex flex-col h-full cursor-pointer transition-all duration-300 rounded-[2rem] border border-slate-100 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 overflow-hidden"
    >
      {/* 1. VISUAL TOP SECTION */}
      <div className="relative p-2.5">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-slate-100">
          <img
            src={classItem.classImage || `https://ui-avatars.com/api/?name=${classItem.title}&background=f1f5f9&color=64748b&size=512`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt={classItem.title}
          />
          
          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[80%]">
            {classItem.new && (
              <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-tighter">
                New
              </span>
            )}
            {/* Render first two subjects as badges */}
            {classItem.subjects?.slice(0, 2).map((sub, idx) => (
              <span key={idx} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ring-1 uppercase tracking-tight shadow-sm backdrop-blur-md ${getSubjectStyles(sub)}`}>
                {sub}
              </span>
            ))}
          </div>

          <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl font-bold text-sm">
            ${classItem.basePrice}
          </div>
        </div>
      </div>

      {/* 2. INFORMATION BODY */}
      <div className="px-6 pb-6 pt-2 flex flex-col flex-grow">
        
        {/* Tutor Mini-Profile */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img 
                src={tutor?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                className="w-6 h-6 rounded-full object-cover ring-2 ring-white shadow-sm" 
                alt={tutor?.name}
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
            </div>
            <span className="text-xs font-semibold text-slate-600 truncate max-w-[120px]">
              {tutor?.name}
            </span>
          </div>
          
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold text-amber-700">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Title & Subject Description */}
        <h3 className="text-[1.1rem] font-extrabold text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
          {classItem.title}
        </h3>
        
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-5 opacity-80">
          {classItem.description}
        </p>

        {/* 3. LOGISTICS FOOTER */}
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between text-slate-500 bg-slate-50/50 p-3 rounded-2xl border border-slate-50">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-blue-500" />
              <span className="text-[11px] font-bold uppercase">{schedule?.day || "TBD"}</span>
            </div>
            <div className="h-3 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-blue-500" />
              <span className="text-[11px] font-bold uppercase">{formatTime(schedule?.startTime)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin size={13} />
              <span className="text-[11px] font-medium truncate max-w-[100px]">
                {classItem.location}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                <Users size={12} />
                <span className="text-[10px] font-bold">
                  {classItem.currentStudents}/{classItem.maxStudents}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}