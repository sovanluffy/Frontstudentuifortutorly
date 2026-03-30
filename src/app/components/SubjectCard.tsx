import { Calculator, BookOpen, Code, Award, FlaskConical, Music, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  calculator: Calculator,
  'book-open': BookOpen,
  code: Code,
  award: Award,
  'flask-conical': FlaskConical,
  music: Music,
};

export function SubjectCard({ subject, onClick }: { subject: any, onClick?: () => void }) {
  const Icon = iconMap[subject.icon] || BookOpen;

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-3 p-4 transition-all hover:-translate-y-2 w-full"
    >
      {/* 1. Icon Container: Soft Shadow instead of Border */}
      <div className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] group-hover:shadow-[0_8px_30px_rgba(30,136,229,0.2)] group-hover:scale-110 transition-all duration-300">
        
        {/* Main Icon: Now a deep navy/dark gray by default */}
        <Icon className="w-7 h-7 text-[#1A1A1A] group-hover:text-[#1E88E5] transition-colors relative z-10" />

        {/* 2. Orange Status Accent (TutorHub Gold) */}
        <div className="absolute top-1 right-1 flex h-2.5 w-2.5 z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F57C00] opacity-20"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F57C00] shadow-[0_2px_10px_rgba(245,124,0,0.4)]"></span>
        </div>
      </div>

      <div className="text-center">
        {/* 3. Title: Changed to High-Contrast Obsidian */}
        <h4 className="text-sm font-black text-[#1A1A1A] group-hover:text-[#1E88E5] transition-colors leading-tight uppercase tracking-tight">
          {subject.name}
        </h4>
        
        {/* 4. Subtitle: Darker gray for legibility on white */}
        <p className="text-[10px] text-[#666666] font-bold uppercase tracking-widest mt-1">
          <span className="text-[#F57C00]">{subject.tutorCount} Tutors</span> Available
        </p>
      </div>
    </button>
  );
}