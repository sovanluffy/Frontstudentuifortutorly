import { useState, useMemo } from "react";
import { HeroSlider } from "../components/HeroSlider";
import { TutorListingCard } from "../components/listTutor/TutorListingCard";
import { IntegratedSearchBar } from "../components/IntegratedSearchBar"; 
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useTutors } from "@/hooks/useTutors";

export function Home() {
  const { tutors, loading, error } = useTutors();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    search: "",
    location: "",
    maxPrice: 200,
    subject: "All Subjects",
    schedule: "Any"
  });

  // --- FILTER LOGIC ---
  const displayTutors = useMemo(() => {
    return (tutors || []).filter(t => {
      const tutorSubjects = t?.subjects || [];
      const matchesSubject = activeFilters.subject === "All Subjects" || tutorSubjects.includes(activeFilters.subject);
      const tutorName = t?.fullname || "";
      const matchesSearch = tutorName.toLowerCase().includes(activeFilters.search.toLowerCase()) || 
                           tutorSubjects.some(s => s?.toLowerCase().includes(activeFilters.search.toLowerCase()));
      const matchesLocation = !activeFilters.location || t?.location?.toLowerCase().includes(activeFilters.location.toLowerCase());

      return matchesSubject && matchesSearch && matchesLocation;
    });
  }, [tutors, activeFilters]);

  // --- PAGINATION ---
  const tutorsPerPage = 8;
  const totalPages = Math.ceil(displayTutors.length / tutorsPerPage);
  const currentTutors = displayTutors.slice((currentPage - 1) * tutorsPerPage, currentPage * tutorsPerPage);

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-sans text-[#0f172a]">
      <HeroSlider />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div className="shrink-0">
            <h2 className="text-4xl font-black tracking-tighter leading-none">
              Find Your <br />
              <span className="text-orange-500">Perfect Tutor</span>
            </h2>
            <div className="flex items-center gap-2 mt-3">
              <span className="w-8 h-1 bg-orange-500 rounded-full"></span>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                {displayTutors.length} Experts Available
              </p>
            </div>
          </div>

          <div className="w-full lg:max-w-4xl">
            <IntegratedSearchBar 
              onFiltersChange={(newFilters) => {
                setActiveFilters(newFilters);
                setCurrentPage(1); 
              }} 
            />
          </div>
        </div>

        {/* Tutors Grid */}
        {loading ? (
          <p className="text-center py-20">Loading tutors...</p>
        ) : error ? (
          <p className="text-center py-20 text-red-500">Error: {error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {currentTutors.length > 0 ? (
              currentTutors.map((tutor) => (
                <TutorListingCard key={tutor.tutorId} tutor={tutor} />
              ))
            ) : (
              <div className="col-span-full bg-white border border-slate-100 rounded-[2.5rem] py-32 text-center shadow-sm">
                <Users size={40} className="mx-auto text-slate-200 mb-4" />
                <h3 className="text-xl font-black">No tutors found</h3>
                <p className="text-slate-400 text-sm mt-2">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center">
            <nav className="flex items-center gap-2 p-1.5 bg-white border border-slate-100 rounded-full shadow-lg shadow-slate-200/40">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 disabled:opacity-20 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-full text-[10px] font-black transition-all ${
                      currentPage === i + 1 
                        ? "bg-[#0f172a] text-white shadow-md shadow-blue-900/20" 
                        : "text-[#0f172a] hover:bg-slate-50"
                    }`}
                  >
                    {(i + 1).toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 disabled:opacity-20 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </nav>
          </div>
        )}
      </main>
    </div>
  );
}