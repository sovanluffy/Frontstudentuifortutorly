"use client";

import * as React from "react";
import { 
  GraduationCap, 
  BookOpen, 
  Search, 
  MapPin,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Data for Slides ---
const SLIDES = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1920"
];

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
        "flex items-center gap-2 px-6 py-3 cursor-pointer transition-all duration-300 rounded-t-2xl relative",
        isActive 
          ? "bg-white text-blue-600 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]" 
          : "text-white/70 hover:text-white hover:bg-white/10"
      )}
    >
      <Icon size={18} className={cn("transition-colors", isActive ? "text-blue-600" : "text-white/40")} />
      <span className="text-sm font-bold whitespace-nowrap tracking-tight">{label}</span>
      {isActive && (
        <div className="absolute -right-4 bottom-0 w-4 h-4 bg-white rounded-bl-full shadow-[-2px_2px_0_white]" />
      )}
    </li>
  );
}

export function HeroSearchBanner({ onResultsFound }: { onResultsFound?: (data: any) => void }) {
  const [subjects, setSubjects] = React.useState<any[]>([]);
  const [locations, setLocations] = React.useState<any[]>([]);
  
  const [activeTab, setActiveTab] = React.useState("All Subjects");
  const [selectedLocation, setSelectedLocation] = React.useState("");
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, locRes] = await Promise.all([
          fetch('https://toturhub-dev.onrender.com/api/subjects'),
          fetch('https://toturhub-dev.onrender.com/api/v1/locations')
        ]);
        setSubjects(await subRes.json());
        setLocations(await locRes.json());
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchData();

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const subjectQuery = activeTab === "All Subjects" ? "" : activeTab;
      const response = await fetch(
        `https://toturhub-dev.onrender.com/api/v1/open-classes/filter?location=${selectedLocation}&subject=${subjectQuery}`
      );
      const data = await response.json();
      if (onResultsFound) onResultsFound(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full overflow-hidden pb-16">
      {/* Background Slider */}
      <div className="h-[420px] relative flex items-center justify-center text-white bg-slate-950">
        {SLIDES.map((img, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-in-out",
              index === currentSlide ? "opacity-40 scale-100" : "opacity-0 scale-110"
            )}
          >
            <img src={img} className="w-full h-full object-cover" alt="slide" />
          </div>
        ))}
        
        {/* Dark Overlay with Gradient */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-50" />
        
        <div className="relative z-20 text-center px-4 -mt-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={12} />
            <span>Discover Your Future • ស្វែងរកអនាគតរបស់អ្នក</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter drop-shadow-2xl">
            Find Your Perfect <span className="text-blue-500">Tutor</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 mb-8 font-medium font-khmer">
            ថ្នាក់រៀនដឹកនាំដោយអ្នកជំនាញនៅក្នុងតំបន់របស់អ្នក
            <span className="block text-sm mt-1 text-white/50 font-sans tracking-wide">Expert-led classes in your neighborhood</span>
          </p>

          <div className="flex flex-wrap gap-4 text-[11px] font-black uppercase tracking-widest justify-center opacity-80">
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <CheckCircle2 size={14} className="text-emerald-400" /> Verified Tutors
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <CheckCircle2 size={14} className="text-emerald-400" /> Flexible Schedule
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar Container */}
      <div className="max-w-[1000px] mx-auto -mt-16 px-6 relative z-40">
        {/* Dynamic Subject Tabs */}
        <ul className="flex bg-[#0F172A] w-fit rounded-t-2xl overflow-hidden ml-1 p-1 pb-0">
          <FilterTab
            label="All Subjects"
            icon={GraduationCap}
            isActive={activeTab === "All Subjects"}
            onClick={() => setActiveTab("All Subjects")}
          />
          {subjects.slice(0, 3).map((sub) => (
            <FilterTab
              key={sub.id}
              label={sub.name}
              icon={BookOpen}
              isActive={activeTab === sub.name}
              onClick={() => setActiveTab(sub.name)}
            />
          ))}
        </ul>

        {/* Search Main Box */}
        <div className="bg-white rounded-[2rem] rounded-tl-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-3 flex flex-col md:flex-row items-stretch gap-3 border border-slate-100">
          
          {/* Location Selection */}
          <div className="group flex-1 flex items-center px-6 py-4 border border-slate-50 rounded-2xl hover:bg-slate-50/50 hover:border-blue-200 transition-all duration-300">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors mr-4">
              <MapPin size={20} />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-slate-400 font-black block uppercase tracking-wider mb-0.5">
                Location <span className="font-khmer font-normal opacity-70 ml-1">ទីតាំង</span>
              </label>
              <select 
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full text-base font-bold text-slate-900 outline-none bg-transparent cursor-pointer"
              >
                <option value="">Search Location...</option>
                {locations.map((loc) => (
                  <option key={loc.locationId} value={loc.district}>
                    {loc.district}, {loc.city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Selection */}
          <div className="group flex-1 flex items-center px-6 py-4 border border-slate-50 rounded-2xl hover:bg-slate-50/50 hover:border-blue-200 transition-all duration-300">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors mr-4">
              <BookOpen size={20} />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-slate-400 font-black block uppercase tracking-wider mb-0.5">
                Subject <span className="font-khmer font-normal opacity-70 ml-1">មុខវិជ្ជា</span>
              </label>
              <select 
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full text-base font-bold text-slate-900 outline-none bg-transparent cursor-pointer"
              >
                <option value="All Subjects">Select Subject</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Action Button */}
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-3 px-12 py-5 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-70 shadow-lg shadow-blue-200"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search size={22} strokeWidth={3} />
            )}
            <div className="flex flex-col items-start leading-none">
              <span className="text-lg">Search</span>
              <span className="text-[10px] font-medium font-khmer opacity-80">ស្វែងរក</span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}