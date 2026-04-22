import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";

// Hooks & Components
import { useOpenClasses } from "@/hooks/useOpenClasses";
import { HeroSearchBanner } from "../components/search/HeroSearchBanner";
import { ClassListingCard } from "../components/listClass/ClassCard";

const CATEGORIES = [
  "All Subjects",
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "IT & Software",
];

export function Home() {
  const { classes, loading } = useOpenClasses();
  const [activeFilters, setActiveFilters] = useState({ search: "", subject: "All Subjects" });

  const displayClasses = useMemo(() => {
    return (classes || [])
      .slice()
      .sort((a, b) => b.classId - a.classId)
      .filter((c) => {
        const matchSearch = (c.title || "").toLowerCase().includes(activeFilters.search.toLowerCase());
        const matchSubject = activeFilters.subject === "All Subjects" || 
          (c.subjects || []).some((s: string) => s.toLowerCase().includes(activeFilters.subject.toLowerCase()));
        return matchSearch && matchSubject;
      });
  }, [classes, activeFilters]);

  return (
    <div className="min-h-screen bg-white pb-24">
      <HeroSearchBanner onFiltersChange={setActiveFilters} />

      {/* Sticky Navigation with very thin border */}
      <div className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-20 hidden md:block">
        <div className="max-w-[1400px] mx-auto px-6 flex gap-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilters((prev) => ({ ...prev, subject: cat }))}
              className={`py-4 text-[13px] font-bold transition-all relative tracking-tight ${
                activeFilters.subject === cat ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {cat}
              {activeFilters.subject === cat && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-900" />
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 pt-16">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-blue-600" size={18} />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Top Selection of Classes</h2>
          </div>
          <p className="text-slate-500 font-medium text-sm">Showing {displayClasses.length} premium learning opportunities.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="aspect-video bg-slate-50 rounded-xl border border-slate-100" />
                <div className="h-4 bg-slate-50 rounded w-3/4" />
                <div className="h-4 bg-slate-50 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          /* Increased gap-y-16 for "Clean Space" look */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
            <AnimatePresence mode="popLayout">
              {displayClasses.map((c) => (
                <motion.div key={c.classId} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ClassListingCard classItem={c} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}