import { Tutor } from '../data/mockData';
import { Star, ShieldCheck, ArrowUpRight } from 'lucide-react';

export function TutorListingCard({ tutor }: { tutor: Tutor }) {
  return (
    <div className="snap-start flex-shrink-0 group relative w-[280px] bg-white rounded-[2.5rem] border border-slate-100 p-3 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2">
      
      {/* IMAGE AREA */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-100">
        <img
          src={tutor.profilePicture}
          alt={tutor.fullname}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* TOP BADGES */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
            <Star size={10} className="text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black text-slate-800">{tutor.rating}</span>
          </div>
          {tutor.verified && (
            <div className="bg-indigo-600 text-white p-1.5 rounded-full">
              <ShieldCheck size={12} strokeWidth={3} />
            </div>
          )}
        </div>

        {/* PRICE TAG */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-white text-xs font-bold">${tutor.startingPrice}</span>
            <span className="text-slate-400 text-[10px]">/hr</span>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="mt-4 px-2 pb-2">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight truncate uppercase">
          {tutor.fullname}
        </h3>
        
        {/* HORIZONTAL SUBJECTS WITHIN CARD */}
        <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
          {tutor.subjects.map((sub, i) => (
            <span key={i} className="whitespace-nowrap text-[9px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">
              {sub}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">View Profile</span>
          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}