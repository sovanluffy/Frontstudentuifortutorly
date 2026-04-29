"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Facebook,
  Twitter,
  Instagram,
  GraduationCap,
  Inbox,
  MapPin,
  Mail,
  X,
  Rocket,
  ArrowRight,
  ShieldCheck,
  Zap,
  Monitor,
  Home as HomeIcon,
  Users,
  TreePine,
  ChevronRight,
  Star,
} from "lucide-react";

import { HeroSearchBanner } from "../components/search/HeroSearchBanner";
import { ClassListingCard } from "../components/listClass/ClassCard";

const API_BASE = import.meta.env.VITE_API_BASE || "https://toturhub-dev.onrender.com/api/v1";


type LearningMode = "ONLINE" | "STUDENT_HOME" | "TUTOR_CLASS" | "OUTSIDE" | "ALL";

const INTRO_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    title: "Expert Tutors",
    titleKh: "គ្រូបង្រៀនជំនាញ",
  },
  {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    title: "Flexible Learning",
    titleKh: "ការសិក្សាដោយភាពបត់បែន",
  },
  {
    url: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80",
    title: "Quality Education",
    titleKh: "ការអប់រំមានគុណភាព",
  },
];

const MODE_CONFIG: Record<LearningMode, { label: string; icon: React.ReactNode }> = {
  ALL:          { label: "All",          icon: <Sparkles size={12} />  },
  ONLINE:       { label: "Online",       icon: <Monitor size={12} />   },
  STUDENT_HOME: { label: "Home",         icon: <HomeIcon size={12} />  },
  TUTOR_CLASS:  { label: "Tutor Class",  icon: <Users size={12} />     },
  OUTSIDE:      { label: "Outside",      icon: <TreePine size={12} />  },
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
    <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-200" />
    <div className="p-4 space-y-2.5">
      <div className="h-3 bg-slate-100 rounded-full w-1/3" />
      <div className="h-4 bg-slate-100 rounded-full w-4/5" />
      <div className="h-3 bg-slate-100 rounded-full w-1/2" />
      <div className="flex gap-2 pt-1">
        <div className="h-5 bg-slate-100 rounded-full w-14" />
        <div className="h-5 bg-slate-100 rounded-full w-18" />
      </div>
    </div>
  </div>
);

