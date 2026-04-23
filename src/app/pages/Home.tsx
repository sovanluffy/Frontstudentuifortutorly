import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

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

  const [activeFilters, setActiveFilters] = useState({
    search: "",
    subject: "All Subjects",
  });

  const displayClasses = useMemo(() => {
    return (classes || [])
      .slice()
      .sort((a, b) => b.classId - a.classId)
      .filter((c) => {
        const matchSearch = (c.title || "")
          .toLowerCase()
          .includes(activeFilters.search.toLowerCase());

        const matchSubject =
          activeFilters.subject === "All Subjects" ||
          (c.subjects || []).some((s: string) =>
            s.toLowerCase().includes(activeFilters.subject.toLowerCase())
          );

        return matchSearch && matchSubject;
      });
  }, [classes, activeFilters]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HERO */}
      <HeroSearchBanner onFiltersChange={setActiveFilters} />

      {/* ================= FILTER SECTION ================= */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 py-3">

          {/* TITLE MOVED HERE */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="text-blue-600" size={16} />
              <h2 className="text-base font-black text-slate-900">
                Find classes here
              </h2>
            </div>

            <p className="text-xs text-slate-500 mt-0.5">
              {displayClasses.length} learning opportunities available
            </p>
          </div>

          {/* CATEGORY LIST */}
          <div className="flex gap-6 overflow-x-auto no-scrollbar pt-1">
            {CATEGORIES.map((cat) => {
              const active = activeFilters.subject === cat;

              return (
                <button
                  key={cat}
                  onClick={() =>
                    setActiveFilters((prev) => ({ ...prev, subject: cat }))
                  }
                  className={`
                    whitespace-nowrap text-sm font-semibold transition-all
                    px-3 py-1 rounded-md border
                    ${
                      active
                        ? "text-slate-900 bg-white border-slate-300 shadow-sm"
                        : "text-slate-500 border-transparent hover:text-slate-900 hover:border-slate-200"
                    }
                  `}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-[1400px] mx-auto px-6 pt-6">

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white border border-slate-100 rounded-2xl p-4 space-y-4"
              >
                <div className="aspect-video bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {displayClasses.map((c) => (
                <motion.div
                  key={c.classId}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
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