import * as React from "react";
import { Slider } from '../components/figma/ui/slider';
import { Label } from '../components/figma/ui/label';
import { Checkbox } from '../components/figma/ui/checkbox';
import { Button } from '../components/figma/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/figma/ui/select';

interface FilterSidebarProps {
  budget: number[];
  setBudget: (value: number[]) => void;
}

export function FilterSidebar({ budget, setBudget }: FilterSidebarProps) {
  return (
    <div className="space-y-8 pb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Refine Search</h3>
        <button className="text-[10px] font-bold text-blue-600 hover:underline">Reset All</button>
      </div>

      {/* Subject Filter */}
      <div className="space-y-3">
        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-900">Subject Area</Label>
        <Select>
          <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="math">Mathematics</SelectItem>
            <SelectItem value="english">English Language</SelectItem>
            <SelectItem value="programming">Computer Science</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Budget Filter */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-900">Max Hourly Rate</Label>
          <span className="text-sm font-black text-blue-600">${budget[0]}</span>
        </div>
        <Slider value={budget} onValueChange={setBudget} max={100} step={5} className="py-4" />
      </div>

      {/* Experience */}
      <div className="space-y-4">
        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-900">Tutor Experience</Label>
        <div className="space-y-3">
          {['0-2 years', '3-5 years', '6-10 years', '10+ years'].map((exp) => (
            <div key={exp} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox id={exp} className="w-5 h-5 rounded-md border-slate-300" />
              <label htmlFor={exp} className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors cursor-pointer">
                {exp}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full h-14 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all">
        Apply Filters
      </Button>
    </div>
  );
}