import React from "react";
import { GraduationCap, Briefcase, Quote } from "lucide-react";

interface ProfileDetailsProps {
  tutor: {
    bio?: string;
    education?: Array<{
      school: string;
      degree: string;
      year: string;
    }>;
    experience?: Array<{
      company: string;
      role: string;
      duration: string;
    }>;
  };
}

export function ProfileDetails({ tutor }: ProfileDetailsProps) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* BIO SECTION */}
      <section className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <Quote className="absolute -top-2 -left-2 text-slate-50 w-24 h-24 -z-0" />
        <div className="relative z-10">
          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-8">
            Professional Profile
          </h3>
          <p className="text-slate-700 leading-[2] text-xl font-medium italic opacity-90">
            "{tutor?.bio || "No biography provided yet."}"
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* EDUCATION SECTION */}
        <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3">
            <GraduationCap size={20} className="text-indigo-500" /> Education
          </h3>
          
          {tutor?.education && tutor.education.length > 0 ? (
            tutor.education.map((edu, i) => (
              <div key={i} className="border-l-4 border-indigo-50 pl-6 mb-10 last:mb-0 relative">
                <div className="absolute -left-[6px] top-0 w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <p className="font-black text-slate-900 text-lg leading-tight mb-1">
                  {edu.degree}
                </p>
                <p className="text-slate-500 text-sm font-medium">{edu.school}</p>
                <p className="text-[10px] font-black text-indigo-400 uppercase mt-2 tracking-widest">
                  {edu.year}
                </p>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-sm italic">No education history added.</p>
          )}
        </section>

        {/* EXPERIENCE SECTION */}
        <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3">
            <Briefcase size={20} className="text-indigo-500" /> Experience
          </h3>
          
          {tutor?.experience && tutor.experience.length > 0 ? (
            tutor.experience.map((exp, i) => (
              <div key={i} className="border-l-4 border-slate-50 pl-6 mb-10 last:mb-0">
                <p className="font-black text-slate-900 text-lg leading-tight mb-1">
                  {exp.role}
                </p>
                <p className="text-slate-500 text-sm font-medium">{exp.company}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">
                  {exp.duration}
                </p>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-sm italic">No experience history added.</p>
          )}
        </section>

      </div>
    </div>
  );
}