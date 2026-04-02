import { Star, Clock, MapPin, ShieldCheck, GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Updated Interface: tutorId is now a number to match your API response
interface Tutor {
  tutorId: number; 
  fullname: string;
  profilePicture: string;
  subjects: string[];
  bio: string;
  totalOpenClasses: number;
  rating: number;
  studentsTaught: number;
  location: string;
}

interface Props {
  tutor: Tutor;
}

export function TutorListingCard({ tutor }: Props) {
  const navigate = useNavigate();

  // Handle both absolute and relative image paths
  const profilePicUrl = tutor.profilePicture?.startsWith("http")
    ? tutor.profilePicture
    : `https://toturhub-dev.onrender.com${tutor.profilePicture}`;

  return (
    <div className="w-full group">
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
        
        {/* LEFT: IMAGE SECTION */}
        <div className="relative shrink-0">
          {/* Wrapping image in Link for better UX */}
          <Link to={`/tutor/${tutor.tutorId}`}>
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-50 shadow-md border border-slate-100">
              <img
                src={profilePicUrl}
                alt={tutor.fullname}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>
          <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white px-3 py-1 rounded-xl font-bold text-[10px] shadow-md border border-white/20">
            {tutor.totalOpenClasses} Class{tutor.totalOpenClasses !== 1 ? "es" : ""}
          </div>
        </div>

        {/* RIGHT: CONTENT SECTION */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Link to={`/tutor/${tutor.tutorId}`} className="hover:text-orange-500 transition-colors">
                    <h3 className="text-base font-bold text-[#1e2d5b] truncate">
                      {tutor.fullname}
                    </h3>
                  </Link>
                  {tutor.totalOpenClasses > 0 && (
                    <ShieldCheck size={14} className="text-blue-500 shrink-0" />
                  )}
                </div>
                
                {tutor.subjects?.length > 0 && (
                  <div className="flex items-center gap-1 mt-1 text-orange-600 font-semibold text-[9px] uppercase tracking-widest">
                    <GraduationCap size={11} />
                    <span className="truncate">{tutor.subjects.slice(0, 2).join(' • ')}</span>
                  </div>
                )}
                
                <p className="mt-2 text-[11px] leading-snug text-slate-500 line-clamp-3 italic">
                  "{tutor.bio}"
                </p>
              </div>
              
              <div className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100 shadow-sm shrink-0">
                <Star size={12} className="text-orange-500 fill-orange-500" />
                <span className="text-[10px] font-bold text-orange-700">{tutor.rating}</span>
              </div>
            </div>
          </div>

          {/* FOOTER: STATS & ACTIONS */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-blue-500" />
                <span className="text-[9px] font-semibold text-slate-400 uppercase">
                  {tutor.studentsTaught} Students
                </span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin size={12} className="text-blue-500" />
                <span className="text-[9px] font-semibold text-slate-400 truncate">
                  {tutor.location || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              {/* ✅ FIXED: Use Link for internal navigation to avoid refresh issues */}
              <Link
                to={`/tutor/${tutor.tutorId}`}
                className="text-[10px] font-bold text-[#1e2d5b] hover:text-orange-500 uppercase tracking-wide transition-colors"
              >
                Profile
              </Link>

              <button
                onClick={() => navigate(`/book/${tutor.tutorId}`)}
                className="bg-[#1e2d5b] hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wide transition-all active:scale-95 shadow-md"
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