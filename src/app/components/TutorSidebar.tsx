"use client";

import React from "react";
import { Button } from "@/app/components/figma/ui/button";
import { MessageCircle, Phone } from "lucide-react";

interface TutorSidebarProps {
  studentsTaught?: number;
  education?: { degree: string }[];
  experience?: { role: string }[];
}

export function TutorSidebar({ studentsTaught, education, experience }: TutorSidebarProps) {
  return (
    <div className="w-full lg:w-[300px] space-y-4">
      <div className="bg-white p-5 rounded-xl border space-y-3">
        <Button className="w-full bg-blue-600">Send Inquiry</Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline"><MessageCircle size={14} /> Chat</Button>
          <Button variant="outline"><Phone size={14} /> Call</Button>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-4 rounded-xl space-y-1">
        <p className="text-xs">Impact</p>
        <p className="font-bold">{studentsTaught || 0}+ Students</p>
        {education?.[0] && <p className="text-xs">Highest Education: {education[0].degree}</p>}
        {experience?.[0] && <p className="text-xs">Recent Role: {experience[0].role}</p>}
      </div>
    </div>
  );
}