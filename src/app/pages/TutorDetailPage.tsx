import { useLoaderData, useNavigate } from "react-router-dom";
import { 
  Star, 
  Users, 
  MessageCircle, 
  Phone, 
  MapPin, 
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Layers,
  ChevronRight,
  PlayCircle,
  Award
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
  skills?: string[];
  pricePerHour?: number;
  activeClasses?: any[];
  public?: boolean;
}

export default function TutorDetailPage() {
  const tutor = useLoaderData() as Tutor;
  const navigate = useNavigate();

  const profilePicUrl = tutor.profilePicture || "/fallback-avatar.png";
  const coverPicUrl = tutor.coverImage || "https://images.unsplash.com/photo-1513258496099-48168024adb0?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="min-h-screen pb-10 bg-[#f8fafc]">
      {/* 1. Slim Cover */}
      <div className="relative h-40 md:h-48 w-full overflow-hidden">
        <img src={coverPicUrl} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container mx-auto px-4">
        {/* 2. Compact Header */}
        <div className="relative flex flex-col md:flex-row gap-4 items-start -mt-12 md:-mt-16 mb-6">
          <div className="relative shrink-0">
            <img 
              src={profilePicUrl} 
              alt={tutor.fullname} 
              className="w-28 h-28 md:w-36 md:h-36 rounded-xl object-cover border-4 border-white shadow-md bg-white" 
            />
            {tutor.public && (
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>

          <div className="flex-1 md:pt-16 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900 capitalize">{tutor.fullname}</h1>
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-1">
                    {tutor.rating > 0 ? (
                      <>
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-slate-900 font-bold">{tutor.rating}</span>
                        <span>({tutor.studentsTaught} students)</span>
                      </>
                    ) : (
                      <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 border-blue-100">New Tutor</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{tutor.location || "Phnom Penh, KH"}</span>
                  </div>
                </div>
              </div>

              {/* Price & Primary Action */}
              <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                <div className="px-3 border-r border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Rate</p>
                  <p className="text-lg font-black text-indigo-600 leading-none">${tutor.pricePerHour || 15}<span className="text-[10px] text-slate-400 font-normal">/hr</span></p>
                </div>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-8 px-4 text-xs font-bold">
                  Book Session
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Content Tabs */}
        <Tabs defaultValue="about" className="space-y-4">
          <TabsList className="bg-slate-200/50 p-0.5 rounded-md h-8 w-fit">
            <TabsTrigger value="about" className="text-[11px] px-4 h-7">About</TabsTrigger>
            <TabsTrigger value="classes" className="text-[11px] px-4 h-7">Classes ({tutor.activeClasses?.length || 0})</TabsTrigger>
            <TabsTrigger value="portfolio" className="text-[11px] px-4 h-7">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              {/* Bio Section */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                <h3 className="text-[11px] font-bold mb-2 uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Layers className="w-3 h-3" /> Professional Bio
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{tutor.bio}</p>
              </div>

              {/* Video Section (Added based on your JSON) */}
              {tutor.introVideoUrl && (
                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                  <h3 className="text-[11px] font-bold mb-3 uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <PlayCircle className="w-3.5 h-3.5 text-red-500" /> Introduction Video
                  </h3>
                  <div className="aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
                    <video 
                      src={tutor.introVideoUrl} 
                      controls 
                      className="w-full h-full object-contain"
                      poster={tutor.coverImage}
                    />
                  </div>
                </div>
              )}

              {/* Education & Experience Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                  <h3 className="text-[11px] font-bold mb-3 uppercase text-slate-400 flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" /> Education
                  </h3>
                  {tutor.education && tutor.education.length > 0 ? (
                    tutor.education.map((edu, i) => (
                      <div key={i} className="mb-2 last:mb-0 border-l-2 border-indigo-100 pl-3">
                        <p className="text-sm font-bold text-slate-800 leading-none">{edu.degree}</p>
                        <p className="text-[11px] text-slate-500 mt-1">{edu.school} • {edu.year}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No education details listed.</p>
                  )}
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                  <h3 className="text-[11px] font-bold mb-3 uppercase text-slate-400 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5" /> Experience
                  </h3>
                  {tutor.experience && tutor.experience.length > 0 ? (
                    tutor.experience.map((exp, i) => (
                      <div key={i} className="mb-2 last:mb-0 border-l-2 border-emerald-100 pl-3">
                        <p className="text-sm font-bold text-slate-800 leading-none">{exp.role}</p>
                        <p className="text-[11px] text-slate-500 mt-1">{exp.company} • {exp.duration}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No experience details listed.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Connect */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                <h3 className="text-[11px] font-bold mb-3 uppercase text-slate-400">Quick Connect</h3>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="w-full h-9 text-[11px] border-slate-200">
                    <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> Send Message
                  </Button>
                  <Button variant="outline" size="sm" className="w-full h-9 text-[11px] border-slate-200">
                    <Phone className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Book Free Trial
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="classes">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tutor.activeClasses && tutor.activeClasses.length > 0 ? (
                tutor.activeClasses.map((item: any) => (
                  <div key={item.id} className="relative group">
                    <ClassCard openClass={item} onBookClick={() => navigate(`/classes/${item.id}`)} />
                    <Button 
                      onClick={() => navigate(`/classes/${item.id}`)}
                      variant="secondary" 
                      className="absolute bottom-4 right-4 h-7 text-[10px] font-bold bg-white/90 backdrop-blur hover:bg-white shadow-sm border border-slate-200"
                    >
                      View Details <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white border border-dashed rounded-xl border-slate-200">
                   <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <Users className="w-5 h-5 text-slate-300" />
                   </div>
                   <p className="text-slate-400 text-sm font-medium">No active group classes currently listed.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">Verified Certificates</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {tutor.certificateImages && tutor.certificateImages.length > 0 ? (
                  tutor.certificateImages.map((img: string, i: number) => (
                    <div key={i} className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-50 transition-all hover:ring-2 hover:ring-indigo-500/50">
                      <img src={img} alt="Certificate" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors cursor-zoom-in" />
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center py-10 text-slate-400 text-sm italic">No certificates uploaded yet.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}