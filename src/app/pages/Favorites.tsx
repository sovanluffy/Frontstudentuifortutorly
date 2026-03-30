import { useState } from 'react';
import { TutorCard } from '../components/TutorCard';
import { tutors } from '../data/mockData';
import { Heart } from 'lucide-react';

export function Favorites() {
  const [favoritedIds, setFavoritedIds] = useState<string[]>(['1', '3', '5']);

  const favoriteTutors = tutors.filter((tutor) =>
    favoritedIds.includes(tutor.id)
  );

  const handleToggleFavorite = (tutorId: string) => {
    setFavoritedIds((prev) =>
      prev.includes(tutorId)
        ? prev.filter((id) => id !== tutorId)
        : [...prev, tutorId]
    );
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-2">My Favorites</h1>
          <p className="text-muted-foreground">
            {favoriteTutors.length} saved tutors
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {favoriteTutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteTutors.map((tutor) => (
              <TutorCard
                key={tutor.id}
                tutor={tutor}
                isFavorited={favoritedIds.includes(tutor.id)}
                onFavoriteToggle={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2">No favorites yet</h2>
            <p className="text-muted-foreground max-w-md">
              Start adding tutors to your favorites to easily find them later
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
