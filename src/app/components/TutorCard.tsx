import * as React from "react";
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  ArrowUpRight, 
  Users, 
  Clock 
} from "lucide-react";
import { useNavigate } from "react-router";
import { Tutor } from "../data/mockData";
import { cn } from "@/lib/utils";

interface TutorCardProps {
  tutor: Tutor;
}

export function TutorCard({ tutor }: TutorCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/tutor/${tutor.tutorId}`)}
      className="group cursor-pointer flex flex-col"
    >
      {/* MAIN CONTAINER: Matching HeroSliderSmall's 420px-440px height */}
      <div className="relative h-[440px] bg-white rounded-[2.5rem] p-3 border border-slate-100 hover:border-indigo-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out flex flex-col">
        
        {/* VISUAL HEADER: The Image Container */}
        <div className="relative h-48 w-full overflow-hidden rounded-[2rem] bg-slate-100">
          <img
            src={tutor.profilePicture}
            alt={tutor.fullname}
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            loading="lazy"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
          
          {/* TOP RIGHT ICON: Verified Badge */}
          {tutor.verified && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-sm">
              <ShieldCheck size={18} className="text-blue-600" />
            </div>
          )}

          {/* BOTTOM LEFT: Rating Float */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-[11px] font-black text-white">{tutor.rating}</span>
          </div>
        </div>

        {/* BODY CONTENT: Padding and typography matching the slider */}
        <div className="flex-1 px-4 pt-6 pb-2">
          {/* Subject Tag with decorative line */}
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-4 bg-indigo-600/40" />
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
              {tutor.subjects[0]} {tutor.subjects[1] && `& ${tutor.subjects[1]}`}
            </span>
          </div>
          
          {/* Name & Experience Subtitle */}
          <h3 className="text-xl font-bold text-slate-900 mb-0.5 tracking-tight group-hover:text-indigo-600 transition-colors">
            {tutor.fullname}
          </h3>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-tight mb-3">
            {tutor.experience} Years Experience
          </p>

          {/* Bio text with line-clamping */}
          <p className="text-[13.5px] text-slate-500 leading-relaxed line-clamp-3">
            {tutor.bio || "Dedicated tutor focused on personalized student growth and academic excellence."}
          </p>

          {/* Metadata: Location and Student Count */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                {tutor.location.split(',')[0]}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={12} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                {tutor.studentsTaught} Students
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER ACTION BAR: Interactive button area */}
        <div className="px-2 pb-2">
          <div className="w-full flex items-center justify-between py-3 px-5 rounded-2xl bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold uppercase tracking-wide">
                Book for ${tutor.startingPrice || 0}
              </span>
              <span className="text-[10px] opacity-70">/hr</span>
            </div>
            <ArrowUpRight 
              size={14} 
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}