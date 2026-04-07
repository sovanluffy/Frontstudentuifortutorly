import * as React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { 
  Star, Users, MessageCircle, Phone, MapPin, ShieldCheck,
  GraduationCap, Briefcase, Layers, PlayCircle,
  Clock, Globe, Zap, CheckCircle2, Award
} from "lucide-react";
import { Badge } from "@/app/components/figma/ui/badge";
import { Button } from "@/app/components/figma/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/figma/ui/tabs";
import { ClassCard } from "../components/ClassCard";
import { cn } from "@/lib/utils";

export default function TutorDetailPage() {
  const tutor = useLoaderData() as any;
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const profilePicUrl = tutor.profilePicture || "/fallback-avatar.png";
  
  // 1. Auto-sliding Background Data
  const slides = [
    tutor.coverImage || "https://images.unsplash.com/photo-1513258496099-48168024adb0?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1920"
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen pb-12 bg-[#F8FAFC]">
      {/* 2. COMPACT AUTO-SLIDE COVER (Height: 200px) */}
      <div className="relative h-[200px] w-full overflow-hidden bg-[#0F294D]">
        {slides.map((img, index) => (
          <img 
            key={index}
            src={img} 
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
              index === currentSlide ? "opacity-40" : "opacity-0"
            )} 
            alt="Cover" 
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="relative -mt-16 flex flex-col lg:flex-row gap-6">
          
          {/* LEFT COLUMN: Profile & Tabs */}
          <div className="flex-1 space-y-6">
            
            {/* Header: Identity (Small Scale) */}
            <div className="flex items-end gap-4">
              <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-white shadow-md bg-white">
                  <img src={profilePicUrl} className="w-full h-full object-cover" alt={tutor.fullname} />
                </div>
                {tutor.public && (
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="pb-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{tutor.fullname}</h1>
                  <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] h-5 px-2">
                    <ShieldCheck size={10} className="mr-1"/> Verified
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-[12px] font-bold text-slate-500">
                  <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400"/> {tutor.rating || "5.0"}</span>
                  <span className="flex items-center gap-1"><MapPin size={14}/> {tutor.location || "Remote"}</span>
                  <span className="flex items-center gap-1"><Users size={14}/> {tutor.studentsTaught} Students</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Slim height: 36px) */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="bg-transparent border-b border-slate-200 h-9 p-0 gap-6 rounded-none justify-start">
                <TabsTrigger value="about" className="rounded-none bg-transparent px-0 text-[13px] font-bold data-[state=active]:border-b-2 data-[state=active]:border-blue-600 shadow-none">Overview</TabsTrigger>
                <TabsTrigger value="classes" className="rounded-none bg-transparent px-0 text-[13px] font-bold data-[state=active]:border-b-2 data-[state=active]:border-blue-600 shadow-none">Classes ({tutor.activeClasses?.length || 0})</TabsTrigger>
                <TabsTrigger value="portfolio" className="rounded-none bg-transparent px-0 text-[13px] font-bold data-[state=active]:border-b-2 data-[state=active]:border-blue-600 shadow-none">Credentials</TabsTrigger>
              </TabsList>

              <div className="py-6">
                {/* OVERVIEW TAB CONTENT */}
                <TabsContent value="about" className="space-y-6 mt-0">
                  <section>
                    <h3 className="text-[14px] font-black text-slate-900 flex items-center gap-2 mb-2 uppercase tracking-wide">
                      <Layers size={16} className="text-blue-500" /> Bio
                    </h3>
                    <p className="text-slate-600 text-[13.5px] leading-relaxed max-w-2xl">{tutor.bio}</p>
                  </section>

                  {/* SMALL VIDEO SECTION */}
                  {tutor.introVideoUrl && (
                    <section className="max-w-xl">
                      <h3 className="text-[14px] font-black text-slate-900 flex items-center gap-2 mb-3 uppercase tracking-wide">
                        <PlayCircle size={16} className="text-red-500" /> Intro Video
                      </h3>
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border-4 border-white shadow-sm">
                        <video src={tutor.introVideoUrl} controls className="w-full h-full object-cover" />
                      </div>
                    </section>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 flex items-center gap-2"><GraduationCap size={14}/> Education</h4>
                      {tutor.education?.map((edu: any, i: number) => (
                        <div key={i} className="border-l-2 border-blue-50 pl-3 mb-2">
                          <p className="text-[13px] font-bold text-slate-800">{edu.degree}</p>
                          <p className="text-[11px] text-slate-500">{edu.school} • {edu.year}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 flex items-center gap-2"><Briefcase size={14}/> Experience</h4>
                      {tutor.experience?.map((exp: any, i: number) => (
                        <div key={i} className="border-l-2 border-emerald-50 pl-3 mb-2">
                          <p className="text-[13px] font-bold text-slate-800">{exp.role}</p>
                          <p className="text-[11px] text-slate-500">{exp.company} • {exp.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* CLASSES TAB CONTENT */}
                <TabsContent value="classes" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-0">
                  {tutor.activeClasses?.map((item: any) => (
                    <div key={item.id} className="bg-white rounded-xl p-2 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                      <div className="relative">
                        <div className="absolute top-2 left-2 z-10 bg-white/90 px-2 py-0.5 rounded-lg text-[12px] font-black border border-slate-100 flex items-center gap-1">
                          <Zap size={12} className="text-amber-500 fill-amber-500" /> ${item.price}
                        </div>
                        <ClassCard openClass={item} />
                      </div>
                      <div className="p-2 flex items-center justify-between">
                        <div className="flex gap-3 text-[10px] text-slate-400 font-bold uppercase">
                          <span className="flex items-center gap-1"><Users size={12}/> {item.maxStudents}</span>
                          <span className="flex items-center gap-1"><Clock size={12}/> {item.duration}</span>
                        </div>
                        <Button onClick={() => navigate(`/classes/${item.id}`)} size="sm" className="h-7 rounded-lg bg-slate-900 text-[11px] font-black hover:bg-blue-600">Open</Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* CREDENTIALS TAB CONTENT (Fixed Aspect Ratios) */}
                <TabsContent value="portfolio" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {tutor.certificateImages?.map((img: string, i: number) => (
                      <div key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-white shadow-sm bg-slate-100">
                        <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="cert" />
                      </div>
                    ))}
                    {(!tutor.certificateImages || tutor.certificateImages.length === 0) && (
                      <div className="col-span-full py-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
                        <Award className="mx-auto text-slate-300 mb-1" size={24} />
                        <p className="text-slate-400 text-[10px] font-bold uppercase">No Credentials Listed</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* RIGHT COLUMN: Sticky Sidebar (Fixed Width: 300px) */}
          <div className="w-full lg:w-[300px] shrink-0">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm">
                <h3 className="text-md font-black text-slate-900 mb-1">1-on-1 Coaching</h3>
                <p className="text-slate-400 text-[11px] mb-4">Direct personal mentorship sessions.</p>
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-[11px] font-bold text-slate-700">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Free 15-min Trial
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl text-[11px] font-bold text-slate-700">
                    <Globe size={14} className="text-blue-500" /> Global Support
                  </div>
                </div>
                <div className="grid gap-2">
                  <Button className="w-full h-10 rounded-lg bg-blue-600 font-bold text-[13px] shadow-sm">Send Inquiry</Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-9 rounded-lg text-[11px] font-bold">
                      <MessageCircle size={14} className="mr-1 text-blue-500"/> Chat
                    </Button>
                    <Button variant="outline" className="h-9 rounded-lg text-[11px] font-bold">
                      <Phone size={14} className="mr-1 text-emerald-500"/> Call
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Stats Card */}
              <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden">
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Impact</p>
                <p className="text-md font-black">{tutor.studentsTaught}+ Active Students</p>
                <Users className="absolute -right-2 -bottom-2 w-12 h-12 text-white/5" />
              </div>
            </div>
          </div>
//code new khmer
        </div>
      </div>
    </div>
  );
}