import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSlider } from '../components/HeroSlider';
import { TutorListingCard } from '../components/TutorListingCard';
import { IntegratedSearchBar } from '../components/IntegratedSearchBar';
import { tutors } from '../data/mockData';
import { ArrowRight, Filter, LayoutGrid, Sparkles, Zap } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  // Optimized filtering with useMemo
  const displayTutors = useMemo(() => {
    const filtered = selectedSubject === "All Subjects"
      ? tutors
      : tutors.filter(t => t.subjects.includes(selectedSubject));
    return filtered.slice(0, 16);
  }, [selectedSubject]);

  return (
    <div className="min-h-screen bg-[#F1F5F9] selection:bg-indigo-100">
      
      {/* 1. HERO SECTION */}
      <section className="bg-white border-b border-slate-200/60">
        <HeroSlider />
      </section>

      {/* 2. MAIN LAYOUT */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          
          {/* LEFT COLUMN: FILTER PANEL */}
          <aside className="w-full lg:w-[340px] flex-shrink-0">
            <div className="lg:sticky lg:top-28 space-y-6">
              
              {/* Filter Header */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Filter size={18} />
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                    Fine-tune Search
                  </h2>
                </div>
                {selectedSubject !== "All Subjects" && (
                  <button 
                    onClick={() => setSelectedSubject("All Subjects")}
                    className="text-[10px] font-bold uppercase tracking-tighter text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
              
              {/* Search Card */}
              <div className="bg-white/70 backdrop-blur-xl p-7 rounded-[2rem] border border-white shadow-xl shadow-slate-200/50">
                <IntegratedSearchBar
                  selectedSubject={selectedSubject}
                  onSubjectSelect={setSelectedSubject}
                />
              </div>

              {/* Recruitment Promo Card */}
              <div className="group relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 text-white transition-all hover:shadow-2xl hover:shadow-indigo-200/50">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Opportunities</span>
                  </div>
                  <h4 className="font-extrabold text-xl leading-tight group-hover:text-indigo-300 transition-colors">
                    Teach with <br />TutorHub.
                  </h4>
                  <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                    Access Cambodia's largest student network and set your own rates.
                  </p>
                  <button className="mt-6 w-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest bg-white text-slate-900 px-6 py-4 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all">
                    Apply Now <ArrowRight size={14} />
                  </button>
                </div>
                {/* Decorative Gradient */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl group-hover:bg-indigo-600/40 transition-all" />
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: CONTENT FEED */}
          <div className="flex-grow">
            
            {/* Dynamic Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-3">
                   <Sparkles size={16} className="text-indigo-500" />
                   <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Selected for you</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase italic leading-none">
                  {selectedSubject === "All Subjects" ? "Elite Recommendations" : `${selectedSubject} Masters`}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Availability</p>
                  <p className="text-slate-900 font-bold text-sm">{displayTutors.length} Active Profiles</p>
                </div>
                <button
                  onClick={() => navigate('/search')}
                  className="group flex items-center gap-3 bg-slate-900 text-white hover:bg-indigo-600 transition-all px-7 py-4 rounded-2xl shadow-lg shadow-slate-200 text-xs font-bold uppercase tracking-widest"
                >
                  View All Directory <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* CARD GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
              {displayTutors.map((tutor) => (
                <TutorListingCard key={tutor.tutorId} tutor={tutor} />
              ))}
            </div>

            {/* IMPROVED EMPTY STATE */}
            {displayTutors.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm text-center px-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                   <LayoutGrid size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No tutors found for "{selectedSubject}"</h3>
                <p className="text-slate-500 max-w-xs mb-8">Try adjusting your filters or search for a broader subject area.</p>
                <button 
                  onClick={() => setSelectedSubject("All Subjects")}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-20 py-20 bg-slate-900 text-white">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-800 pb-12">
            <div>
              <h3 className="text-3xl font-black italic tracking-tighter">
                TutorHub<span className="text-indigo-500">.</span>
              </h3>
              <p className="text-slate-400 mt-2 text-sm font-medium">Redefining education excellence in Cambodia.</p>
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="pt-12 text-center">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.5em]">
              © 2026 TutorHub Cambodia • Elevating Potential
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}