import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSlider } from '../components/HeroSlider';
import { TutorListingCard } from '../components/TutorListingCard';
import { IntegratedSearchBar } from '../components/IntegratedSearchBar';
import { tutors } from '../data/mockData';
import { ArrowRight } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  const displayTutors =
    selectedSubject === "All Subjects"
      ? tutors.slice(0, 12)
      : tutors.filter(t => t.subjects.includes(selectedSubject)).slice(0, 12);

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100">

      {/* HERO */}
      <section className="relative pt-4 bg-slate-50/30 ">
        <HeroSlider />
      </section>

      {/* MAIN */}
      <section className="py-12 px-6">
        <div className="grid grid-cols-10 gap-8 w-full">

          {/* FILTER — 30% */}
          <div className="col-span-3">
            <div className="sticky top-24">
              <IntegratedSearchBar
                selectedSubject={selectedSubject}
                onSubjectSelect={setSelectedSubject}
              />
            </div>
          </div>

          {/* CARDS — 70% */}
          <div className="col-span-7">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                  {selectedSubject === "All Subjects"
                    ? "Now Trending"
                    : `${selectedSubject} Experts`}
                </h3>
              </div>

              <button
                onClick={() => navigate('/search')}
                className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center gap-2"
              >
                See all <ArrowRight size={14} strokeWidth={3} />
              </button>
            </div>

            {/* CARD GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayTutors.map((tutor) => (
                <TutorListingCard key={tutor.tutorId} tutor={tutor} />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-slate-100 bg-slate-50/50">
        <div className="text-center">
          <h3 className="text-3xl font-black text-slate-900 uppercase italic">
            TutorHub.
          </h3>
          <p className="text-slate-300 text-[9px] font-bold uppercase tracking-[0.5em] mt-8">
            © 2026 TutorHub Cambodia • All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}