import { useLoaderData, useNavigate } from "react-router-dom";
import { 
  Star, Users, MessageCircle, Phone, MapPin, ShieldCheck,
  GraduationCap, Briefcase, Layers, ChevronRight, PlayCircle,
  Award, CheckCircle2, Clock, Globe, Zap
} from "lucide-react";
import { Badge } from "@/app/components/figma/ui/badge";
import { Button } from "@/app/components/figma/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/figma/ui/tabs";
import { ClassCard } from "../components/ClassCard";

interface Tutor {
  tutorId: number;
  fullname: string;
  profilePicture: string;
  coverImage?: string;
  introVideoUrl?: string;
  certificateImages?: string[];
  subjects?: string[];
  bio: string;
  rating: number;
  studentsTaught: number;
  location?: string;
  education?: { school: string; degree: string; year: string }[];
  experience?: { company: string; role: string; duration: string }[];
  activeClasses?: any[];
  public?: boolean;
}

export default function TutorDetailPage() {
  const tutor = useLoaderData() as Tutor;
  const navigate = useNavigate();

  const profilePicUrl = tutor.profilePicture || "/fallback-avatar.png";
  const coverPicUrl = tutor.coverImage || "https://images.unsplash.com/photo-1513258496099-48168024adb0?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="min-h-screen pb-20 bg-[#F8FAFC]">
      {/* 1. PREMIUM COVER SECTION */}
      <div className="relative h-[250px] md:h-[320px] w-full">
        <img src={coverPicUrl} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-black/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative -mt-20 md:-mt-28 flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Profile & Info */}
          <div className="flex-1 space-y-8">
            
            {/* Header: Identity (No Price Here) */}
            <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] overflow-hidden border-[6px] border-white shadow-xl bg-white">
                  <img src={profilePicUrl} className="w-full h-full object-cover" alt={tutor.fullname} />
                </div>
                {tutor.public && (
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full" />
                )}
              </div>

              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
                    {tutor.fullname}
                  </h1>
                  <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-slate-900">{tutor.rating || "5.0"}</span>
                    <span className="text-slate-400 font-medium">({tutor.studentsTaught} Students)</span>
                  </div>
                  <div className="h-1 w-1 rounded-full bg-slate-300" />
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{tutor.location || "Remote / Phnom Penh"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-slate-200 rounded-none h-12 p-0 gap-8">
                <TabsTrigger value="about" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent px-0 text-sm font-bold shadow-none">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="classes" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent px-0 text-sm font-bold shadow-none">
                  Available Classes ({tutor.activeClasses?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent px-0 text-sm font-bold shadow-none">
                  Credentials
                </TabsTrigger>
              </TabsList>

              <div className="py-8">
                <TabsContent value="about" className="space-y-10 mt-0">
                  <section>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4">
                      <Layers className="w-5 h-5 text-blue-500" /> Professional Biography
                    </h3>
                    <p className="text-slate-600 text-base leading-relaxed max-w-3xl">
                      {tutor.bio}
                    </p>
                  </section>

                  {tutor.introVideoUrl && (
                    <section>
                       <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4">
                        <PlayCircle className="w-5 h-5 text-red-500" /> Introduction Video
                      </h3>
                      <div className="relative aspect-video rounded-[32px] overflow-hidden bg-slate-900 border-8 border-white shadow-2xl">
                        <video src={tutor.introVideoUrl} controls className="w-full h-full object-contain" />
                      </div>
                    </section>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                      <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" /> Education
                      </h4>
                      <div className="space-y-4">
                        {tutor.education?.map((edu, i) => (
                          <div key={i} className="border-l-2 border-blue-100 pl-4">
                            <p className="font-bold text-slate-900">{edu.degree}</p>
                            <p className="text-xs text-slate-500 font-medium">{edu.school} • {edu.year}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                      <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Experience
                      </h4>
                      <div className="space-y-4">
                        {tutor.experience?.map((exp, i) => (
                          <div key={i} className="border-l-2 border-emerald-100 pl-4">
                            <p className="font-bold text-slate-900">{exp.role}</p>
                            <p className="text-xs text-slate-500 font-medium">{exp.company} • {exp.duration}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* CLASSES CONTENT: Includes Price and Open Class Button */}
                <TabsContent value="classes" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tutor.activeClasses?.map((item: any) => (
                      <div key={item.id} className="group relative bg-white rounded-[32px] p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        
                        {/* Custom Price Tag Overlay */}
                        <div className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur px-3 py-1.5 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-1.5">
                           <Zap size={14} className="text-amber-500 fill-amber-500" />
                           <span className="text-sm font-black text-slate-900">${item.price || '0'}</span>
                        </div>

                        <ClassCard openClass={item} />
                        
                        <div className="px-3 pb-3 pt-2 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px]">
                              <Users size={14} /> {item.maxStudents || 0} Slots
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px]">
                              <Clock size={14} /> {item.duration || '1h'}
                            </div>
                          </div>
                          <Button 
                            onClick={() => navigate(`/classes/${item.id}`)}
                            size="sm" 
                            className="rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-black px-6 transition-colors"
                          >
                            Open Class
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="portfolio" className="mt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tutor.certificateImages?.map((img, i) => (
                      <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden border-4 border-white shadow-md hover:scale-105 transition-transform cursor-pointer">
                        <img src={img} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* RIGHT COLUMN: Sticky Booking Widget (No Price) */}
          <div className="w-full lg:w-[380px]">
            <div className="sticky top-10 space-y-4">
              <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Personal Coaching</h3>
                  <p className="text-slate-400 text-sm font-medium mt-1">Direct 1-on-1 mentorship tailored to your learning goals.</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-bold text-slate-700">Free 15-min Trial Session</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-bold text-slate-700">Global Learning Support</span>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base shadow-xl shadow-blue-100">
                    Send Inquiry
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-12 rounded-xl border-slate-200 font-bold text-slate-600">
                      <MessageCircle className="w-4 h-4 mr-2 text-blue-500" /> Chat
                    </Button>
                    <Button variant="outline" className="h-12 rounded-xl border-slate-200 font-bold text-slate-600">
                      <Phone className="w-4 h-4 mr-2 text-emerald-500" /> Call
                    </Button>
                  </div>
                </div>
              </div>

              {/* Minimal Stats Card */}
              <div className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden">
                 <div className="relative z-10">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Success Stories</p>
                    <p className="text-2xl font-black">{tutor.studentsTaught}+ Global Students</p>
                 </div>
                 <Users className="absolute -right-2 -bottom-2 w-20 h-20 text-white/5" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}