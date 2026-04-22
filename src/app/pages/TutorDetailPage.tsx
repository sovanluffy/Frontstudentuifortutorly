import * as React from "react";
import { useLoaderData } from "react-router-dom";
import {
  Star,
  Users,
  MapPin,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  PlayCircle,
  ExternalLink,
  Award,
  BookOpen,
  Loader2, // Added for the loading spinner
} from "lucide-react";

import { ClassCard } from "@/app/components/ClassCard";
import { useClasses } from "@/hooks/useClasses";

export default function TutorDetailPage() {
  const tutor = useLoaderData() as any;
  const { classes, loading: classesLoading } = useClasses(tutor?.tutorId);

  // FULL PAGE LOADING STATE
  if (!tutor) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">
          Loading tutor profile, please wait...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-slate-200/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 py-10 relative">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
            <div className="relative">
              <img
                src={tutor?.profilePicture}
                alt={tutor?.fullname}
                className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl shadow-indigo-100"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white w-8 h-8 rounded-full shadow-sm" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {tutor?.fullname}
                </h1>
                <div className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck size={14} />
                  Verified
                </div>
              </div>

              <p className="text-slate-600 mt-3 max-w-2xl leading-relaxed font-medium">
                {tutor?.bio}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-50 p-2 rounded-lg text-amber-500"><Star size={18} className="fill-current" /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Rating</p>
                    <p className="font-bold text-slate-900">{tutor?.rating ?? "5.0"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
                  <div className="bg-indigo-50 p-2 rounded-lg text-indigo-500"><Users size={18} /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Students</p>
                    <p className="font-bold text-slate-900">{tutor?.studentsTaught || 0}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
                  <div className="bg-slate-50 p-2 rounded-lg text-slate-500"><MapPin size={18} /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Location</p>
                    <p className="font-bold text-slate-900">{tutor?.location || "Remote"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* MAIN COLUMN */}
        <div className="lg:col-span-8 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Available Classes
                <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {classes?.length || 0}
                </span>
              </h2>
            </div>

            {classesLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 text-sm">
                    Loading classes...
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {classes?.map((c: any) => (
                  <div key={c.classId} className="transition-transform duration-300 hover:-translate-y-1">
                    <ClassCard openClass={c} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* SIDEBAR COLUMN */}
        <div className="lg:col-span-4 bg-slate-50/80 rounded-3xl p-4 lg:p-6 border border-slate-200/60 shadow-inner h-fit">
          <div className="space-y-6">
            
            {/* ABOUT CARD */}
            <section className="bg-white border-l-4 border-l-indigo-500 border border-slate-200 shadow-sm rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                  <BookOpen size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">About Tutor</h2>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                {tutor?.bio}
              </p>
            </section>

            {/* EXPERIENCE */}
            <section className="bg-white border-l-4 border-l-blue-500 border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><Briefcase size={18} /></div>
                <h2 className="text-lg font-bold text-slate-900">Experience</h2>
              </div>
              <div className="space-y-6">
                {tutor?.experience?.map((e: any, i: number) => (
                  <div key={i} className="group flex gap-4 relative">
                    {i !== tutor.experience.length - 1 && (
                      <div className="absolute left-4 top-8 w-0.5 h-full bg-slate-100" />
                    )}
                    <div className="z-10 bg-white border-2 border-blue-400 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-blue-500">{i + 1}</span>
                    </div>
                    <div className="pb-4">
                      <p className="font-bold text-slate-900 text-sm">{e.role}</p>
                      <p className="text-blue-500 text-xs font-medium">{e.company}</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold tracking-wider">{e.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* EDUCATION */}
            <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -bottom-4 -right-4 opacity-10 rotate-12"><GraduationCap size={100} /></div>
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10 text-indigo-100">
                <GraduationCap size={18} className="text-indigo-400" /> Education
              </h2>
              <div className="grid gap-3 relative z-10">
                {tutor?.education?.map((e: any, i: number) => (
                  <div key={i} className="bg-white/10 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <p className="font-bold text-indigo-300 text-sm">{e.school}</p>
                    <p className="text-slate-300 text-xs">{e.degree}</p>
                    <span className="text-[9px] font-bold bg-indigo-500/30 text-indigo-200 px-2 py-1 rounded-md mt-2 inline-block uppercase tracking-widest">
                      {e.year}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* INTRO VIDEO */}
            <section className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Intro Video</p>
              <div className="group relative aspect-video bg-white rounded-xl flex items-center justify-center overflow-hidden cursor-pointer border border-indigo-200 shadow-sm hover:border-indigo-400 transition-all">
                {tutor?.introVideoUrl ? (
                  <>
                    <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-indigo-900/30 transition-all" />
                    <PlayCircle className="text-indigo-600 z-10 group-hover:scale-110 transition-transform drop-shadow-md" size={44} />
                  </>
                ) : (
                  <p className="text-sm text-indigo-300 font-medium italic">Video coming soon</p>
                )}
              </div>
            </section>

            {/* CERTIFICATES */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Certificates</p>
                <Award size={14} className="text-indigo-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {tutor?.certificateImages?.map((img: string, i: number) => (
                  <div key={i} className="group relative rounded-xl overflow-hidden aspect-square border border-slate-100 ring-1 ring-slate-100 ring-offset-2">
                    <img src={img} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-indigo-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ExternalLink className="text-white" size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}