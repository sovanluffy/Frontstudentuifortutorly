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
    <div className="space-y-6">
      
      {/* BIO */}
      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-slate-500">
          <Quote size={16} />
          <p className="text-xs font-semibold uppercase tracking-wide">
            Profile
          </p>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">
          {tutor?.bio || "No biography provided yet."}
        </p>
      </section>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* EDUCATION */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={16} className="text-indigo-500" />
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Education
            </p>
          </div>

          {tutor?.education && tutor.education.length > 0 ? (
            <div className="space-y-4">
              {tutor.education.map((edu, i) => (
                <div key={i} className="flex gap-3">
                  
                  {/* timeline dot */}
                  <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0" />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {edu.degree}
                    </p>
                    <p className="text-xs text-slate-500">
                      {edu.school}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {edu.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm italic">
              No education history added.
            </p>
          )}
        </section>

        {/* EXPERIENCE */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={16} className="text-indigo-500" />
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Experience
            </p>
          </div>

          {tutor?.experience && tutor.experience.length > 0 ? (
            <div className="space-y-4">
              {tutor.experience.map((exp, i) => (
                <div key={i} className="flex gap-3">
                  
                  {/* timeline dot */}
                  <div className="mt-1 w-2 h-2 rounded-full bg-slate-400 shrink-0" />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {exp.role}
                    </p>
                    <p className="text-xs text-slate-500">
                      {exp.company}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {exp.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm italic">
              No experience history added.
            </p>
          )}
        </section>

      </div>
    </div>
  );
}