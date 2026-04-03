import * as React from "react";
import { 
  GraduationCap, 
  Plane, 
  Train, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  ChevronDown 
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Data for Slides ---
const SLIDES = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1920"
];

// --- Sub-Component: FilterTab (Compact) ---
function FilterTab({ label, icon: Icon, isActive, onClick }: { 
  label: string; 
  icon: any; 
  isActive: boolean; 
  onClick: () => void 
}) {
  return (
    <li 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-1.5 cursor-pointer transition-all duration-200 rounded-t-xl",
        isActive ? "bg-white text-[#0F294D]" : "text-white/90 hover:bg-white/10"
      )}
    >
      <Icon size={16} className={isActive ? "text-[#0066FF]" : "text-white/70"} />
      <span className="text-[13px] font-bold whitespace-nowrap">{label}</span>
    </li>
  );
}

// --- Sub-Component: SearchInputs (Compact) ---
function SearchInputs({ searchValue, setSearchValue, onSearch }: any) {
  return (
    <div className="bg-white rounded-xl rounded-tl-none shadow-xl p-1.5 flex flex-col lg:flex-row items-stretch gap-1.5 border border-white">
      <div className="flex-[1.2] px-3 py-1.5 border border-slate-100 rounded-lg group hover:border-blue-400 transition-colors">
        <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-tight">Subject or Tutor</label>
        <input 
          type="text" 
          placeholder="What do you want to learn?" 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full text-[14px] font-bold text-[#0F294D] outline-none bg-transparent"
        />
      </div>
      <div className="flex-1 flex border border-slate-100 rounded-lg overflow-hidden">
        <div className="flex-1 px-3 py-1.5 border-r border-slate-50 hover:bg-slate-50 cursor-pointer">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Check-in</p>
          <span className="text-[14px] font-bold text-[#0F294D]">Apr 2</span>
        </div>
        <div className="flex-1 px-3 py-1.5 hover:bg-slate-50 cursor-pointer">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Check-out</p>
          <span className="text-[14px] font-bold text-[#0F294D]">Apr 3</span>
        </div>
      </div>
      <div className="flex-1 px-3 py-1.5 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Trainees</p>
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#0F294D]">1 Adult, 0 Child</span>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>
      <button 
        onClick={onSearch}
        className="bg-[#0066FF] hover:bg-[#0052CC] text-white flex items-center justify-center gap-2 px-8 rounded-lg font-bold transition-all active:scale-95"
      >
        <Search size={18} strokeWidth={2.5} />
        <span className="text-[15px]">Search</span>
      </button>
    </div>
  );
}

// --- Main Component ---
export function HeroSearchBanner({ onFiltersChange }: any) {
  const [activeTab, setActiveTab] = React.useState("All Subjects");
  const [searchValue, setSearchValue] = React.useState("");
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Auto-Slide Logic
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden pb-10">
      {/* Auto-sliding Background */}
      <div className="h-[320px] relative flex items-center justify-center text-white bg-[#0F294D]">
        {SLIDES.map((img, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentSlide ? "opacity-60" : "opacity-0"
            )}
          >
            <img src={img} className="w-full h-full object-cover" alt="slide" />
          </div>
        ))}
        
        {/* Static Overlay Content */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 to-black/40" />
        
        <div className="relative z-20 text-center px-4 -mt-10">
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter drop-shadow-lg">
            Master Any Skill with Experts
          </h1>
          <div className="flex flex-wrap gap-4 text-[12px] font-bold justify-center opacity-90">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-400" /> Secure Payment</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-400" /> 24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Search Bar - Positioned over the slider */}
      <div className="max-w-[1100px] mx-auto -mt-12 px-6 relative z-40">
        <ul className="flex bg-[#2D3D50] w-fit rounded-t-xl overflow-hidden ml-2">
          {[
            { id: "all", icon: GraduationCap, label: "All Subjects" },
            { id: "stem", icon: Plane, label: "STEM" },
            { id: "lang", icon: Train, label: "Languages" },
            { id: "arts", icon: Sparkles, label: "Arts" },
          ].map((tab) => (
            <FilterTab
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              isActive={activeTab === tab.label}
              onClick={() => setActiveTab(tab.label)}
            />
          ))}
        </ul>

        <SearchInputs 
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onSearch={() => onFiltersChange?.({ search: searchValue, subject: activeTab })}
        />
      </div>
    </section>
  );
}