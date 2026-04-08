"use client";

import React from "react";
import { Badge } from "@/app/components/figma/ui/badge";
import { Star, Users, MapPin, ShieldCheck } from "lucide-react";

interface TutorHeaderProps {
  fullname: string;
  profilePicture?: string;
  rating?: number;
  location?: string;
  studentsTaught?: number;
  isPublic?: boolean;
}

export function TutorHeader({
  fullname,
  profilePicture,
  rating,
  location,
  studentsTaught,
  isPublic
}: TutorHeaderProps) {
  const profilePicUrl = profilePicture || "/fallback-avatar.png";

  return (
    <div className="flex items-end gap-4">
      <div className="relative shrink-0">
        <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-white shadow-md bg-white">
          <img src={profilePicUrl} className="w-full h-full object-cover" alt={fullname} />
        </div>
        {isPublic && (
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
        )}
      </div>

      <div className="pb-1">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-black text-slate-900">{fullname}</h1>
          <Badge className="bg-blue-50 text-blue-600 text-[10px] h-5 px-2">
            <ShieldCheck size={10} className="mr-1" /> Verified
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-[12px] font-bold text-slate-500">
          <span className="flex items-center gap-1">
            <Star size={14} className="text-amber-400 fill-amber-400" /> {rating || "5.0"}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {location || "Remote"}
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} /> {studentsTaught || 0} Students
          </span>
        </div>
      </div>
    </div>
  );
}