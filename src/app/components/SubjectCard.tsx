import { 
  Calculator, 
  BookOpen, 
  Code, 
  Award, 
  FlaskConical, 
  Music,
  LucideIcon 
} from 'lucide-react';
import { Subject } from '../data/mockData';

interface SubjectCardProps {
  subject: Subject;
  onClick?: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  calculator: Calculator,
  'book-open': BookOpen,
  code: Code,
  award: Award,
  'flask-conical': FlaskConical,
  music: Music,
};

export function SubjectCard({ subject, onClick }: SubjectCardProps) {
  const Icon = iconMap[subject.icon] || BookOpen;

  return (
    <button
      onClick={onClick}
      className="bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md hover:border-primary transition-all text-left w-full"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h4 className="mb-1">{subject.name}</h4>
          <p className="text-sm text-muted-foreground">
            {subject.tutorCount} tutors
          </p>
        </div>
      </div>
    </button>
  );
}
