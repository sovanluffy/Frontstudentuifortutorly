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
    <aside className="space-y-6 w-full max-w-sm">
      
      {/* STATUS */}
      <div
        className={`p-5 rounded-2xl shadow-sm border text-white ${
          tutor?.public ? "bg-indigo-600 border-indigo-500" : "bg-slate-800 border-slate-700"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-wide opacity-70 font-medium">
            Status
          </p>
          {tutor?.public ? <CheckCircle2 size={20} /> : <Lock size={20} />}
        </div>

        <h2 className="text-xl font-semibold">
          {tutor?.public ? "Public" : "Draft"}
        </h2>

        <p className="text-xs mt-1 opacity-80 leading-relaxed">
          {tutor?.public
            ? "Visible to students"
            : "Only visible to you"}
        </p>
      </div>

      {/* VIDEO */}
      {tutor?.introVideoUrl && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="rounded-xl overflow-hidden aspect-video bg-slate-100">
            <video
              src={tutor.introVideoUrl}
              className="w-full h-full object-cover"
              controls
            />
          </div>

          <div className="flex items-center justify-center gap-2 mt-3 text-slate-500">
            <VideoIcon size={14} />
            <span className="text-xs font-medium">
              Intro Video
            </span>
          </div>
        </div>
      )}

      {/* CERTIFICATES */}
      {tutor?.certificateImages && tutor.certificateImages.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} className="text-indigo-500" />
            <p className="text-xs font-semibold text-slate-600">
              Certificates
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {tutor.certificateImages.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                className="w-full h-20 object-cover rounded-lg border hover:scale-105 transition"
                alt={`Certificate ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}