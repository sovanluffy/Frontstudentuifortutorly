import { Star, CheckCircle2, Users, Calendar } from 'lucide-react';
import { Tutor } from '../data/mockData';
import { Button } from './figma/ui/button';
import { Badge } from './figma/ui/badge';
import { useNavigate } from 'react-router';

interface TutorCardProps {
  tutor: Tutor;
  onFavoriteToggle?: (tutorId: string) => void;
  isFavorited?: boolean;
}

export function TutorCard({ tutor, onFavoriteToggle, isFavorited }: TutorCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <img
            src={tutor.photo}
            alt={tutor.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="truncate">{tutor.name}</h3>
              {tutor.verified && (
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{tutor.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({tutor.studentsCount} students)
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {tutor.subjects.slice(0, 3).map((subject) => (
                <Badge key={subject} variant="secondary" className="text-xs">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{tutor.experience} years exp</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{tutor.availability.split(':')[0]}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <span className="text-2xl text-primary">${tutor.pricePerHour}</span>
              <span className="text-sm text-muted-foreground">/hour</span>
            </div>
            <Button onClick={() => navigate(`/tutor/${tutor.id}`)}>
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
