import { Star, MapPin, Users, ChevronRight, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function TutorListingCard({ tutor }: { tutor: any }) {
  const navigate = useNavigate();

  return (
    <div className="w-full group">
      {/* Container: No harsh borders, just a smooth shadow and rounded corners */}
      <div className="bg-white rounded-[32px] p-5 md:p-7 flex flex-col md:flex-row items-center gap-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] hover:-translate-y-1 border border-slate-50">
        
        {/* LEFT: IMAGE SECTION */}
        <div className="relative shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[28px] overflow-hidden bg-slate-100 ring-4 ring-slate-50">
            <img
              src={tutor.profilePicture}
              alt={tutor.fullname}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          {/* Minimal Status Indicator */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-md border border-slate-50 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest whitespace-nowrap">
              {tutor.totalOpenClasses || 0} Slots
            </span>
          </div>
        </div>

        {/* RIGHT: CONTENT SECTION */}
        <div className="flex-1 flex flex-col w-full">
          {/* Name & Rating Row */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-[#0F294D] tracking-tight">
                {tutor.fullname}
              </h3>
              <ShieldCheck size={20} className="text-blue-500 fill-blue-50" />
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-sm font-black text-amber-700">{tutor.rating || '0.0'}</span>
            </div>
          </div>

          {/* Bio: Clean Typography */}
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 max-w-lg">
            {tutor.bio || "No biography provided."}
          </p>

          {/* BOTTOM BAR: Metadata & Actions */}
          <div className="mt-auto pt-6 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-slate-500">
                <Users size={16} />
                <span className="text-xs font-bold">{tutor.studentsTaught}+ Students</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin size={16} />
                <span className="text-xs font-bold">{tutor.location || "Remote"}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 ml-auto sm:ml-0">
              <Link 
                to={`/tutor/${tutor.tutorId}`} 
                className="text-sm font-bold text-slate-400 hover:text-[#0F294D] transition-colors flex items-center gap-1 group/link"
              >
                Profile <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => navigate(`/book/${tutor.tutorId}`)}
                className="bg-[#0F294D] hover:bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-100 active:scale-95"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}