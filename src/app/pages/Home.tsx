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
  Layers,
  MapPin,
  Mail,
  Phone,
  X,
  Rocket,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";

import { HeroSearchBanner } from "../components/search/HeroSearchBanner";
import { ClassListingCard } from "../components/listClass/ClassCard";

type LearningMode = "ONLINE" | "STUDENT_HOME" | "TUTOR_CLASS" | "OUTSIDE" | "ALL";

// Images for the Popup Slider
const INTRO_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    title: "Expert Tutors",
    titleKh: "គ្រូបង្រៀនជំនាញ"
  },
  {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    title: "Flexible Learning",
    titleKh: "ការសិក្សាដោយភាពបត់បែន"
  },
  {
    url: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80",
    title: "Quality Education",
    titleKh: "ការអប់រំមានគុណភាព"
  }
];

export default function Home() {
  // --- 1. CORE STATES ---
  const [publicClasses, setPublicClasses] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState<LearningMode>("ALL");
  
  // --- 2. POPUP & SLIDER STATES ---
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide Logic for Popup
  useEffect(() => {
    if (showWelcome) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % INTRO_SLIDES.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [showWelcome]);

  // Initial Data Fetch & First-Visit Check
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("tutorhub_v2_seen");
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => setShowWelcome(true), 1200);
      return () => clearTimeout(timer);
    }

    const fetchPublicClasses = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://toturhub-dev.onrender.com/api/v1/open-classes/public', {
          headers: { 'accept': '*/*' }
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setPublicClasses(data);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicClasses();
  }, []);

  // --- 3. HANDLERS ---
  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem("tutorhub_v2_seen", "true");
  };

  const handleSearchResults = (data: any[]) => {
    const onlyPublic = data.filter((c: any) => c.visibilityStatus === "PUBLIC");
    setSearchResults(onlyPublic);
    setActiveMode("ALL"); 
  };

  // --- 4. FILTERING LOGIC ---
  const displayClasses = useMemo(() => {
    const sourceData = searchResults !== null ? searchResults : publicClasses;
    return sourceData
      .filter((c: any) => c.visibilityStatus === "PUBLIC")
      .filter((c: any) => {
        if (activeMode === "ALL") return true;
        return (c.learningModes || []).includes(activeMode);
      })
      .sort((a: any, b: any) => b.classId - a.classId);
  }, [publicClasses, searchResults, activeMode]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* --- PREMIUM WELCOME POPUP --- */}
      <AnimatePresence>
        {showWelcome && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseWelcome}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20"
            >
              {/* Left Side: Auto-Slider */}
              <div className="relative w-full md:w-[40%] h-56 md:h-auto overflow-hidden bg-slate-950">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={INTRO_SLIDES[currentSlide].url} 
                      className="w-full h-full object-cover" 
                      alt="education" 
                    />
                  </motion.div>
                </AnimatePresence>
                
                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-slate-900 via-transparent text-white">
                  <motion.div
                    key={`txt-${currentSlide}`}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Featured</p>
                    <h3 className="text-xl font-bold">{INTRO_SLIDES[currentSlide].title}</h3>
                    <p className="text-white/60 text-xs font-khmer">{INTRO_SLIDES[currentSlide].titleKh}</p>
                  </motion.div>
                </div>
              </div>

              {/* Right Side: Content & Actions */}
              <div className="flex-1 p-8 md:p-12 flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
                    <Rocket size={24} className="animate-pulse" />
                  </div>
                  <button onClick={handleCloseWelcome} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                    <X size={20} />
                  </button>
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                    Start Learning <span className="text-blue-600">Today</span>
                  </h2>
                  <h2 className="text-xl font-bold text-slate-700 font-khmer">
                    ចាប់ផ្តើមការសិក្សារបស់អ្នកនៅថ្ងៃនេះ
                  </h2>
                </div>

                <div className="space-y-5 mb-10">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Verified Instructors</p>
                      <p className="text-xs text-slate-500 font-khmer">គ្រូបង្រៀនដែលមានបទពិសោធន៍ និងការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                      <Zap size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Fast Enrollment</p>
                      <p className="text-xs text-slate-500 font-khmer">ចុះឈ្មោះចូលរៀនបានរហ័ស និងងាយស្រួលបំផុត</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleCloseWelcome}
                  className="group w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-[1.5rem] flex items-center justify-center gap-4 shadow-xl shadow-blue-100 transition-all duration-300"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-black uppercase tracking-wider">Explore Marketplace</span>
                    <span className="text-[10px] font-medium font-khmer opacity-80">ចូលទៅកាន់កន្លែងស្វែងរកថ្នាក់រៀន</span>
                  </div>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- HERO SEARCH SECTION --- */}
      <HeroSearchBanner onResultsFound={handleSearchResults} />

      {/* --- STICKY FILTER BAR --- */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-blue-600" size={20} />
                <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">Public Classes</h2>
              </div>
              <div className="hidden md:block h-5 w-[1px] bg-slate-200" />
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                {displayClasses.length} Results Found
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-tighter whitespace-nowrap">
                <Layers size={14} /> Filter:
              </div>
              <div className="flex gap-2">
                {(["ALL", "ONLINE", "STUDENT_HOME", "TUTOR_CLASS", "OUTSIDE"] as LearningMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode)}
                    className={`whitespace-nowrap text-[10px] font-black px-6 py-3 rounded-xl border transition-all duration-300 ${
                      activeMode === mode
                        ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-900 hover:text-slate-900"
                    }`}
                  >
                    {mode.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CLASS LISTINGS --- */}
      <main className="max-w-[1400px] mx-auto px-6 pt-12 flex-grow mb-32 w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-[2.5rem] p-5 h-80 animate-pulse">
                <div className="w-full h-44 bg-slate-100 rounded-3xl mb-5" />
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-3" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : displayClasses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {displayClasses.map((c: any) => (
                <motion.div
                  key={c.classId}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ClassListingCard classItem={c} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="bg-white shadow-sm border border-slate-100 p-16 rounded-[4rem]">
              <Inbox className="text-slate-200 mx-auto mb-6" size={80} />
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Matches Found</h3>
              <p className="text-slate-500 mt-3 text-sm max-w-xs font-medium">Try different learning modes or search terms.</p>
            </div>
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0F172A] text-slate-400 pt-24 pb-12 border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 space-y-6">
              <div className="flex items-center gap-2 text-white">
                <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg">
                  <GraduationCap size={28} />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase">TutorHub</span>
              </div>
              <p className="text-sm font-medium text-slate-500">Connecting students with verified expert educators across Cambodia.</p>
              <div className="flex gap-5">
                <Facebook size={20} className="hover:text-white cursor-pointer transition-all" />
                <Instagram size={20} className="hover:text-white cursor-pointer transition-all" />
                <Twitter size={20} className="hover:text-white cursor-pointer transition-all" />
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-white text-[11px] font-black uppercase tracking-[0.25em] mb-8">Navigation</h4>
              <ul className="text-xs space-y-4 font-bold">
                <li className="hover:text-blue-500 cursor-pointer">Find Classes</li>
                <li className="hover:text-blue-500 cursor-pointer">Tutor Signup</li>
                <li className="hover:text-blue-500 cursor-pointer">Pricing</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-[11px] font-black uppercase tracking-[0.25em] mb-8">Get in Touch</h4>
              <ul className="text-xs space-y-5 font-bold">
                <li className="flex items-center gap-3 text-slate-300"><MapPin size={16} className="text-blue-600" /> Phnom Penh, KH</li>
                <li className="flex items-center gap-3 text-slate-300"><Mail size={16} className="text-blue-600" /> hello@tutorhub.com</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-[11px] font-black uppercase tracking-[0.25em] mb-8">Platform Status</h4>
              <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  Systems Online
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            <p>© 2026 TutorHub Platform • Secure Public Marketplace</p>
            <div className="flex gap-8">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}