import { Tutor } from '../data/mockData';
import { Star, ShieldCheck, ChevronRight } from 'lucide-react';

interface TutorListingCardProps {
  tutor: Tutor;
}

export function TutorListingCard({ tutor }: TutorListingCardProps) {
  return (
    <div className="group cursor-pointer flex flex-col w-[260px] flex-shrink-0">

      {/* IMAGE */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[2.5rem] bg-slate-200 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/30">
        <img
          src={tutor.profilePicture}
          alt={tutor.fullname}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* BADGES */}
        <div className="absolute top-5 left-5 flex gap-2">
          {tutor.verified && (
            <div className="bg-blue-500 text-white p-2 rounded-2xl shadow-lg border border-white/20">
              <ShieldCheck size={14} strokeWidth={3} />
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-2xl border border-white/20">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-[11px] font-black text-white">
              {tutor.rating}
            </span>
          </div>
        </div>

        {/* PRICE */}
        <div className="absolute bottom-5 right-5">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-2xl border border-white">
            <span className="text-xs font-black text-slate-900">
              ${tutor.startingPrice}
            </span>
            <span className="text-[9px] font-bold text-slate-500 uppercase ml-1">
              /hr
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-6 space-y-3 px-2">
        <h3 className="text-xl font-black text-slate-900 uppercase italic group-hover:text-blue-600">
          {tutor.fullname}
        </h3>

        {/* SUBJECT SCROLL */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {tutor.subjects.map((subject, i) => (
            <span
              key={i}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-wider"
            >
              {subject}
            </span>
          ))}
        </div>

        <button className="flex items-center gap-2 text-blue-600 font-black text-[11px] uppercase tracking-[0.2em]">
          View Profile <ChevronRight size={14} strokeWidth={4} />
        </button>
      </div>

    </div>
  );
}