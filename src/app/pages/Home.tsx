import { useNavigate } from 'react-router';
import { SearchBar } from '../components/SearchBar';
import { SubjectCard } from '../components/SubjectCard';
import { TutorCard } from '../components/TutorCard';
import { ClassCard } from '../components/ClassCard';
import { subjects, tutors, openClasses } from '../data/mockData';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

export function Home() {
  const navigate = useNavigate();

  const featuredTutors = tutors.slice(0, 3);
  const featuredClasses = openClasses.slice(0, 3);

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-cyan-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl mb-4">
              Find the Best Tutor Near You
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with expert tutors for personalized learning experiences
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Trending Subjects */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="mb-2">Trending Subjects</h2>
              <p className="text-muted-foreground">
                Popular subjects students are learning
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

      {/* Featured Tutors */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="mb-2">Featured Tutors</h2>
              <p className="text-muted-foreground">
                Top-rated tutors ready to help you succeed
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/search')}
              className="hidden md:flex items-center gap-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <Button variant="outline" onClick={() => navigate('/search')}>
              View All Tutors
            </Button>
          </div>
        </div>
      </section>

      {/* Open Classes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="mb-2">Open Classes</h2>
              <p className="text-muted-foreground">
                Join upcoming classes with available slots
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
