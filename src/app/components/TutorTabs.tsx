import React from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/app/components/figma/ui/tabs";
import { ClassCard } from "@/app/components/ClassCard";
import { 
  PlayCircle, 
  GraduationCap, 
  Briefcase, 
  FileText 
} from "lucide-react";
import { OpenClass } from "@/types/types";

interface TutorTabsProps {
  tutor: {
    bio?: string;
    introVideoUrl?: string;
    certificateImages?: string[];
    education?: { school: string; degree: string; year: string }[];
    experience?: { company: string; role: string; duration: string }[];
  };
  classes: OpenClass[];
  loading: boolean;
}

export function TutorTabs({ tutor, classes, loading }: TutorTabsProps) {
  return (
    <Tabs defaultValue="about" className="w-full">
      {/* --- TAB NAVIGATION --- */}
      <TabsList className="border-b h-12 gap-6 bg-transparent justify-start px-0">
        <TabsTrigger 
          value="about" 
          className="shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 bg-transparent px-2 font-bold text-slate-500 data-[state=active]:text-blue-600 transition-all"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger 
          value="classes" 
          className="shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 bg-transparent px-2 font-bold text-slate-500 data-[state=active]:text-blue-600 transition-all"
        >
          Classes ({classes?.length || 0})
        </TabsTrigger>
        <TabsTrigger 
          value="portfolio" 
          className="shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 bg-transparent px-2 font-bold text-slate-500 data-[state=active]:text-blue-600 transition-all"
        >
          Credentials
        </TabsTrigger>
      </TabsList>

      {/* --- OVERVIEW TAB --- */}
      <TabsContent value="about" className="py-6 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Bio Section */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText size={20} className="text-blue-500" /> About the Tutor
          </h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">
            {tutor.bio || "No biography provided yet."}
          </p>
        </section>

        {/* Professional Background Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Education Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap size={20} className="text-blue-500" /> Education
            </h3>
            <div className="space-y-4">
              {tutor.education?.map((edu, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-blue-100 py-1">
                  <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-blue-50 border-2 border-blue-500" />
                  <p className="text-sm font-bold text-slate-800">{edu.degree}</p>
                  <p className="text-xs text-slate-600">{edu.school}</p>
                  <p className="text-[10px] text-blue-500 font-bold mt-1 uppercase tracking-wider">{edu.year}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase size={20} className="text-blue-500" /> Experience
            </h3>
            <div className="space-y-4">
              {tutor.experience?.map((exp, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-slate-100 py-1">
                  <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-slate-50 border-2 border-slate-400" />
                  <p className="text-sm font-bold text-slate-800">{exp.role}</p>
                  <p className="text-xs text-slate-600">{exp.company}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{exp.duration}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Intro Video */}
        {tutor.introVideoUrl && (
          <section className="space-y-3 pt-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PlayCircle size={20} className="text-blue-500" /> Introduction Video
            </h3>
            <div className="aspect-video w-full max-w-2xl rounded-2xl overflow-hidden border bg-black shadow-lg">
              <video src={tutor.introVideoUrl} controls className="w-full h-full object-contain" />
            </div>
          </section>
        )}
      </TabsContent>

      {/* --- CLASSES TAB --- */}
      <TabsContent value="classes" className="py-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400">Loading classes...</div>
          ) : classes?.length > 0 ? (
            classes.map((cls) => (
              <ClassCard key={cls.classId} openClass={cls} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center border-2 border-dashed rounded-2xl">
              <p className="text-slate-400">No classes currently available.</p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* --- CREDENTIALS TAB --- */}
      <TabsContent value="portfolio" className="py-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tutor.certificateImages?.map((img, i) => (
            <div key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all">
              <img src={img} alt="Certificate" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
          {!tutor.certificateImages?.length && <p className="text-slate-400 col-span-full">No certificates uploaded.</p>}
        </div>
      </TabsContent>
    </Tabs>
  );
}