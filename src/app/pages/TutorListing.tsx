import { useState } from 'react';
import { tutors } from '../data/mockData';
import { TutorListingCard } from '../components/listTutor/TutorListingCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { Search, Sparkles, SlidersHorizontal } from 'lucide-react';

export function TutorListing() {
  const [budget, setBudget] = useState([50]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-indigo-100">
      
      {/* --- HERO / HEADER SECTION --- */}
      <div className="bg-white border-b border-slate-100 pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                <Sparkles size={14} />
                <span>Available Now</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                Find your <span className="text-indigo-600">Perfect</span> Tutor
              </h1>
              <p className="text-slate-500 font-medium text-lg mt-2">
                Showing {tutors.length} world-class educators ready to help you grow.
              </p>
            </div>
            
            {/* Mobile Filter Toggle (Visible only on small screens) */}
            <button className="lg:hidden flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold">
              <SlidersHorizontal size={20} />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* --- SIDEBAR --- */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
             <div className="sticky top-28 bg-white rounded-[2.5rem] border-2 border-slate-50 p-8 shadow-xl shadow-slate-200/50">
               <div className="flex items-center gap-3 mb-8">
                 <div className="p-2 bg-slate-900 rounded-lg text-white">
                    <SlidersHorizontal size={18} />
                 </div>
                 <h3 className="font-black uppercase tracking-tight text-slate-900">Filters</h3>
               </div>
               
               <FilterSidebar budget={budget} setBudget={setBudget} />
               
               <div className="mt-8 pt-8 border-t border-slate-50">
                 <div className="bg-indigo-50 rounded-2xl p-4">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Pro Tip</p>
                    <p className="text-xs text-indigo-900/70 font-bold leading-relaxed">
                      Verified tutors respond 50% faster to new student inquiries.
                    </p>
                 </div>
               </div>
             </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <main className="flex-1">
            {/* Results Top Bar */}
            <div className="flex items-center justify-between mb-8 px-2">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
                Sorted by <span className="text-slate-900">Top Rated</span>
              </p>
              <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-slate-400">Live Updates</span>
              </div>
            </div>

            {/* Grid with larger gap to match the Explorer style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {tutors.map((tutor) => (
                <div key={tutor.tutorId} className="transition-transform duration-300 hover:-translate-y-2">
                  <TutorListingCard tutor={tutor} />
                </div>
              ))}
            </div>

            {/* Pagination / Load More (Matching Subject Explorer Button Style) */}
            <div className="mt-16 flex justify-center">
              <button className="group flex items-center gap-3 bg-white border-2 border-slate-100 hover:border-indigo-600 px-12 py-5 rounded-3xl transition-all duration-300 shadow-lg hover:shadow-indigo-100">
                <span className="text-slate-900 font-black uppercase tracking-widest text-xs group-hover:text-indigo-600">
                  Load More Tutors
                </span>
                <Search size={18} className="text-slate-400 group-hover:text-indigo-600 group-hover:rotate-12 transition-all" />
              </button>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}