export default function Home() {
  const [publicClasses, setPublicClasses] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState<LearningMode>("ALL");
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  /* Slideshow */
  useEffect(() => {
    if (!showWelcome) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % INTRO_SLIDES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [showWelcome]);

  /* Init */
  useEffect(() => {
    const seen = localStorage.getItem("tutorhub_v2_seen");
    if (!seen) {
      const t = setTimeout(() => setShowWelcome(true), 1200);
      return () => clearTimeout(t);
    }

    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/open-classes/public`, {
          headers: { accept: "*/*" },
        });
        if (!res.ok) throw new Error("Failed");
        setPublicClasses(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem("tutorhub_v2_seen", "true");
  };

  const handleSearchResults = (data: any[]) => {
    setSearchResults(data.filter((c: any) => c.visibilityStatus === "PUBLIC"));
    setActiveMode("ALL");
  };

  const displayClasses = useMemo(() => {
    const src = searchResults !== null ? searchResults : publicClasses;
    return src
      .filter((c: any) => c.visibilityStatus === "PUBLIC")
      .filter((c: any) => activeMode === "ALL" || (c.learningModes || []).includes(activeMode))
      .sort((a: any, b: any) => b.classId - a.classId);
  }, [publicClasses, searchResults, activeMode]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col" style={{ fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif" }}>

      {/* ── Welcome Modal ── */}
      <AnimatePresence>
        {showWelcome && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleCloseWelcome}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl shadow-slate-900/20 overflow-hidden flex flex-col md:flex-row"
            >
              {/* Image slider */}
              <div className="relative w-full md:w-5/12 h-48 md:h-auto shrink-0 bg-slate-900 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={INTRO_SLIDES[currentSlide].url}
                    alt=""
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 0.65, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-950 to-transparent">
                  <motion.div key={`lbl-${currentSlide}`} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">TutorHub</p>
                    <p className="text-white font-bold text-sm">{INTRO_SLIDES[currentSlide].title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{INTRO_SLIDES[currentSlide].titleKh}</p>
                  </motion.div>
                </div>
                <div className="absolute top-4 left-4 flex gap-1.5">
                  {INTRO_SLIDES.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? "w-5 bg-white" : "w-1.5 bg-white/30"}`} />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-7 flex flex-col">
                <button
                  onClick={handleCloseWelcome}
                  className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                >
                  <X size={14} />
                </button>

                <div className="mb-5">
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold mb-3">
                    <Rocket size={11} /> Welcome to TutorHub
                  </div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight tracking-tight">
                    Start Learning<br /><span className="text-blue-600">Today.</span>
                  </h2>
                  <p className="text-slate-400 text-xs mt-1.5 font-medium">ចាប់ផ្តើមការសិក្សារបស់អ្នកនៅថ្ងៃនេះ</p>
                </div>

                <div className="space-y-3.5 mb-7 flex-1">
                  {[
                    { icon: <ShieldCheck size={15} />, color: "emerald", title: "Verified Instructors", sub: "គ្រូបង្រៀនដែលមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ" },
                    { icon: <Zap size={15} />, color: "amber", title: "Fast Enrollment", sub: "ចុះឈ្មោះចូលរៀនបានរហ័ស និងងាយស្រួល" },
                    { icon: <Star size={15} />, color: "blue", title: "Top-Rated Classes", sub: "ថ្នាក់រៀនដែលទទួលបានការវាយតម្លៃខ្ពស់" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-${item.color}-50 text-${item.color}-600`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{item.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleCloseWelcome}
                  className="w-full bg-slate-900 hover:bg-blue-600 text-white py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] group"
                >
                  Explore Classes
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Hero (compact) ── */}
      <HeroSearchBanner onResultsFound={handleSearchResults} />

      {/* ── Filter bar — sticky on desktop only ── */}
      <div className="md:sticky md:top-0 md:z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/70 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 md:h-14 gap-3">

            {/* Count */}
            <div className="flex items-center gap-2 shrink-0">
              <h2 className="text-sm font-black text-slate-900 tracking-tight hidden sm:block">Classes</h2>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                {displayClasses.length}
              </span>
            </div>

            {/* Mode filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 flex-1 justify-end">
              {(Object.keys(MODE_CONFIG) as LearningMode[]).map((mode) => {
                const cfg = MODE_CONFIG[mode];
                const isActive = activeMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode)}
                    className={`flex items-center gap-1.5 whitespace-nowrap text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all duration-200 shrink-0 ${
                      isActive
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {cfg.icon}
                    <span>{cfg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Class Grid ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : displayClasses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {displayClasses.map((c: any, i: number) => (
                <motion.div
                  key={c.classId}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.22, delay: Math.min(i * 0.04, 0.28) }}
                >
                  <ClassListingCard classItem={c} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
              <Inbox size={28} className="text-slate-300" />
            </div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">No classes found</h3>
            <p className="text-slate-400 text-sm mt-1.5 max-w-xs">Try a different filter or search term.</p>
            <button
              onClick={() => setActiveMode("ALL")}
              className="mt-5 flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:underline"
            >
              View all classes <ChevronRight size={14} />
            </button>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 text-slate-500 pt-14 pb-8 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <GraduationCap size={18} className="text-white" />
                </div>
                <span className="text-white text-base font-black tracking-tight">TutorHub</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Connecting students with verified expert educators across Cambodia.
              </p>
              <div className="flex gap-3 pt-1">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition-all">
                    <Icon size={13} />
                  </button>
                ))}
              </div>
            </div>

            {/* Navigate */}
            <div>
              <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">Navigate</h4>
              <ul className="space-y-2.5 text-xs font-medium">
                {["Find Classes", "Become a Tutor", "Pricing", "About Us"].map((item) => (
                  <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">Contact</h4>
              <ul className="space-y-3 text-xs font-medium">
                <li className="flex items-center gap-2 text-slate-400">
                  <MapPin size={12} className="text-blue-500 shrink-0" /> Phnom Penh, Cambodia
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Mail size={12} className="text-blue-500 shrink-0" /> hello@tutorhub.com
                </li>
              </ul>
            </div>

            {/* Status */}
            <div>
              <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">Status</h4>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  All Systems Online
                </div>
                <p className="text-[11px] text-slate-500">99.9% uptime this month</p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-7 border-t border-slate-800/70 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] font-medium text-slate-600">
            <p>© 2026 TutorHub · All rights reserved</p>
            <div className="flex gap-5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}