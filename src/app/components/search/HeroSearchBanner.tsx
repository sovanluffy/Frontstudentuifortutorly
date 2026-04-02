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

// --- Types ---
interface HeroSearchBannerProps {
  onFiltersChange: (filters: { search: string; subject: string }) => void;
}

// --- Data Constants ---
const TABS = [
  { id: "all", icon: GraduationCap, label: "All Subjects" },
  { id: "stem", icon: Plane, label: "STEM Tutors" },
  { id: "lang", icon: Train, label: "Languages" },
  { id: "arts", icon: Sparkles, label: "Arts & Design" },
];

const SLIDE_CONTENT = [
  { 
    title: "Your Learning Starts Here", 
    subtitle: "Secure Payment",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1920" 
  },
  { 
    title: "Master Any Skill with Experts", 
    subtitle: "Support in approx. 30s",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1920" 
  }
];

// --- Sub-Component: FilterTab ---
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
        "flex items-center gap-2 px-5 py-2.5 cursor-pointer transition-all duration-200 rounded-full my-1 mx-1",
        isActive 
          ? "bg-white text-[#0F294D] shadow-lg" 
          : "text-white hover:bg-white/10"
      )}
    >
      <Icon size={18} className={isActive ? "text-[#0066FF]" : "text-white/80"} />
      <span className="text-[14px] font-bold whitespace-nowrap">{label}</span>
    </li>
  );
}

// --- Sub-Component: SearchInputs ---
function SearchInputs({ searchValue, setSearchValue, onSearch }: {
  searchValue: string;
  setSearchValue: (val: string) => void;
  onSearch: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl rounded-tl-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 flex flex-col lg:flex-row items-stretch gap-2 border border-white">
      
      {/* Destination Column */}
      <div className="flex-[1.2] px-4 py-2 border border-slate-200 rounded-lg group hover:border-blue-400 transition-colors cursor-text">
        <label className="text-[11px] text-slate-400 font-bold block mb-0.5 uppercase tracking-wide">
          Destination
        </label>
        <input 
          type="text" 
          placeholder="Subject, tutor name, or skill" 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full text-[15px] font-bold text-[#0F294D] outline-none bg-transparent placeholder:text-slate-300"
        />
      </div>

      {/* Date Range Group (Check-in / Out) */}
      <div className="flex-1 flex border border-slate-200 rounded-lg overflow-hidden group hover:border-blue-400 transition-colors">
        <div className="flex-1 px-4 py-2 hover:bg-slate-50 cursor-pointer border-r border-slate-100 transition-colors">
          <p className="text-[11px] text-slate-400 font-bold mb-0.5 uppercase tracking-wide">Check-in</p>
          <span className="text-[15px] font-bold text-[#0F294D]">Thu, Apr 2</span>
        </div>
        
        {/* Floating Night Indicator */}
        <div className="flex items-center justify-center px-1 bg-white relative z-10">
          <span className="text-[10px] text-slate-500 font-semibold bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5 whitespace-nowrap">
            1 night
          </span>
        </div>

        <div className="flex-1 px-4 py-2 hover:bg-slate-50 cursor-pointer transition-colors">
          <p className="text-[11px] text-slate-400 font-bold mb-0.5 uppercase tracking-wide">Check-out</p>
          <span className="text-[15px] font-bold text-[#0F294D]">Fri, Apr 3</span>
        </div>
      </div>

      {/* Rooms and Guests Column */}
      <div className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-slate-50 cursor-pointer group transition-all">
        <p className="text-[11px] text-slate-400 font-bold mb-0.5 uppercase tracking-wide">Rooms and guests</p>
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-bold text-[#0F294D]">1 room, 2 adults, 0 children</span>
          <ChevronDown size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>

      {/* Main Search Button */}
      <div className="flex items-center pl-2 pr-1">
        <button 
          onClick={onSearch}
          className="h-full min-h-[52px] bg-[#0066FF] hover:bg-[#0052CC] text-white flex items-center justify-center gap-2 px-10 py-3 rounded-lg font-bold transition-all shadow-md active:scale-95 min-w-[140px]"
        >
          <Search size={22} strokeWidth={2.5} />
          <span className="text-lg">Search</span>
        </button>
      </div>
    </div>
  );
}

// --- Main Component ---
export function HeroSearchBanner({ onFiltersChange }: HeroSearchBannerProps) {
  const [activeTab, setActiveTab] = React.useState("All Subjects");
  const [searchValue, setSearchValue] = React.useState("");
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Auto-slide effect every 6 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_CONTENT.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const triggerUpdate = () => {
    onFiltersChange({ search: searchValue, subject: activeTab });
  };

  return (
    <section className="relative w-full select-none overflow-hidden pb-20">
      {/* 1. Image Slider Background */}
      <div className="h-[440px] relative flex items-center justify-center text-white overflow-hidden">
        {SLIDE_CONTENT.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-in-out",
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            )}
          >
            <div className="absolute inset-0 bg-black/30 z-10" />
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        {/* Text Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <h1 
            key={currentSlide}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tighter drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700"
          >
            {SLIDE_CONTENT[currentSlide].title}
          </h1>
          
          <div className="flex flex-wrap gap-6 text-[14px] font-bold justify-center">
            <span className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
              <CheckCircle2 size={18} className="text-green-400" /> 
              {SLIDE_CONTENT[currentSlide].subtitle}
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
              <CheckCircle2 size={18} className="text-green-400" /> 
              Flexible Schedules
            </span>
          </div>
        </div>
      </div>

      {/* 2. Floating Search UI */}
      <div className="max-w-[1200px] mx-auto -mt-14 px-6 relative z-40">
        
        {/* Tab Bar Container (#2D3D50 background) */}
        <ul className="flex bg-[#2D3D50] backdrop-blur-md w-fit rounded-t-2xl p-1 shadow-2xl ml-4">
          {TABS.map((tab) => (
            <FilterTab
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              isActive={activeTab === tab.label}
              onClick={() => {
                setActiveTab(tab.label);
                onFiltersChange({ search: searchValue, subject: tab.label });
              }}
            />
          ))}
        </ul>

        {/* Inputs Area */}
        <SearchInputs 
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onSearch={triggerUpdate}
        />
      </div>
    </section>
  );
}