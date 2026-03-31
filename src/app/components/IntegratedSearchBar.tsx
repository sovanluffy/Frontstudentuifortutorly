import { useState } from "react";
import {
  Search,
  MapPin,
  DollarSign,
  Star,
  Calendar,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { Button } from "./figma/ui/button";
import { subjects as mockSubjects } from "../data/mockData";

interface Props {
  selectedSubject: string;
  onSubjectSelect: (name: string) => void;
}

export function IntegratedSearchBar({ selectedSubject, onSubjectSelect }: Props) {
  return (
    <div className="space-y-10">
      {/* Category Section */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6">
          Specialization
        </label>
        <div className="grid grid-cols-1 gap-2">
          {["All Subjects", "Mathematics", "Physics", "English", "Chemistry"].map((subject) => (
            <button
              key={subject}
              onClick={() => onSubjectSelect(subject)}
              className={`group flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${
                selectedSubject === subject 
                ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                : "bg-transparent text-slate-600 hover:bg-white"
              }`}
            >
              <span className="text-sm font-bold">{subject}</span>
              <div className={`w-1.5 h-1.5 rounded-full transition-all ${
                selectedSubject === subject ? "bg-indigo-400 scale-150" : "bg-slate-300 group-hover:bg-indigo-400"
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Budget Slider Placeholder */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
          Max Hourly Rate
        </label>
        <div className="px-2">
           <input type="range" className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
           <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-500 uppercase">
              <span>$5/hr</span>
              <span>$100/hr</span>
           </div>
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="pt-6 border-t border-slate-200">
         <div className="flex flex-col gap-4">
            {['Verified Only', 'Native Speaker', 'Online Lesson'].map((filter) => (
               <label key={filter} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 border-2 border-slate-200 rounded-md group-hover:border-indigo-500 transition-colors" />
                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{filter}</span>
               </label>
            ))}
         </div>
      </div>
    </div>
  );
}