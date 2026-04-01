import { TutorListingCard } from './listTutor/TutorListingCard';
import { tutors } from '../data/mockData';

export default function TutorExplorer() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col gap-10 py-12">
      
      {/* HEADER SECTION */}
      <header className="px-8 space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">FIND YOUR TUTOR</h1>
        <p className="text-slate-500 font-medium">Scroll down to explore categories, scroll left for more.</p>
      </header>

      {/* HORIZONTAL ROW 1: FEATURED */}
      <section className="space-y-4">
        <div className="px-8 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">🔥 Featured Tutors</h2>
          <button className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
        </div>
        
        {/* THE HORIZONTAL SCROLL BOX */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-8 pb-4">
          {tutors.map((tutor) => (
            <TutorListingCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      </section>

      {/* HORIZONTAL ROW 2: SCIENCE */}
      <section className="space-y-4">
        <div className="px-8">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">🧬 Science & Math</h2>
        </div>
        
        <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-8 pb-4">
          {tutors.slice().reverse().map((tutor) => (
            <TutorListingCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      </section>

      {/* HORIZONTAL ROW 3: LANGUAGES */}
      <section className="space-y-4">
        <div className="px-8">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">🌎 Languages</h2>
        </div>
        
        <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-8 pb-4">
          {tutors.map((tutor) => (
            <TutorListingCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      </section>

    </div>
  );
}