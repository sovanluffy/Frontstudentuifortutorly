// import { useState } from 'react';
// import { tutors } from '../data/mockData';
// import { TutorListingCard } from '../components/listTutor/TutorListingCard';
// import { FilterSidebar } from '../components/FilterSidebar';
// import { Search, Sparkles, SlidersHorizontal, ArrowUpDown, LayoutGrid } from 'lucide-react';

// export function TutorListing() {
//   const [budget, setBudget] = useState([50]);

//   return (
//     <div className="min-h-screen bg-[#FDFDFD] selection:bg-indigo-100">
      
//       {/* --- PREMIUM HEADER SECTION --- */}
//       <div className="bg-white pt-24 pb-16">
//         <div className="container mx-auto px-6 max-w-7xl">
//           <div className="max-w-3xl">
//             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6 shadow-lg shadow-slate-200">
//               <Sparkles size={14} className="text-amber-400" />
//               <span>Elite Educators</span>
//             </div>
//             <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9]">
//               Elevate your <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Learning.</span>
//             </h1>
//             <p className="text-slate-500 font-medium text-lg mt-6 max-w-xl border-l-2 border-indigo-100 pl-6">
//               Discover {tutors.length} verified experts specializing in modern curriculums and personal growth.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* --- SEARCH & QUICK FILTER BAR --- */}
//       <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-y border-slate-100 py-4 mb-12">
//         <div className="container mx-auto px-6 max-w-7xl flex flex-wrap items-center justify-between gap-4">
//           <div className="relative flex-1 min-w-[300px]">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search by subject, name or skill..."
//               className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all"
//             />
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:border-indigo-500 transition-colors">
//               <ArrowUpDown size={14} />
//               Sort: Popular
//             </button>
//             <button className="lg:hidden flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold text-xs">
//               <SlidersHorizontal size={14} />
//               Filters
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-6 max-w-7xl pb-24">
//         <div className="flex flex-col lg:flex-row gap-12">
          
//           {/* --- MINIMAL SIDEBAR --- */}
//           <aside className="hidden lg:block w-72 flex-shrink-0">
//              <div className="sticky top-32">
//                <div className="flex items-center justify-between mb-6 px-2">
//                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
//                     <SlidersHorizontal size={16} /> 
//                     Refine Search
//                  </h3>
//                  <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter hover:underline">Reset</button>
//                </div>
               
//                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
//                  <FilterSidebar budget={budget} setBudget={setBudget} />
//                </div>

//                {/* Stats Card */}
//                <div className="mt-6 p-6 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] text-white shadow-xl shadow-indigo-200">
//                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
//                     <LayoutGrid size={20} />
//                   </div>
//                   <p className="text-xl font-bold leading-tight">Need a custom plan?</p>
//                   <p className="text-white/70 text-xs mt-2 font-medium">Talk to our advisors to find a perfect match.</p>
//                   <button className="mt-4 w-full py-3 bg-white text-indigo-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-indigo-50 transition-colors">
//                     Contact Us
//                   </button>
//                </div>
//              </div>
//           </aside>

//           {/* --- GRID CONTENT --- */}
//           <main className="flex-1">
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//               {tutors.map((tutor) => (
//                 <TutorListingCard key={tutor.tutorId} tutor={tutor} />
//               ))}
//             </div>

//             {/* Pagination / Load More */}
//             <div className="mt-20 flex flex-col items-center">
//               <div className="h-[1px] w-24 bg-slate-100 mb-8" />
//               <button className="group relative px-12 py-5 overflow-hidden rounded-full bg-slate-900 text-white transition-all hover:pr-16 active:scale-95">
//                 <span className="relative z-10 text-xs font-black uppercase tracking-[0.2em]">
//                   View More Educators
//                 </span>
//                 <ArrowUpDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" />
//               </button>
//               <p className="mt-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
//                 Showing 12 of {tutors.length}
//               </p>
//             </div>
//           </main>

//         </div>
//       </div>
//     </div>
//   );
// }