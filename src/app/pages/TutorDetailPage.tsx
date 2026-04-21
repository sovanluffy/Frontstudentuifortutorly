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
import { ClassCard } from "@/app/components/ClassCard";
import { cn } from "@/lib/utils";
import { useClasses } from "@/hooks/useClasses";

export default function TutorDetailPage() {
  const tutor = useLoaderData() as any;
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = React.useState(0);

  // 🔥 API HOOK
  const { classes, loading } = useClasses(tutor.tutorId);

  const profilePicUrl = tutor.profilePicture || "/fallback-avatar.png";

  const slides = [
    tutor.coverImage || "https://images.unsplash.com/photo-1513258496099-48168024adb0?q=80&w=2070",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644"
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen pb-12 bg-[#F8FAFC]">

      {/* COVER */}
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

          {/* LEFT */}
          <div className="flex-1 space-y-6">

            {/* HEADER */}
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
                  <h1 className="text-2xl font-black text-slate-900">{tutor.fullname}</h1>
                  <Badge className="bg-blue-50 text-blue-600 text-[10px] h-5 px-2">
                    <ShieldCheck size={10} className="mr-1" /> Verified
                  </Badge>
                </div>

                <div className="flex items-center gap-3 text-[12px] font-bold text-slate-500">
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" /> {tutor.rating || "5.0"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {tutor.location || "Remote"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={14} /> {tutor.studentsTaught} Students
                  </span>
                </div>
              </div>
            </div>

            {/* TABS */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="border-b h-9 gap-6">
                <TabsTrigger value="about">Overview</TabsTrigger>
                <TabsTrigger value="classes">
                  Classes ({classes.length})
                </TabsTrigger>
                <TabsTrigger value="portfolio">Credentials</TabsTrigger>
              </TabsList>

              {/* ABOUT */}
              <TabsContent value="about" className="space-y-6">
                <p className="text-slate-600">{tutor.bio}</p>
              </TabsContent>

              {/* 🔥 CLASSES */}
              <TabsContent value="classes" className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {loading ? (
                  <p className="text-sm text-slate-400">Loading classes...</p>
                ) : classes.length > 0 ? (
                  classes.map((item: any) => (
                    <div key={item.classId} className="bg-white rounded-xl p-2 border shadow-sm">

                      <div className="relative">
                        <div className="absolute top-2 left-2 bg-white px-2 py-1 text-xs font-bold rounded">
                          ${item.basePrice}
                        </div>

                        <ClassCard openClass={item} />
                      </div>

                      <div className="p-2 flex justify-between text-xs">
                        <span>
                          {item.currentStudents}/{item.maxStudents}
                        </span>

                        <Button
                          size="sm"
                          onClick={() => navigate(`/classes/${item.classId}`)}
                        >
                          Open
                        </Button>
                      </div>

                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No classes found</p>
                )}

              </TabsContent>

              {/* PORTFOLIO */}
              <TabsContent value="portfolio">
                <p className="text-slate-400">No credentials</p>
              </TabsContent>
            </Tabs>

          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-[300px]">
            <div className="bg-white p-5 rounded-xl border space-y-3">
              <Button className="w-full bg-blue-600">Send Inquiry</Button>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline">
                  <MessageCircle size={14} /> Chat
                </Button>
                <Button variant="outline">
                  <Phone size={14} /> Call
                </Button>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-4 mt-4 rounded-xl">
              <p className="text-xs">Impact</p>
              <p className="font-bold">{tutor.studentsTaught}+ Students</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}