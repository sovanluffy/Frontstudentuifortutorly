import { Star, MapPin, Users, ChevronRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function TutorListingCard({ tutor }: { tutor: any }) {
  const navigate = useNavigate();

  return (
    <div className="w-full group">
      <div className="bg-white rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border border-slate-100">
        
        {/* LEFT: IMAGE SECTION */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
            <img
              src={tutor.profilePicture}
              alt={tutor.fullname}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {/* Status Indicator */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-white px-2.5 py-0.5 rounded-full shadow-sm border border-slate-100 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight whitespace-nowrap">
              {tutor.totalOpenClasses || 0} Slots
            </span>
          </div>
        </div>

        {/* RIGHT: CONTENT SECTION */}
        <div className="flex-1 flex flex-col w-full">
          {/* Name & Rating Row */}
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-black text-[#0F294D] tracking-tight">
                {tutor.fullname}
              </h3>
              <ShieldCheck size={16} className="text-blue-500" />
            </div>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md">
              <Star size={12} className="text-amber-500 fill-amber-500" />
              <span className="text-[12px] font-black text-amber-700">{tutor.rating || '5.0'}</span>
            </div>
          </div>

          {/* Bio */}
          <p className="text-slate-500 text-[13px] leading-snug line-clamp-2 mb-3 max-w-lg">
            {tutor.bio || "No biography provided."}
          </p>

          {/* BOTTOM BAR: Metadata & Actions */}
          <div className="mt-auto pt-3 border-t border-slate-50 flex flex-wrap items-center justify-between gap-3">
            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Users size={14} />
                <span className="text-[11px] font-bold">{tutor.studentsTaught}+</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin size={14} />
                <span className="text-[11px] font-bold">{tutor.location || "Remote"}</span>
              </div>
            </div>

            {/* CTA Button: Updated to View Profile */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/tutor/${tutor.tutorId}`)}
                className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-5 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all active:scale-95 flex items-center gap-1.5"
              >
                View Profile
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}