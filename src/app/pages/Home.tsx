import { useState, useMemo, useEffect, useRef } from "react";
import { HeroSearchBanner } from "../components/search/HeroSearchBanner"; 
import { TutorListingCard } from "../components/listTutor/TutorListingCard";
import { CategoryCard } from "../components/shared/CategoryCard";
import { ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles, Flame } from "lucide-react";
import { useTutors } from "@/hooks/useTutors";
import { motion, AnimatePresence } from "framer-motion";

export function Home() {
  const { tutors, loading, error } = useTutors();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({ search: "", subject: "All Subjects" });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- AUTO-SCROLL LOGIC ---
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scroll("right");
        }
      }
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  // --- DATA PREP ---
  const categories = [
    { name: "Mathematics", type: "Popular", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600" },
    { name: "Khmer History", type: "Heritage", img: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600" },
    { name: "Quantum Physics", type: "Advanced", img: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=600" },
    { name: "English IELTS", type: "Language", img: "https://images.unsplash.com/photo-1543167664-40d6990297c1?q=80&w=600" },
    { name: "Digital Design", type: "Creative", img: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=600" },
  ];

  const displayTutors = useMemo(() => {
    return (tutors || []).filter(t => {
      const matchesSearch = (t?.fullname || "").toLowerCase().includes(activeFilters.search.toLowerCase());
      const matchesSub = activeFilters.subject === "All Subjects" || 
                         (t?.subjects || []).some(s => s.toLowerCase().includes(activeFilters.subject.toLowerCase()));
      return matchesSearch && matchesSub;
    });
  }, [tutors, activeFilters]);

  const currentTutors = displayTutors.slice((currentPage - 1) * 6, currentPage * 6);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white border-b border-slate-100">
        <HeroSearchBanner onFiltersChange={setActiveFilters} />
      </div>

      <main className="max-w-[1240px] mx-auto px-5 md:px-8 py-10">
        
        {/* --- CATEGORY CAROUSEL --- */}
        <section className="mb-14 relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Get inspired for your next lesson <Sparkles size={20} className="text-blue-500" />
              </h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Explore trending subjects from top experts</p>
            </div>
            
            <div className="flex gap-2">
              <button onClick={() => scroll("left")} className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 shadow-sm transition-all active:scale-90"><ChevronLeft size={22} /></button>
              <button onClick={() => scroll("right")} className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 shadow-sm transition-all active:scale-90"><ChevronRight size={22} /></button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
          >
            {categories.map((cat, i) => (
              <CategoryCard key={i} title={cat.name} subtitle={cat.type} image={cat.img} />
            ))}
          </div>
        </section>

        {/* --- TUTOR GRID SECTION --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <Flame size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0F294D]">Top-Rated Experts</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{displayTutors.length} tutors available now</p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-white hover:border-blue-500 transition-all shadow-sm">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex justify-center py-20 animate-pulse font-bold text-slate-300 uppercase tracking-widest">Finding the best matches...</div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentTutors.map((tutor) => (
                  <TutorListingCard key={tutor.tutorId} tutor={tutor} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}