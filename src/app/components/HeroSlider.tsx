import * as React from "react";
import { Search, GraduationCap, Plane, Train, Car, Sparkles, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils"; 

// Data mapping travel concepts to academic concepts
const searchTabs = [
  { id: "hotels", icon: <GraduationCap size={16}/>, label: "All Subjects", active: true },
  { id: "flights", icon: <Plane size={16}/>, label: "STEM Tutors" },
  { id: "trains", icon: <Train size={16}/>, label: "Languages" },
  { id: "cars", icon: <Car size={16}/>, label: "Arts & Design" },
  { id: "tours", icon: <Sparkles size={16}/>, label: "Test Prep" },
  { id: "plus", icon: <GraduationCap size={16}/>, label: "Tutor + Course" },
];

export function HeroSearchBanner() {
  const [activeTab, setActiveTab] = React.useState("Hotels & Homes");

  return (
    <section className="relative w-full py-0 select-none">
      {/* --- 1. THE BANNER (Dynamic Blue Gradient/Image) --- */}
      <div className="h-[320px] bg-gradient-to-r from-[#1a4fa0] via-[#2a87da] to-[#0d3b82] flex flex-col items-center justify-center text-white px-4 relative overflow-hidden">
        
        {/* Subtle texture/image over gradient for depth */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight">
            Your Learning Starts Here
          </h1>
          
          <div className="flex gap-8 text-sm opacity-90 justify-center">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-400" /> Secure Payments</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-400" /> Support in approx. 30s</span>
          </div>
        </div>
      </div>

      {/* --- 2. THE FLOATING SEARCH BAR --- */}
      <div className="max-w-[1200px] mx-auto -mt-16 px-6 relative z-20">
        
        {/* The Tabs Bar (Dark Gray) */}
        <div className="inline-flex bg-[#2D3D50] p-1 rounded-t-xl overflow-hidden shadow-lg">
          {searchTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={cn(
                "px-5 py-2.5 text-[13px] font-bold transition-all flex items-center gap-2 rounded-lg",
                activeTab === tab.label 
                  ? "bg-white text-blue-600 shadow-inner" 
                  : "text-white hover:bg-white/10"
              )}
            >
              {tab.icon}
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* The Main Input Area (White) */}
        <div className="bg-white rounded-xl rounded-tl-none shadow-2xl p-4 flex flex-col md:flex-row items-stretch gap-0 border-2 border-white/20">
          
          {/* Destination / Subject Input */}
          <div className="flex-1 border-r border-slate-100 p-3 hover:bg-slate-50 transition-colors cursor-pointer rounded-l-lg">
            <p className="text-[11px] text-slate-400 font-bold uppercase mb-1.5 tracking-wider">Destination / Subject</p>
            <div className="flex items-center gap-2.5">
              <input 
                type="text" 
                placeholder="Find tutor by name, city, or subject..." 
                className="w-full text-sm font-extrabold bg-transparent outline-none text-slate-800 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Dates / Schedule */}
          <div className="flex-[0.7] border-r border-slate-100 p-3 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase mb-1.5 tracking-wider">Check-in</p>
                <p className="text-sm font-bold text-slate-800">Select Date</p>
              </div>
              <div className="text-[10px] self-center bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">First Session</div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase mb-1.5 tracking-wider text-right">Check-out</p>
                <p className="text-sm font-bold text-slate-800 text-right">Select Date</p>
              </div>
            </div>
          </div>

          {/* Type / Skill Level */}
          <div className="flex-[0.5] border-r border-slate-100 p-3 hover:bg-slate-50 transition-colors cursor-pointer">
            <p className="text-[11px] text-slate-400 font-bold uppercase mb-1.5 tracking-wider">Tutor Type / Level</p>
            <p className="text-sm font-bold text-slate-800">Pro (Expert)</p>
          </div>

          {/* Submit Button */}
          <div className="p-3 pl-4 flex items-center shrink-0">
            <button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-12 py-4 rounded-lg font-black transition-all h-full shadow-lg shadow-blue-100">
              <Search size={18} strokeWidth={3} />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}