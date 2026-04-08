import { useNavigate } from "react-router-dom";
import { OpenClass } from "@/types/types";
import { Button } from "@/app/components/figma/ui/button";

// Extending the interface locally to fix the Property 'coverImage' error
interface ExtendedOpenClass extends OpenClass {
  coverImage?: string;
}

interface ClassCardProps {
  openClass: ExtendedOpenClass;
}

export const ClassCard = ({ openClass }: ClassCardProps) => {
  const navigate = useNavigate();

  // Navigation helper
  const handleNavigation = () => {
    navigate(`/classes/${openClass.classId}`);
  };

  return (
    <div 
      onClick={handleNavigation}
      className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col sm:flex-row gap-4 p-4 hover:shadow-md hover:border-blue-400 transition-all duration-200 w-full cursor-pointer"
    >
      {/* IMAGE SECTION */}
      <div className="w-full sm:w-32 h-24 sm:h-32 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative">
        {openClass.coverImage ? (
          <img
            src={openClass.coverImage}
            alt={openClass.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px] uppercase font-bold">
            No Image
          </div>
        )}
        {/* Price Badge for Mobile Layout */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold shadow-sm sm:hidden">
          ${openClass.basePrice}
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h2 className="font-bold text-base text-slate-900 truncate group-hover:text-blue-600 transition-colors">
            {openClass.title}
          </h2>
          <p className="text-xs text-slate-600 line-clamp-2 mt-1">
            {openClass.description || "No description available."}
          </p>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {openClass.subjects?.map((s, i) => (
              <span key={i} className="text-[10px] bg-slate-50 text-slate-500 border border-slate-100 px-1.5 py-0.5 rounded">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* FOOTER SECTION */}
        <div className="flex justify-between items-end mt-3 pt-2 border-t border-slate-50 sm:border-none">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-slate-400">
              {openClass.currentStudents}/{openClass.maxStudents} students
            </span>
            <span className="text-sm font-bold text-slate-900">
              ${openClass.basePrice}
            </span>
          </div>

          <Button 
            size="sm" 
            className="h-8 px-4 text-xs font-semibold shadow-sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevents the parent div's onClick from firing twice
              handleNavigation();
            }}
          >
            Open
          </Button>
        </div>
      </div>
    </div>
  );
};