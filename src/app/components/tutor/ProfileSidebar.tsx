import React from "react";
import { CheckCircle2, Lock, Video as VideoIcon, Award } from "lucide-react";

interface ProfileSidebarProps {
  tutor: {
    public?: boolean;
    introVideoUrl?: string;
    certificateImages?: string[];
  };
}

export function ProfileSidebar({ tutor }: ProfileSidebarProps) {
  return (
    <aside className="space-y-10">
      {/* STATUS CARD */}
      <div 
        className={`p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden text-white transition-all duration-500 ${
          tutor?.public ? 'bg-indigo-600' : 'bg-slate-900'
        }`}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60">
              Portal Status
            </h3>
            {tutor?.public ? <CheckCircle2 size={28} /> : <Lock size={28} />}
          </div>
          <p className="text-4xl font-black mb-3 tracking-tighter">
            {tutor?.public ? "Global" : "Draft"}
          </p>
          <p className="text-sm font-medium opacity-80 leading-relaxed">
            {tutor?.public 
              ? "Your profile is indexed and visible to the global community." 
              : "Private draft. Only visible to you until published."}
          </p>
        </div>
        {/* Decorative blur circle */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-[80px]" />
      </div>

      {/* INTRO VIDEO CARD */}
      {tutor?.introVideoUrl && (
        <div className="bg-white p-6 rounded-[3.5rem] border border-slate-100 shadow-sm group">
          <div className="relative rounded-[2.5rem] overflow-hidden aspect-video bg-slate-100 ring-1 ring-slate-100 shadow-inner">
            <video 
              src={tutor.introVideoUrl} 
              className="w-full h-full object-cover" 
              controls 
            />
          </div>
          <div className="flex items-center justify-center gap-2 pt-6">
            <VideoIcon size={14} className="text-slate-300" />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
              Profile Presentation
            </p>
          </div>
        </div>
      )}

      {/* CERTIFICATES CARD */}
      {tutor?.certificateImages && tutor.certificateImages.length > 0 && (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <Award size={18} className="text-indigo-500" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Verified Credentials
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {tutor.certificateImages.map((img: string, i: number) => (
              <div key={i} className="group relative">
                <img 
                  src={img} 
                  className="w-full h-24 object-cover rounded-3xl border-4 border-slate-50 hover:border-indigo-100 transition-all duration-300 shadow-sm" 
                  alt={`Certificate ${i + 1}`} 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}