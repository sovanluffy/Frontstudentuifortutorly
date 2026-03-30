import { useNavigate } from 'react-router';
import { SearchBar } from '../components/SearchBar';
import { SubjectCard } from '../components/SubjectCard';
import { TutorCard } from '../components/TutorCard';
import { ClassCard } from '../components/ClassCard';
import { HeroSlider } from '../components/HeroSlider'; // Import the new slider
import { subjects, tutors, openClasses } from '../data/mockData';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/figma/ui/button';

export function Home() {
  const navigate = useNavigate();

  const featuredTutors = tutors.slice(0, 3);
  const featuredClasses = openClasses.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 md:pb-8">
      {/* Cinematic Hero Section */}
      <section className="relative">
        <HeroSlider />
        
        {/* SearchBar Overlay: Positioned to sit half-way over the slider */}
        <div className="container mx-auto px-4 -mt-12 relative z-20">
          <div className="max-w-5xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Trending Subjects */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#2D3D6A] mb-2">Trending Subjects</h2>
              <p className="text-muted-foreground">
                Popular subjects students are learning right now
              </p>
            </div>
            <div className="h-1 w-20 bg-[#F57C00] hidden md:block"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onClick={() => navigate('/search')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors - Light Gray Background for Contrast */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#2D3D6A] mb-2">Featured Tutors</h2>
              <p className="text-muted-foreground">
                Top-rated experts ready to help you succeed
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/search')}
              className="hidden md:flex items-center gap-2 border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5] hover:text-white transition-all"
            >
              View All Tutors
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Button 
              className="bg-[#1E88E5] hover:bg-[#1E88E5]/90 w-full"
              onClick={() => navigate('/search')}
            >
              View All Tutors
            </Button>
          </div>
        </div>
      </section>

      {/* Open Classes */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#2D3D6A] mb-2">Open Classes</h2>
              <p className="text-muted-foreground">
                Join upcoming group sessions with available slots
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredClasses.map((openClass) => (
              <ClassCard
                key={openClass.id}
                openClass={openClass}
                onBookClick={() => navigate('/booking')}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}