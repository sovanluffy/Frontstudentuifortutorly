"use client";

import React from "react";
import { GraduationCap, Briefcase, FileText } from "lucide-react";

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
    <div className="space-y-3">

      {/* BIO */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <FileText size={15} className="text-blue-600" />
          </div>
          <h2 className="text-[15px] font-semibold text-gray-900">Intro</h2>
        </div>
        <div className="px-4 py-4">
          {tutor?.bio ? (
            <p className="text-[14px] text-gray-600 leading-relaxed text-center">
              {tutor.bio}
            </p>
          ) : (
            <p className="text-[13px] text-gray-400 text-center italic py-1">
              No biography provided yet.
            </p>
          )}
        </div>
      </div>

      {/* EDUCATION */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <GraduationCap size={15} className="text-blue-600" />
          </div>
          <h2 className="text-[15px] font-semibold text-gray-900">Education</h2>
        </div>

        {tutor?.education && tutor.education.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {tutor.education.map((edu, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap size={17} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-gray-900 leading-snug">
                    {edu.degree}
                  </p>
                  <p className="text-[13px] text-blue-600 font-medium mt-0.5">
                    {edu.school}
                  </p>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    {edu.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-gray-400 italic text-center py-4 px-4">
            No education history added.
          </p>
        )}
      </div>

      {/* EXPERIENCE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <Briefcase size={15} className="text-gray-500" />
          </div>
          <h2 className="text-[15px] font-semibold text-gray-900">Work experience</h2>
        </div>

        {tutor?.experience && tutor.experience.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {tutor.experience.map((exp, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Briefcase size={17} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-gray-900 leading-snug">
                    {exp.role}
                  </p>
                  <p className="text-[13px] text-blue-600 font-medium mt-0.5">
                    {exp.company}
                  </p>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    {exp.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-gray-400 italic text-center py-4 px-4">
            No experience history added.
          </p>
        )}
      </div>

    </div>
  );
}