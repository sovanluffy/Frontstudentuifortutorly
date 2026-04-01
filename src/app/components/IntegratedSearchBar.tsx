import { useState } from "react";
import { Search, MapPin, DollarSign, Sparkles, BookOpen, ChevronDown } from "lucide-react";

export function IntegratedSearchBar({ onFiltersChange }: { onFiltersChange?: (f: any) => void }) {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    maxPrice: 100,
    subject: "All Subjects"
  });

  const updateFilter = (key: string, value: any) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFiltersChange?.(updated);
  };

  return (
    <div className="w-full group">
      <div className="relative flex flex-row items-center bg-white border border-slate-200/60 rounded-full p-1.5 shadow-xl shadow-slate-200/30">
        
        {/* INNER CONTENT WRAPPER */}
        <div className="flex flex-row items-center divide-x divide-slate-100 flex-1 min-w-0">
          
          {/* SEARCH FIELD */}
          <div className="flex items-center px-4 flex-[1.5] min-w-0">
            <Search size={16} className="text-orange-500 shrink-0 mr-3" />
            <div className="flex flex-col min-w-0 w-full">
              <span className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Expertise</span>
              <input
                type="text"
                placeholder="Tutor name..."
                className="bg-transparent text-[11px] font-bold text-[#0f172a] outline-none placeholder:text-slate-300 w-full truncate"
                onChange={(e) => updateFilter("search", e.target.value)}
              />
            </div>
          </div>

          {/* SUBJECT DROPDOWN */}
          <div className="flex items-center px-4 flex-1 min-w-0 hidden sm:flex">
            <BookOpen size={16} className="text-blue-500 shrink-0 mr-3" />
            <div className="flex flex-col min-w-0 w-full">
              <span className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Subject</span>
              <div className="relative flex items-center">
                <select 
                  className="bg-transparent text-[11px] font-bold text-[#0f172a] outline-none cursor-pointer appearance-none w-full truncate pr-4"
                  onChange={(e) => updateFilter("subject", e.target.value)}
                >
                  <option>All Subjects</option>
                  <option>Mathematics</option>
                  <option>English</option>
                  <option>Physics</option>
                </select>
                <ChevronDown size={10} className="absolute right-0 text-slate-300 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* PRICE SLIDER */}
          <div className="flex items-center px-6 flex-1 min-w-0">
            <div className="flex flex-col w-full min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Budget</span>
                <span className="text-[9px] font-black text-orange-600">${filters.maxPrice}</span>
              </div>
              <input
                type="range" min="10" max="200" step="5"
                value={filters.maxPrice}
                className="h-1 w-full bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0f172a]"
                onChange={(e) => updateFilter("maxPrice", parseInt(e.target.value))}
              />
            </div>
          </div>

        </div>

        {/* SEARCH BUTTON */}
        <button 
          className="ml-2 bg-[#0f172a] hover:bg-orange-500 text-white h-11 px-6 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shrink-0 flex items-center gap-2 shadow-lg active:scale-95"
          onClick={() => onFiltersChange?.(filters)}
        >
          <Sparkles size={14} className="fill-white" />
          <span className="hidden md:inline">Find</span>
        </button>
      </div>
    </div>
  );
}