import { Clock, Video, Home, User } from 'lucide-react';
import { OpenClass } from '../data/mockData';
import { Button } from './figma/ui/button';
import { Badge } from './figma/ui/badge';

interface ClassCardProps {
  openClass: OpenClass;
  onBookClick?: (classId: string) => void;
}

export function ClassCard({ openClass, onBookClick }: ClassCardProps) {
  const getModeIcon = () => {
    switch (openClass.teachingMode) {
      case 'online':
        return <Video className="w-4 h-4" />;
      case 'tutor-home':
        return <Home className="w-4 h-4" />;
      case 'student-home':
        return <User className="w-4 h-4" />;
    }
  };

  const getModeLabel = () => {
    switch (openClass.teachingMode) {
      case 'online':
        return 'Online';
      case 'tutor-home':
        return "Tutor's Home";
      case 'student-home':
        return "Student's Home";
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="mb-2">{openClass.subject}</h4>
          <p className="text-sm text-muted-foreground mb-2">
            with {openClass.tutorName}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          {getModeIcon()}
          {getModeLabel()}
        </Badge>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{openClass.duration} min</span>
        </div>
        <span>{openClass.nextSlot}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div>
          <span className="text-xl text-primary">${openClass.price}</span>
        </div>
        <Button
          variant="outline"
          onClick={() => onBookClick?.(openClass.id)}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}
